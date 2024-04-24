import { HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import * as mysql from 'mysql2';
const { DateTime } = require('luxon');
@Injectable()
export class NewGetsterService {
  async getNewGetster(pageno: number, per_page: number,CampId:number): Promise<any> {
    try {
      // console.log(CampId,'CampId');
      const getResult: any = [];
      let offset = pageno * per_page;
      const tableRowCount = await dbConnection.query(`
       SELECT 
        count(*) as row_count
        FROM manage_getsters_db.getster_profile a
        left join       
        manage_getsters_db.registered_users_registered_getster_categories b
        on a.getster_id=b.getster_id left join manage_getsters_db.getster_category c
        on b.getster_category_id = c.getster_category_id
        left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps d
        on c.getster_category_id = d.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master e 
        on d.camp_id = e.camp_id
        where a.getster_registration_login_approval_status = 0 and c.getster_category_type = 3 and e.camp_id =${mysql.escape(CampId)}
        group by a.getster_id
      
      `);
      // console.log(tableRowCount);

      const getsterNameId = await dbConnection.query(` 
        SELECT 
        DISTINCT
        a.first_name,
        a.last_name,
        a.getster_id,
        a.previous_login_image_of_the_day_ceph_object_id
        FROM manage_getsters_db.getster_profile a
        left join       
        manage_getsters_db.registered_users_registered_getster_categories b
        on a.getster_id=b.getster_id left join manage_getsters_db.getster_category c
        on b.getster_category_id = c.getster_category_id 
        left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps d
        on c.getster_category_id = d.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master e 
        on d.camp_id = e.camp_id
        where a.getster_registration_login_approval_status = 0 and c.getster_category_type = 3 and e.camp_id =${mysql.escape(CampId)}
        order by a.getster_id
        > 0 * 5 LIMIT ${offset},${per_page}
              `);
      let b: any[] = [];
      for (let i = 0; i < getsterNameId.length; i++) {
        let a: any[] = [];
        const category_id = await dbConnection.query(`
      SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
      where getster_id=${getsterNameId[i].getster_id};
          `);
        // console.log(category_id.length);

        for (let j = 0; j < category_id.length; j++) {
          // // length for table
          let category_table_length = await dbConnection.query(`
        select * from manage_getsters_db.getster_category          
        `);

          let result1 = category_id[j].getster_category_id;
          let AlldataforStudent: any[] = [];
          for (let i = 0; i < category_table_length.length; i++) {
            let result = await dbConnection.query(`
            SELECT * FROM manage_getsters_db.getster_category 
            where getster_category_id='${result1}'             
            `);
            if (result.length > 0) {
              result1 = result[0].parent_getster_category_id;
              AlldataforStudent.push(result[0].getster_category_name);
            }
          }
          // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
          a.push(AlldataforStudent.reverse().toString().replace(/,/g, '/'));
          // console.log(a);
        }
        b.push(a);
      }
      for (let i = 0; i < getsterNameId.length; i++) {
        getResult.push({
          ...getsterNameId[i],
          row_count: tableRowCount.length,
          getster_category_name: b[i],
        });
      }
      return {
        status: HttpStatus.OK,
        message: 'Get Successful',
        data: getResult,
      };
    } catch {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }
  async updateNewGetster(body: any, loginData: any): Promise<any> {
    // console.log(body.getster_id);

    try {
      const dateTime = loginData.user.time_zone_iana_string;
      var local = DateTime.local({ zone: dateTime });
      var overrideZone = DateTime.fromISO(local, {
        zone: dateTime,
      });
      var entry_local_date_time = overrideZone.toString();

      // const {
      //   getster_id,
      //   approval_status,
      //   entry_getster_id,
      //   date_time,
      //   entry_status,
      // } = body;
      // console.log('called', loginData);

      const data = await dbConnection.query(`
           UPDATE manage_getsters_db.getster_profile
          SET
          getster_registration_login_approval_status = ${mysql.escape(
            body.approval_status,
          )}
         
          WHERE getster_id =${mysql.escape(body.getster_id)}
       `);
      await dbConnection.query(`
        UPDATE manage_getsters_db.getster_login_data
        SET
        getster_registration_login_approval_status = ${mysql.escape(
          body.approval_status,
        )},
        number_of_failed_attempts_for_the_day = 0
        WHERE getster_id =${mysql.escape(body.getster_id)}
     `);

      await dbConnection.query(`
      INSERT INTO manage_getsters_db.getster_profile_audit_trail
      (
      getster_id,
      entry_type,
      entry_date_time,
      entry_by_getster_id
      )
      VALUES
      (
      ${mysql.escape(body.getster_id)},
       ${mysql.escape(body.entry_status)},
      date_format( ${mysql.escape(entry_local_date_time)},'%y-%m-%d %h:%i:%s'),
      ${mysql.escape(loginData.user.getster_id)}
      );
      `);
      // console.log('called');

      return {
        status: HttpStatus.OK,
        message: 'Update Successful',
      };
    } catch (e) {
      console.log(e);

      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }
  async getGesterProfile(getster_id: number): Promise<any> {
    try {
      const getsterNameId = await dbConnection.query(`
      SELECT
      getster_id,
      first_name,
      last_name,
      registered_mobile_number,
      previous_login_image_of_the_day_ceph_object_id,
      additional_getster_data_field_values
      FROM manage_getsters_db.getster_profile
      where getster_id=${mysql.escape(getster_id)}`);
      // console.log(data);

      let b: any[] = [];
      for (let i = 0; i < getsterNameId.length; i++) {
        let a: any[] = [];
        const category_id = await dbConnection.query(`
      SELECT getster_category_id FROM 
      manage_getsters_db.registered_users_registered_getster_categories
      where getster_id=${getsterNameId[i].getster_id};
          `);
        // console.log(category_id.length);

        for (let j = 0; j < category_id.length; j++) {
          // // length for table
          let category_table_length = await dbConnection.query(`
        select * from manage_getsters_db.getster_category          
        `);

          let result1 = category_id[j].getster_category_id;
          let AlldataforStudent: any[] = [];
          for (let i = 0; i < category_table_length.length; i++) {
            let result = await dbConnection.query(`
            SELECT * FROM manage_getsters_db.getster_category 
            where getster_category_id='${result1}'             
            `);
            if (result.length > 0) {
              result1 = result[0].parent_getster_category_id;
              AlldataforStudent.push(result[0].getster_category_name);
            }
          }
          // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
          a.push(AlldataforStudent.reverse().toString().replace(/,/g, '/'));
          // console.log(a);
        }
        b.push(a);
      }
      const getResult: any = [];
      for (let i = 0; i < getsterNameId.length; i++) {
        getResult.push({
          getster_category_name: b[i],
          ...getsterNameId[i],
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Get Successful',
        data: getResult,
      };
    } catch {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }

  async getAuditTrail(pageno, per_page): Promise<any> {
    try {
      const getserCategory: any = [];
      const getster_category_name: any = [];
      const getResult: any = [];

      const table_row_count =
        await dbConnection.query(`SELECT COUNT(*) AS row_count FROM
      manage_getsters_db.getster_profile_audit_trail ;`);
      let offset = pageno * per_page;
      const auditTrail = await dbConnection.query(`
      SELECT 
        a.getster_id,
        c.first_name,
        c.last_name, 
        a.entry_type,
        b.previous_login_image_of_the_day_ceph_object_id as login_user_profile,
        c.previous_login_image_of_the_day_ceph_object_id as user_profile,
       	date_format(a.entry_date_time,'%Y-%m-%d %H:%i:%s') as entry_date_time,
        a.entry_by_getster_id as login_user_id,
        b.first_name as login_user_first_name,
        b.last_name as login_user_second_name
        FROM manage_getsters_db.getster_profile_audit_trail a
        left join   manage_getsters_db.getster_profile b on a.entry_by_getster_id = b.getster_id
        left join  manage_getsters_db.getster_profile c on a.getster_id = c.getster_id
        > 0 * 5 order by a.entry_date_time desc  LIMIT ${offset}  ,${per_page}
      `);

      for (let i = 0; i < auditTrail.length; i++) {
        const category_id = await dbConnection.query(`
       SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
       where getster_id=${auditTrail[i].login_user_id};
           `);
        // console.log(category_id.length);

        for (let j = 0; j < category_id.length; j++) {
          let category_table_length = await dbConnection.query(`
                 select * from manage_getsters_db.getster_category
                 `);

          let result1 = category_id[j].getster_category_id;
          let AlldataforStudent: any[] = [];
          for (let i = 0; i < category_table_length.length; i++) {
            let result = await dbConnection.query(`
                     SELECT * FROM manage_getsters_db.getster_category
                     where getster_category_id='${result1}'
                     `);
            if (result.length > 0) {
              result1 = result[0].parent_getster_category_id;
              AlldataforStudent.push(result[0].getster_category_name);
            }
          }
          // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
          getserCategory.push(
            AlldataforStudent.reverse().toString().replace(/,/g, '/'),
          );
        }
      }

      for (let i = 0; i < auditTrail.length; i++) {
        const category_id = await dbConnection.query(`
       SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
       where getster_id=${auditTrail[i].getster_id};
           `);
        // console.log(category_id.length);

        for (let j = 0; j < category_id.length; j++) {
          let category_table_length = await dbConnection.query(`
                 select * from manage_getsters_db.getster_category
                 `);

          let result1 = category_id[j].getster_category_id;
          let AlldataforStudent: any[] = [];
          for (let i = 0; i < category_table_length.length; i++) {
            let result = await dbConnection.query(`
                     SELECT * FROM manage_getsters_db.getster_category
                     where getster_category_id='${result1}'
                     `);
            if (result.length > 0) {
              result1 = result[0].parent_getster_category_id;
              AlldataforStudent.push(result[0].getster_category_name);
            }
          }
          // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
          getster_category_name.push(
            AlldataforStudent.reverse().toString().replace(/,/g, '/'),
          );
        }
      }
      for (let i = 0; i < auditTrail.length; i++) {
        getResult.push({
          ...auditTrail[i],
          ...table_row_count[0],
          getster_category: getster_category_name[i],
          login_getster_category_name: getserCategory[i],
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Get Successful',
        data: getResult,
      };
    } catch (error) {
      console.log(error);

      return {
        status: HttpStatus.BAD_GATEWAY,
        message: 'Invalid Request',
        //  data: data,
      };
    }
  }
}
