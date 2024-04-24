/* eslint-disable prefer-const */
import { HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import * as mysql from 'mysql2';
@Injectable()
export class BlockedGetsterService {
  async getManualBockGetster(pageNo: number, pageSize: number,campId:number): Promise<any> {
    try {
      const getResult: any = [];
      const getserCategory: any = [];
      const entryUserCategory: any = [];
      let offset = pageNo * pageSize;
      const tableRowCount = await dbConnection.query(`
      select  count(*) as row_count 
      from manage_getsters_db.getster_profile a
      left join manage_getsters_db.getster_login_data d on d.getster_id =a.getster_id
      left join manage_getsters_db.registered_users_registered_getster_categories e 
      on a.getster_id = e.getster_id 
      left join manage_getsters_db.getster_category f
      on e.getster_category_id = f.getster_category_id
      left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps g
        on f.getster_category_id = g.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master h 
        on g.camp_id = h.camp_id
      where a.getster_registration_login_approval_status = 2 and
      d.getster_registration_login_approval_status = 2 and f.getster_category_type = 3 and h.camp_id =${mysql.escape(campId)}
      
      `);

      const getsterNameId = await dbConnection.query(`
        SELECT a.getster_id as blocked_getster_id ,
        b.first_name as blocked_user_first_name,
        b.last_name as blocked_user_last_name,
        b.previous_login_image_of_the_day_ceph_object_id as blacked_user_profile,
        (select entry_by_getster_id FROM manage_getsters_db.getster_profile_audit_trail b
        where b.getster_id=a.getster_id AND b.entry_type='Blocked' order by b.entry_date_time desc limit 1
        ) as entry_by_getster_id,
        (select 
        c.first_name 
         FROM manage_getsters_db.getster_profile_audit_trail b
        left join manage_getsters_db.getster_profile c on c.getster_id =b.entry_by_getster_id
        where b.getster_id=a.getster_id AND b.entry_type='Blocked' order by b.entry_date_time desc limit 1
        ) as entry_user_first_name,
         (select 
        c.previous_login_image_of_the_day_ceph_object_id 
         FROM manage_getsters_db.getster_profile_audit_trail b
        left join manage_getsters_db.getster_profile c on c.getster_id =b.entry_by_getster_id
        where b.getster_id=a.getster_id AND b.entry_type='Blocked' order by b.entry_date_time desc limit 1
        ) as entry_user_profile,
        (select 
        c.last_name 
         FROM manage_getsters_db.getster_profile_audit_trail b
        left join manage_getsters_db.getster_profile c on c.getster_id =b.entry_by_getster_id
        where b.getster_id=a.getster_id AND b.entry_type='Blocked' order by b.entry_date_time desc limit 1
        ) as entry_user_last_name,
        (select b.entry_date_time FROM manage_getsters_db.getster_profile_audit_trail b
        where b.getster_id=a.getster_id AND b.entry_type='Blocked' order by b.entry_date_time desc limit 1
        ) as entry_date_time
        
        FROM manage_getsters_db.getster_profile a
        left join manage_getsters_db.getster_profile b on b.getster_id =a.getster_id 
        left join manage_getsters_db.registered_users_registered_getster_categories c 
        on a.getster_id = c.getster_id left join 
        manage_getsters_db.getster_category d
        on d.getster_category_id = c.getster_category_id
        left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps g
        on d.getster_category_id = g.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master h 
        on g.camp_id = h.camp_id
        where a.getster_registration_login_approval_status = 2 and d.getster_category_type =3 and h.camp_id =${mysql.escape(campId)} order by a.getster_id
        > 0 * 5 LIMIT ${offset},${pageSize}
          `);

      for (let i = 0; i < getsterNameId.length; i++) {
        const category_id = await dbConnection.query(`
         SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
         where getster_id=${getsterNameId[i].blocked_getster_id};
             `);
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

      for (let i = 0; i < getsterNameId.length; i++) {
        const category_id = await dbConnection.query(`
       SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
       where getster_id=${getsterNameId[i].entry_by_getster_id};
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
          entryUserCategory.push(
            AlldataforStudent.reverse().toString().replace(/,/g, '/'),
          );
        }
      }
      for (let i = 0; i < getsterNameId.length; i++) {
        getResult.push({
          ...getsterNameId[i],
          row_count: tableRowCount[0].row_count,
          blocked_getster_category_name: getserCategory[i],
          entry_getster_category_name: entryUserCategory[i],
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
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }

  async getAutoBockGetster(pageNo: number, pageSize: number,campId:number): Promise<any> {
    try {
      const getResult: any = [];
      const getserCategory: any = [];
      const entryUserCategory: any = [];
      let offset = pageNo * pageSize;
      const tableRowCount = await dbConnection.query(`
       SELECT 
       count(*) as row_count
        FROM manage_getsters_db.getster_profile a
        left join manage_getsters_db.getster_login_data d on d.getster_id =a.getster_id
        left join manage_getsters_db.getster_profile c on c.getster_id =d.getster_id
        left join manage_getsters_db.registered_users_registered_getster_categories e 
        d.getster_id = e.getster_id 
        left join manage_getsters_db.getster_category f
        e.getster_category_id = f.getster_category_id 
        left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps g
        on f.getster_category_id = g.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master h 
        on g.camp_id = h.camp_id
        where d.number_of_failed_attempts_for_the_day > 9 and a.getster_registration_login_approval_status = 4 and
        d.getster_registration_login_approval_status = 4 and f.getster_category_type = 3 and h.camp_id =${mysql.escape(campId)}
        group by a.getster_id
      
      `);
      const getsterNameId = await dbConnection.query(` 
          SELECT 
          DISTINCT
          c.first_name,
          c.last_name,
          d.getster_id,
          d.login_block_datetime,
          d.number_of_failed_attempts_for_the_day,
          a.previous_login_image_of_the_day_ceph_object_id
          FROM manage_getsters_db.getster_profile a
          left join manage_getsters_db.getster_login_data d on d.getster_id =a.getster_id
          left join manage_getsters_db.getster_profile c on c.getster_id =d.getster_id
          left join manage_getsters_db.registered_users_registered_getster_categories e 
          on d.getster_id = e.getster_id 
          left join manage_getsters_db.getster_category f
          on e.getster_category_id = f.getster_category_id
          left join 
          manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps g
          on f.getster_category_id = g.getster_category_id left join 
          manage_camps_collection_centers.1_getsterapp_campsites_master h 
          on g.camp_id = h.camp_id
          where d.number_of_failed_attempts_for_the_day > 9 and a.getster_registration_login_approval_status = 4 and
          d.getster_registration_login_approval_status = 4 and f.getster_category_type = 3 and h.camp_id =${mysql.escape(campId)}
           > 0 * 5 LIMIT ${offset},${pageSize}
                    `);

      for (let i = 0; i < getsterNameId.length; i++) {
        const category_id = await dbConnection.query(`
       SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
       where getster_id=${mysql.escape(getsterNameId[i].getster_id)};
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

      for (let i = 0; i < getsterNameId.length; i++) {
        getResult.push({
          ...getsterNameId[i],
          row_count: tableRowCount.length,
          getster_category_name: getserCategory[i],
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

  async checkRollBack(): Promise<any> {
    const queryRunner = dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await dbConnection.query(`
        
       INSERT INTO 10_edu_customer_db.user_profile
        (
        user_id,
        registered_mobile_country_code,
        registered_mobile_no
        
        )
        VALUES
        (
        5,
        "91",
        "9566970629"
        );
        
      `);
      await dbConnection.query(`
        
       INSERT INTO 10_edu_customer_db.user_profile
        (
        user_id,
        registered_mobile_country_code,
        registered_mobile_no
        )
        VALUES
        (
        6,
        "91",
        "9566970629"
        );
      `);
      await dbConnection.query(`
        
       INSERT INTO 10_edu_customer_db.user_profile
        (
        user_id,
        registered_mobile_country_code,
        registered_mobile_no
        )
        VALUES
        (
        6,
        "91",
        "9566970629"
        );
      `);
      await queryRunner.commitTransaction();
      return {
        status: HttpStatus.OK,
        message: 'Data Get Successfully',
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }
}
