import { HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
const { DateTime } = require('luxon');
import * as mysql from 'mysql2';
import { NewUserDto } from 'src/models/dto/user.dto';
import { log } from 'console';
@Injectable()
export class GetsterProfileLoginResetService {
  async getsterProfileLoginReset(pageNo: number, pageSize: number,campId:number) {
    try {
      let offset = pageNo * pageSize;
      const tableRowCount = await dbConnection.query(`
       SELECT 
       count(*) as row_count
      from manage_getsters_db.getster_profile a
      left  join manage_getsters_db.getster_login_data b
      on a.getster_id = b.getster_id 
      left join manage_getsters_db.registered_users_registered_getster_categories c on
      a.getster_id = c.getster_id 
      left join manage_getsters_db.getster_category d 
      on c.getster_category_id = d.getster_category_id
      left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps e
        on d.getster_category_id = e.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master f 
        on e.camp_id = f.camp_id
      where 
      a.getster_registration_login_approval_status=3 and d.getster_category_type = 3 and f.camp_id =${mysql.escape(campId)}
      `);
      const approve_name = await dbConnection.query(`
     select
     DISTINCT
      a.getster_id,
      a.registered_mobile_country_code,
      a.first_name,last_name,
      a.gender,date_of_birth,
      a.registered_mobile_number, 
      a.getster_blood_group,
      a.emergency_mobile_no,
      a.e_id_card_address,
      a.e_id_card_email_id,
      a.e_id_card_website,
      a.about_user,
      a.residential_address_gps,
      b.getster_password,
      a.previous_login_image_of_the_day_ceph_object_id
      from manage_getsters_db.getster_profile a
      left  join manage_getsters_db.getster_login_data b
      on a.getster_id = b.getster_id 
      left join manage_getsters_db.registered_users_registered_getster_categories c 
      on a.getster_id = c.getster_id 
      left join manage_getsters_db.getster_category d 
      on c.getster_category_id = d.getster_category_id
      left join 
        manage_camps_collection_centers.1_getsterapp_assign_getster_categories_to_camps e
        on d.getster_category_id = e.getster_category_id left join 
        manage_camps_collection_centers.1_getsterapp_campsites_master f 
        on e.camp_id = f.camp_id
      where 
      a.getster_registration_login_approval_status=3 and d.getster_category_type = 3 and f.camp_id =${mysql.escape(campId)} order by a.getster_id > 0 * 5 LIMIT ${offset},${pageSize}`);

      const approve_getsterid = await dbConnection.query(
        `select getster_id from manage_getsters_db.getster_profile 
      where getster_registration_login_approval_status=1 or getster_registration_login_approval_status=3;`,
      );

      let b: any[] = [];
      for (let i = 0; i < approve_name.length; i++) {
        let a: any[] = [];
        const category_id = await dbConnection.query(`
      SELECT getster_category_id FROM manage_getsters_db.registered_users_registered_getster_categories
      where getster_id=${approve_name[i].getster_id};
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
      let final_ans: any = [];
      for (let i = 0; i < approve_name.length; i++) {
        final_ans.push({
          name: approve_name[i].first_name,
          lastName: approve_name[i].last_name,
          gender: approve_name[i].gender,
          dob: approve_name[i].date_of_birth,
          mobile: approve_name[i].registered_mobile_number,
          bldgrup: approve_name[i].getster_blood_group,
          emgcontact: approve_name[i].emergency_mobile_no,
          address: approve_name[i].e_id_card_address,
          coutry_code: approve_name[i].registered_mobile_country_code,
          pass: approve_name[i].getster_password,
          // profilepic: approve_name[i].first_login_image_of_the_day_without_bg,
          getster_id: approve_name[i].getster_id,
          getser_category: b[i],
          email: approve_name[i].e_id_card_email_id,
          aditional_field_user: approve_name[i].about_user,
          gps: approve_name[i].residential_address_gps,
          weblink: approve_name[i].e_id_card_website,
          ademail: approve_name[i].e_id_card_email_id,
          adlocationadd: approve_name[i].e_id_card_address,
          previous_login_image_of_the_day_ceph_object_id:
            approve_name[i].previous_login_image_of_the_day_ceph_object_id,
          ...tableRowCount[0],
        });
      }

      return final_ans;
    } catch (error) {
      console.log(error);
    }
  }

  async updategetstersProfileLoginReset(
    getster_id: number,
    loginData: any,
    data: any,
  ) {
    // console.log('data', data);

    const dateTime = loginData.user.time_zone_iana_string;
    const login_user_id = Number(loginData.user.getster_id);
    var local = DateTime.local({ zone: dateTime });
    var overrideZone = DateTime.fromISO(local, {
      zone: dateTime,
    });
    var entry_local_date_time = overrideZone.toString();
    //console.log(login_user_id);

    try {
      await dbConnection.query(`
        UPDATE manage_getsters_db.getster_profile
        SET 
        first_name=${mysql.escape(data.name)},last_name=${mysql.escape(
        data.lastName,
      )},
        date_of_birth=${mysql.escape(data.dob)},gender = ${mysql.escape(
        data.gender,
      )} ,
        about_user=${mysql.escape(data.aditionaldata)},
        getster_blood_group = ${mysql.escape(data.blood_group)},
        e_id_card_email_id =${mysql.escape(data.email)},
        e_id_card_address = ${mysql.escape(data.address)},
        emergency_mobile_no=${mysql.escape(data.emMoNo)}
        WHERE getster_id=${mysql.escape(getster_id)};
    
      `);
      await dbConnection.query(`
        update manage_getsters_db.getster_profile 
        set additional_getster_data_field_values = ${mysql.escape(
          data.additionalDataFields,
        )}
        
        where  getster_id=${getster_id};
    
      `);
      await dbConnection.query(`Update manage_getsters_db.${getster_id}_getster_id_home_screen_update_datetime
       set
      home_screen_update_datetime = date_format(${mysql.escape(
        entry_local_date_time,
      )},'%Y-%m-%d %h:%i:%s') 
      where id = 1 
`);

      const a = await dbConnection.query(`
      insert into manage_getsters_db.getster_profile_audit_trail
      (
        getster_id,
        entry_type,
        entry_date_time,
        entry_by_getster_id
      )
      values
      (
        ${mysql.escape(getster_id)},
        'Updated',
         date_format( ${mysql.escape(
           entry_local_date_time,
         )},'%y-%m-%d %h:%i:%s'),
         ${mysql.escape(login_user_id)}
      )
      `);

      return data;
    } catch (error) {
      console.log(error);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }

  async updateGetsteresProfileLoginResetMobileNo(
    data: NewUserDto,
    getster_id: number,
    entry_by_user_id: number,
  ) {
    var local = DateTime.local({ zone: 'Asia/Kolkata' });
    var overrideZone = DateTime.fromISO(local, { zone: 'Asia/Kolkata' });
    var entry_local_date_time = overrideZone.toString();
    try {
      await dbConnection.query(`
        UPDATE manage_getsters_db.getster_profile
        SET 
        registered_mobile_number=${mysql.escape(data.mobile)}
        WHERE getster_id=${mysql.escape(getster_id)};
    
      `);

      const a = await dbConnection.query(`
      insert into manage_getsters_db.getster_profile_audit_trail
      (
        getster_id,
        entry_type,
        entry_date_time,
        entry_by_getster_id
      )
      values
      (
        ${mysql.escape(getster_id)},
        'Updated',
        ${mysql.escape(entry_local_date_time)},
        ${mysql.escape(entry_by_user_id)}
      )
      `);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateGetstersProfileLoginResetPass(
    data: NewUserDto,
    getster_id: number,
    entry_by_user_id: number,
  ) {
    var local = DateTime.local({ zone: 'Asia/Kolkata' });
    var overrideZone = DateTime.fromISO(local, { zone: 'Asia/Kolkata' });
    var entry_local_date_time = overrideZone.toString();
    try {
      await dbConnection.query(`
        UPDATE manage_getsters_db.getster_login_data  
        SET 
        getster_password=${mysql.escape(data.password)}
        WHERE getster_id=${mysql.escape(getster_id)};
      `);

      const a = await dbConnection.query(`
      insert into manage_getsters_db.getster_profile_audit_trail
      (
        getster_id,
        entry_type,
        entry_date_time,
        entry_by_getster_id
      )
      values
      (
        ${mysql.escape(getster_id)},
        'Updated',
        ${mysql.escape(entry_local_date_time)},
         ${mysql.escape(entry_by_user_id)}
      )
      `);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getsterProfileLoginResetgetsterCategoryName(getster_id: number) {
    const getster_category_id = await dbConnection.query(`
    select c.getster_category_id from manage_getsters_db.getster_profile  a
    left join  manage_getsters_db.registered_users_registered_getster_categories b
    on a.getster_id = b.getster_id 
    left join  manage_getsters_db.getster_category c
    on b.getster_category_id = c.getster_category_id 
    where c.getster_category_id is not null 
    and a.getster_id = ${mysql.escape(getster_id)};
    `);

    // console.log(getster_category_id);
    // let ans : any [] = [];
    // for(let i=0;i<getster_category_id.length;i++){
    //   ans.push({
    //     getster_category_id:getster_category_id[i].getster_category_id
    //   })
    // }

    return getster_category_id;
  }

  async updateApproveGetstersProfileLoginResetMobileNo(
    getster_id: number,
    entry_by_user_id: number,
    data: NewUserDto,
  ) {
    var local = DateTime.local({ zone: 'Asia/Kolkata' });
    var overrideZone = DateTime.fromISO(local, { zone: 'Asia/Kolkata' });
    var entry_local_date_time = overrideZone.toString();
    try {
      await dbConnection.query(`
        UPDATE  manage_getsters_db.getster_profile_changes_pending_for_approval
        SET 
        registered_mobile_number=${mysql.escape(data.mobile)}
        WHERE getster_id=${mysql.escape(getster_id)};
    
      `);

      const a = await dbConnection.query(`
      insert into manage_getsters_db.getster_profile_audit_trail
      (
        getster_id,
        entry_type,
        entry_date_time,
        entry_by_getster_id
      )
      values
      (
        ${mysql.escape(getster_id)},
        'Updated',
        ${mysql.escape(entry_local_date_time)},
        ${mysql.escape(entry_by_user_id)}
      )
      `);

      return data;
    } catch (error) {
      // throw error;
    }
  }

  async updateApproveGetstersProfileLoginReset(loginData: any, data: any) {
    console.log('logdata', loginData);
    console.log('data', data);

    const dateTime = loginData.user.time_zone_iana_string;
    //  const login_user_id = loginData.user.getster_id;
    var local = DateTime.local({ zone: dateTime });
    var overrideZone = DateTime.fromISO(local, {
      zone: dateTime,
    });
    var entry_local_date_time = overrideZone.toString();

    try {
      const checkGetster = await dbConnection.query(`
      SELECT * FROM manage_getsters_db.getster_profile_changes_pending_for_approval
      where getster_id = ${mysql.escape(loginData.user.getster_id)}`);

      await dbConnection.query(`SET SQL_SAFE_UPDATES = 0;`);
      await dbConnection.query(`
         UPDATE  manage_getsters_db.getster_profile_changes_pending_for_approval
        SET registered_mobile_number = ${mysql.escape(
          checkGetster[0].registered_mobile_number,
        )}
        where getster_id = ${mysql.escape(loginData.user.getster_id)} 
      `);
      if (checkGetster.length == 0) {
        await dbConnection.query(`
            INSERT INTO manage_getsters_db.getster_profile_changes_pending_for_approval
            (
            getster_id,
            registered_mobile_country_code,
            registered_mobile_number,
            first_name,
            last_name,
            date_of_birth,
            gender,
            about_user,
            getster_blood_group,
            emergency_mobile_number,
            getster_email_id,
            getster_address,
            getster_profile_update_datetime
            )
            VALUES
              (
            ${mysql.escape(loginData.user.getster_id)},
            ${mysql.escape(data.country_code)},
            ${mysql.escape(data.mobile)},
            ${mysql.escape(data.name)},
            ${mysql.escape(data.lastName)},
            ${mysql.escape(data.dob)},
            ${mysql.escape(data.gender)},
            ${mysql.escape(data.aditionaldata)},
            ${mysql.escape(data.bldgroup)},
            ${mysql.escape(data.emp_contact)},
            ${mysql.escape(data.email)},
            ${mysql.escape(data.address)},
            date_format(${mysql.escape(
              entry_local_date_time,
            )},'%Y-%m-%d %h-%i-%s')
            )
            ;`);

        await dbConnection.query(`
        update manage_getsters_db.getster_profile 
        set
        getster_registration_login_approval_status =1
        where getster_id = ${mysql.escape(loginData.user.getster_id)}
        `);
        await dbConnection.query(` update manage_getsters_db.getster_profile_changes_pending_for_approval
           set
           about_user = ${mysql.escape(data.aditionaldata)}
           where getster_id = ${mysql.escape(loginData.user.getster_id)}`);

        if (data.additionalDataFields != null) {
          await dbConnection.query(`
       update
       manage_getsters_db.getster_profile_changes_pending_for_approval
       set
       additional_user_data_field_values = ${mysql.escape(
         data.additionalDataFields,
       )}
       where getster_id = ${mysql.escape(loginData.user.getster_id)}

      `);
        }

        return data;
      } else {
        await dbConnection.query(`
        update manage_getsters_db.getster_profile 
        set
        getster_registration_login_approval_status =1
        where getster_id = ${mysql.escape(loginData.user.getster_id)}
        `);
        await dbConnection.query(`
        UPDATE  manage_getsters_db.getster_profile_changes_pending_for_approval
        SET 
        first_name=${mysql.escape(data.name)},last_name=${mysql.escape(
          data.lastName,
        )},
        date_of_birth=${mysql.escape(data.dob)},gender = ${mysql.escape(
          data.gender,
        )} ,
        getster_profile_update_datetime =  date_format(${mysql.escape(
          entry_local_date_time,
        )},'%Y-%m-%d %h-%i-%s')
        WHERE getster_id=${mysql.escape(loginData.user.getster_id)};
    
      `);

        await dbConnection.query(` update manage_getsters_db.getster_profile_changes_pending_for_approval
           set
           about_user = ${mysql.escape(data.aditionaldata)}
           where getster_id = ${mysql.escape(loginData.user.getster_id)}`);

        await dbConnection.query(`
       update
       manage_getsters_db.getster_profile_changes_pending_for_approval
       set
       additional_user_data_field_values = ${mysql.escape(
         data.additionalDataFields,
       )}
       where getster_id = ${mysql.escape(loginData.user.getster_id)}`);

        return data;
      }
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
        data: error,
      };
    }
  }

  async getGetsterCategoryWiseAdditionalFields(
    getster_id: number,
  ): Promise<any> {
    try {
      const gesGategoty = await dbConnection.query(`
        SELECT a.getster_id, group_concat(getster_category_id) as getster_category_id  FROM manage_getsters_db.getster_profile a
        left join manage_getsters_db.registered_users_registered_getster_categories b
        on a.getster_id = b.getster_id
        where a.getster_id =${mysql.escape(getster_id)}`);

      const getster_category_id =
        gesGategoty[0].getster_category_id?.split(',');

      const fieldData: any = [];
      const data: any[] = [];

      for (let i = 0; i < getster_category_id.length; i++) {
        // console.log(getster_category_id[i].toString());
        // let getster_category_data: any = [];
        const getster_category_data = await dbConnection.query(`

        select json_extract(additional_getster_data_field_values, '$."${
          getster_category_id[i]
        }"') as additional_getster_data_field_name
        from manage_getsters_db.getster_profile where getster_id =${mysql.escape(
          getster_id,
        )};
        `);

        const gategoryName = await dbConnection.query(`
        SELECT getster_category_id,getster_category_name FROM manage_getsters_db.getster_category
        where getster_category_id = ${mysql.escape(getster_category_id[i])};
        `);

        fieldData.push({ ...getster_category_data[0], ...gategoryName[0] });
      }
      // console.log(fieldData);

      for (let i = 0; i < getster_category_id.length; i++) {
        const element = getster_category_id[i];

        let d = await dbConnection.query(
          `
          SELECT a.additional_getster_data_field_name,a.is_location_of_getster_required,b.getster_category_name FROM manage_getsters_db.getster_category_wise_additional_field_names a
          left join manage_getsters_db.getster_category b on a.getster_category_id=b.getster_category_id
          WHERE a.getster_category_id='${element}';
        `,
        );
        data.push(...d);
      }

      return fieldData;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
        data: error,
      };
    }
  }

  async getManageGetsterCategoryWiseAdditionalFields(
    loginData: any,
  ): Promise<any> {
    try {
      const gesGategoty = await dbConnection.query(`
        SELECT a.getster_id, group_concat(getster_category_id) as getster_category_id  FROM manage_getsters_db.getster_profile a
        left join manage_getsters_db.registered_users_registered_getster_categories b
        on a.getster_id = b.getster_id
        where a.getster_id =${mysql.escape(loginData.user.getster_id)}`);

      const getster_category_id =
        gesGategoty[0].getster_category_id?.split(',');

      const fieldData: any = [];
      const data: any[] = [];

      for (let i = 0; i < getster_category_id.length; i++) {
        // console.log(getster_category_id[i].toString());
        // let getster_category_data: any = [];
        const getster_category_data = await dbConnection.query(`

        select json_extract(additional_getster_data_field_values, '$."${
          getster_category_id[i]
        }"') as additional_getster_data_field_name
        from manage_getsters_db.getster_profile where getster_id =${mysql.escape(
          loginData.user.getster_id,
        )};
        `);

        const gategoryName = await dbConnection.query(`
        SELECT getster_category_id,getster_category_name FROM manage_getsters_db.getster_category
        where getster_category_id = ${mysql.escape(getster_category_id[i])};
        `);

        fieldData.push({ ...getster_category_data[0], ...gategoryName[0] });
      }
      // console.log(fieldData);

      for (let i = 0; i < getster_category_id.length; i++) {
        const element = getster_category_id[i];

        let d = await dbConnection.query(
          `
          SELECT a.additional_getster_data_field_name,a.is_location_of_getster_required,b.getster_category_name FROM manage_getsters_db.getster_category_wise_additional_field_names a
          left join manage_getsters_db.getster_category b on a.getster_category_id=b.getster_category_id
          WHERE a.getster_category_id='${element}';
        `,
        );
        data.push(...d);
      }

      return fieldData;
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
        data: error,
      };
    }
  }

  async getApproveGetsterCategoryWiseAdditionalFields(
    getster_id: number,
  ): Promise<any> {
    try {
      const gesGategoty = await dbConnection.query(`
        SELECT a.getster_id, group_concat(getster_category_id) as getster_category_id  FROM manage_getsters_db.getster_profile_changes_pending_for_approval a
        left join manage_getsters_db.registered_users_registered_getster_categories b
        on a.getster_id = b.getster_id
        where a.getster_id =${mysql.escape(getster_id)}`);
      // console.log(gesGategoty);

      const getster_category_id = gesGategoty[0].getster_category_id.split(',');

      const fieldData: any = [];
      const data: any[] = [];

      for (let i = 0; i < getster_category_id.length; i++) {
        const getster_category_data = await dbConnection.query(`

        select json_extract(additional_user_data_field_values, '$."${
          getster_category_id[i]
        }"') as additional_getster_data_field_name
        from manage_getsters_db.getster_profile_changes_pending_for_approval where getster_id =${mysql.escape(
          getster_id,
        )};
        `);

        const gategoryName = await dbConnection.query(`
        SELECT getster_category_id,getster_category_name FROM manage_getsters_db.getster_category
        where getster_category_id = ${mysql.escape(getster_category_id[i])};
        `);

        fieldData.push({ ...getster_category_data[0], ...gategoryName[0] });
      }

      return fieldData;
    } catch (error) {
      // throw error;
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
        data: error,
      };
    }
  }

  async getGetsterCategory(getster_category_id: any): Promise<any> {
    try {
      const combineCategory: any = getster_category_id;
      // console.log(combineCategory);
      const getsterCategoryIds = combineCategory.split(',');
      // console.log(getsterCategoryIds);

      const additionalFields: any[] = [];
      for (let i = 0; i < getsterCategoryIds.length; i++) {
        const data = await dbConnection.query(`
      SELECT a.getster_category_id,a.additional_getster_data_field_name,b.getster_category_name FROM manage_getsters_db.getster_category_wise_additional_field_names a
      left join manage_getsters_db.getster_category b
      on a.getster_category_id = b.getster_category_id
      where a.getster_category_id = ${mysql.escape(getsterCategoryIds[i])}
      `);
        additionalFields.push(data[0]);
      }
      return {
        status: HttpStatus.OK,
        message: 'Get Successful',
        data: additionalFields,
      };
    } catch {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }

  async updateTreeCategoryId(getster_id: number, category_id: any) {
    // console.log(category_id);
    await dbConnection.query(`SET SQL_SAFE_UPDATES = 0;`);
    setTimeout(async () => {
      await dbConnection.query(
        `delete from manage_getsters_db.registered_users_registered_getster_categories
         where getster_id = ${mysql.escape(getster_id)}`,
      );

      for (let i = 0; i < category_id.category_ids.length; i++) {
        await dbConnection.query(`insert into manage_getsters_db.registered_users_registered_getster_categories
       (
        getster_id,
        getster_category_id
        ) values
        (
        ${mysql.escape(getster_id)},
        ${mysql.escape(category_id.category_ids[i])}
        )
        `);
        // console.log(category_id.category_ids[i]);
      }
    }, 5);
  }
  async updateApproveTreeCategoryId(getster_id: number, category_id: any) {
    await dbConnection.query(`SET SQL_SAFE_UPDATES = 0;`);
    setTimeout(async () => {
      await dbConnection.query(
        `delete from manage_getsters_db.registered_users_registered_getster_categories
         where getster_id = ${mysql.escape(getster_id)}`,
      );

      for (let i = 0; i < category_id.length; i++) {
        await dbConnection.query(`insert into manage_getsters_db.registered_users_registered_getster_categories
       (
        getster_id,
        getster_category_id
        ) values
        (
        ${mysql.escape(getster_id)},
        ${mysql.escape(category_id[i].getster_category_id)}
        )
        `);
        // console.log(category_id.category_ids[i]);
      }
    }, 5);
  }
}
