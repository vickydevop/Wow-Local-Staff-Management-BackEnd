/* eslint-disable prefer-const */
import { HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
import * as mysql from 'mysql2';

@Injectable()
export class ExistingGetsterService {
  async getExistingGetster(pageNo: number, pageSize: number,CampId:number): Promise<any> {
    try {
      const getResult: any = [];
      let offset = pageNo * pageSize;
      const tableRowCount = await dbConnection.query(`
       SELECT 
       count(*) as row_count
        FROM manage_getsters_db.getster_profile a
        left join       
        manage_getsters_db.registered_users_registered_getster_categories b
        on a.getster_id=b.getster_id left join manage_getsters_db.getster_category c
        on b.getster_category_id = c.getster_category_id 
        left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps e
        on c.getster_category_id = e.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master f 
        on e.camp_id = f.camp_id
        where a.getster_registration_login_approval_status = 1 and c.getster_category_type = 3 and f.camp_id =${mysql.escape(CampId)}
        order by a.getster_id
      `);
      // console.log(tableRowCount[0].row_count,'getResult');

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
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps e
        on c.getster_category_id = e.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master f 
        on e.camp_id = f.camp_id
        where a.getster_registration_login_approval_status = 1 and c.getster_category_type = 3 and f.camp_id =${mysql.escape(CampId)}
        > 0 * 5 LIMIT ${offset},${pageSize}
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
          row_count: tableRowCount[0].row_count,
          getster_category_name: b[i],
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

  // async getConsoleGetster(pageNo: number, pageSize: number): Promise<any> {
  //   try {
  //     const getResult: any = [];
  //     let offset = pageNo * pageSize;
  //     const tableRowCount = await dbConnection.query(`
  //      SELECT 
  //      count(*) as row_count
  //       FROM manage_getsters_db.getster_profile a
  //       left join       
  //       manage_getsters_db.registered_users_registered_getster_categories b
  //       on a.getster_id=b.getster_id
  //       where a.getster_registration_login_approval_status = 3 
  //       group by a.getster_id
      
  //     `);
  //     const getsterNameId = await dbConnection.query(` 
  //       SELECT 
  //       DISTINCT
  //       a.first_name,
  //       a.last_name,
  //       a.getster_id,
  //       a.previous_login_image_of_the_day_ceph_object_id
  //       FROM manage_getsters_db.getster_profile a
  //       left join       
  //       manage_getsters_db.registered_users_registered_getster_categories b
  //       on a.getster_id=b.getster_id
  //       where a.getster_registration_login_approval_status = 3 
  //       > 0 * 5 LIMIT ${offset},${pageSize}
  //             `);
  //     let b: any[] = [];
  //     for (let i = 0; i < getsterNameId.length; i++) {
  //       let a: any[] = [];
  //       const category_id = await dbConnection.query(`
  //     SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
  //     where getster_id=${getsterNameId[i].getster_id};
  //         `);
  //       // console.log(category_id.length);

  //       for (let j = 0; j < category_id.length; j++) {
  //         // // length for table
  //         let category_table_length = await dbConnection.query(`
  //       select * from manage_getsters_db.getster_category          
  //       `);

  //         let result1 = category_id[j].getster_category_id;
  //         let AlldataforStudent: any[] = [];
  //         for (let i = 0; i < category_table_length.length; i++) {
  //           let result = await dbConnection.query(`
  //           SELECT * FROM manage_getsters_db.getster_category 
  //           where getster_category_id='${result1}'             
  //           `);
  //           if (result.length > 0) {
  //             result1 = result[0].parent_getster_category_id;
  //             AlldataforStudent.push(result[0].getster_category_name);
  //           }
  //         }
  //         // console.log(AlldataforStudent.reverse().toString().replace(/,/g,'/'));
  //         a.push(AlldataforStudent.reverse().toString().replace(/,/g, '/'));
  //         // console.log(a);
  //       }
  //       b.push(a);
  //     }
  //     for (let i = 0; i < getsterNameId.length; i++) {
  //       getResult.push({
  //         ...getsterNameId[i],
  //         row_count: tableRowCount.length,
  //         getster_category_name: b[i],
  //       });
  //     }
  //     return {
  //       status: HttpStatus.OK,
  //       message: 'Get Successful',
  //       data: getResult,
  //     };
  //   } catch {
  //     return {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: 'Invalid Request',
  //     };
  //   }
  // }
}
