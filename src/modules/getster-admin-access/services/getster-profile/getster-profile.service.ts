import { HttpStatus, Injectable } from '@nestjs/common';
import { dbConnection } from 'src/app.module';
const { DateTime } = require('luxon');
import * as mysql from 'mysql2';
import { eidentitycard } from 'src/models/dto/eidentitycard.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { log } from 'console';

@Injectable()
export class GetsterProfileService {
  constructor(private _authService: AuthService) {}
  async getsterEIdentityCardEligibilityCard(
    getster_category_id: string,
    data: eidentitycard,
  ) {
    var local = DateTime.local({ zone: 'Asia/Kolkata' });
    var overrideZone = DateTime.fromISO(local, { zone: 'Asia/Kolkata' });
    var entry_local_date_time = overrideZone.toString();
    try {
      const check_id = await dbConnection.query(`
          SELECT count(*) as count FROM manage_getsters_db.getster_profile_eidentity_card_format
          where getster_category_id = ${mysql.escape(getster_category_id)};`);

      // console.log(check_id);

      if (check_id[0].count == 0) {
        const values_insert = await dbConnection.query(`
            insert into manage_getsters_db.getster_profile_eidentity_card_format values
            (
              ${mysql.escape(getster_category_id)},
              ${mysql.escape(data.is_getster_photo_id_to_be_displayed)},
              ${mysql.escape(data.is_app_icon_to_be_displayed)},
              ${mysql.escape(data.is_barcode_id_to_be_displayed)},
              ${mysql.escape(data.is_getster_date_of_birth_to_be_displayed)},
              ${mysql.escape(data.is_getster_category_name_to_be_displayed)},
              ${mysql.escape(
                data.is_registered_educational_institution_name_to_be_displayed,
              )},
              ${mysql.escape(data.is_registered_mobile_no_to_be_displayed)},
              ${mysql.escape(data.is_additional_mobile_no_to_be_displayed)},
              ${mysql.escape(data.is_getster_blood_group_to_be_dispalyed)},
              ${mysql.escape(data.is_email_to_be_displayed)},
              ${mysql.escape(data.is_address_to_be_displayed)},
              ${mysql.escape(data.is_getster_background_color)},
              ${mysql.escape(data.is_getster_text_type_1)},
              ${mysql.escape(data.is_getster_text_type_2)},
              ${mysql.escape(data.is_getster_text_type_3)},
              ${mysql.escape(data.is_getster_font)}
            );
            `);
        //       const a = await dbConnection.query(`
        // insert into manage_getsters_db.getster_profile_audit_trail
        // (
        //   getster_id,
        //   entry_type,
        //   entry_local_date_time,
        //   entry_by_user_id
        // )
        // values
        // (
        //   '${getster_category_id}',
        //   ' format-of-e-identity-card value inserted',
        //   '${entry_local_date_time}',
        //    '1 '
        // )
        // `);
      } else {
        const values_update = await dbConnection.query(`
            UPDATE manage_getsters_db.getster_profile_eidentity_card_format
            SET 
            is_getster_photo_id_to_be_displayed=${mysql.escape(
              data.is_getster_photo_id_to_be_displayed,
            )},
            is_app_icon_to_be_displayed=${mysql.escape(
              data.is_app_icon_to_be_displayed,
            )},
            is_barcode_id_to_be_displayed=${mysql.escape(
              data.is_barcode_id_to_be_displayed,
            )},
            is_getster_date_of_birth_to_be_displayed = ${mysql.escape(
              data.is_getster_date_of_birth_to_be_displayed,
            )} ,
            is_getster_category_name_to_be_displayed=${mysql.escape(
              data.is_getster_category_name_to_be_displayed,
            )},
            is_registered_educational_institution_name_to_be_displayed = ${mysql.escape(
              data.is_registered_educational_institution_name_to_be_displayed,
            )},
            is_registered_mobile_no_to_be_displayed = ${mysql.escape(
              data.is_registered_mobile_no_to_be_displayed,
            )},
            is_additional_mobile_no_to_be_displayed = ${mysql.escape(
              data.is_additional_mobile_no_to_be_displayed,
            )},
            is_getster_blood_group_to_be_dispalyed = ${mysql.escape(
              data.is_getster_blood_group_to_be_dispalyed,
            )},
            is_email_to_be_displayed = ${mysql.escape(
              data.is_email_to_be_displayed,
            )},
            is_address_to_be_displayed = ${mysql.escape(
              data.is_address_to_be_displayed,
            )},
            is_getster_background_color = ${mysql.escape(
              data.is_getster_background_color,
            )},
            is_getster_text_type_1 = ${mysql.escape(
              data.is_getster_text_type_1,
            )},
            is_getster_text_type_2 = ${mysql.escape(
              data.is_getster_text_type_2,
            )},
            is_getster_text_type_3 = ${mysql.escape(
              data.is_getster_text_type_3,
            )},
            is_getster_font = ${mysql.escape(data.is_getster_font)}
            WHERE getster_category_id=${mysql.escape(getster_category_id)};
            `);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async getEIdentityCardValues(getster_category_id: string) {
    const checkCategory = await dbConnection.query(`
      SELECT * FROM manage_getsters_db.getster_profile_eidentity_card_format
     where getster_category_id = ${mysql.escape(getster_category_id)};`);

    if (checkCategory.length != 0) {
      const card = await dbConnection.query(`
                  SELECT * FROM manage_getsters_db.getster_profile_eidentity_card_format
                  where getster_category_id = ${mysql.escape(
                    getster_category_id,
                  )};
                  `);
      let card_details: any[] = [];
      card_details.push({
        getster_photo: card[0].is_getster_photo_id_to_be_displayed,
        app_icon: card[0].is_app_icon_to_be_displayed,
        barcode: card[0].is_barcode_id_to_be_displayed,
        dob: card[0].is_getster_date_of_birth_to_be_displayed,
        category: card[0].is_getster_category_name_to_be_displayed,
        institution:
          card[0].is_registered_educational_institution_name_to_be_displayed,
        mobile1: card[0].is_registered_mobile_no_to_be_displayed,
        mobile2: card[0].is_additional_mobile_no_to_be_displayed,
        bldg: card[0].is_getster_blood_group_to_be_dispalyed,
        email: card[0].is_email_to_be_displayed,
        add: card[0].is_address_to_be_displayed,
        bg_color: card[0].is_getster_background_color,
        text1: card[0].is_getster_text_type_1,
        text2: card[0].is_getster_text_type_2,
        text3: card[0].is_getster_text_type_3,
        fontclr: card[0].is_getster_font,
      });
      return card_details;
    } else {
      const addCategory = await dbConnection.query(`
        INSERT INTO manage_getsters_db.getster_profile_eidentity_card_format
        (
        getster_category_id,
        is_getster_photo_id_to_be_displayed,
        is_app_icon_to_be_displayed,
        is_barcode_id_to_be_displayed,
        is_getster_date_of_birth_to_be_displayed,
        is_getster_category_name_to_be_displayed,
        is_registered_educational_institution_name_to_be_displayed,
        is_registered_mobile_no_to_be_displayed,
        is_additional_mobile_no_to_be_displayed,
        is_getster_blood_group_to_be_dispalyed,
        is_email_to_be_displayed,
        is_address_to_be_displayed
        )
        VALUES
        (
         ${mysql.escape(getster_category_id)},
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1'
         )
        `);

      const card = await dbConnection.query(`
                  SELECT * FROM manage_getsters_db.getster_profile_eidentity_card_format
                  where getster_category_id = ${mysql.escape(
                    getster_category_id,
                  )};
                  `);
      let card_details: any[] = [];
      card_details.push({
        getster_photo: card[0].is_getster_photo_id_to_be_displayed,
        app_icon: card[0].is_app_icon_to_be_displayed,
        barcode: card[0].is_barcode_id_to_be_displayed,
        dob: card[0].is_getster_date_of_birth_to_be_displayed,
        category: card[0].is_getster_category_name_to_be_displayed,
        institution:
          card[0].is_registered_educational_institution_name_to_be_displayed,
        mobile1: card[0].is_registered_mobile_no_to_be_displayed,
        mobile2: card[0].is_additional_mobile_no_to_be_displayed,
        bldg: card[0].is_getster_blood_group_to_be_dispalyed,
        email: card[0].is_email_to_be_displayed,
        add: card[0].is_address_to_be_displayed,
        bg_color: card[0].is_getster_background_color,
        text1: card[0].is_getster_text_type_1,
        text2: card[0].is_getster_text_type_2,
        text3: card[0].is_getster_text_type_3,
        fontclr: card[0].is_getster_font,
      });
      return card_details;
    }
  }

  async getAllCategories() {
    try {
      const category =
        await dbConnection.query(`SELECT * FROM manage_getsters_db.getster_category order by id
      `);
      // console.log(category);

      let data;
      if (category.length > 1) {
        data = await this.treeConstruct(category);
        // console.log(data, "tree");
        return data;
      }

      const obj = category[0];
      const pair = { children: [] };
      const objData = { ...obj, ...pair };
      // console.log(objData);

      if (obj !== undefined) {
        return [objData];
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  treeConstruct(treeData) {
    let constructedTree = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned);
    }
    return constructedTree;
  }

  constructTree(constructedTree, treeObj, assigned) {
    if (treeObj.parent_getster_category_id == null) {
      treeObj.children = [];
      constructedTree.push(treeObj);
      return true;
    } else if (
      treeObj.parent_getster_category_id === constructedTree.getster_category_id
    ) {
      treeObj.children = [];
      constructedTree.children.push(treeObj);
      return true;
    } else {
      if (constructedTree.children != undefined) {
        for (let index = 0; index < constructedTree.children.length; index++) {
          let constructedObj = constructedTree.children[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      } else {
        for (let index = 0; index < constructedTree.length; index++) {
          let constructedObj = constructedTree[index];
          if (assigned == false) {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
    }
  }

  async getApproveProfileChangesByUsers() {
    const profileImages: any = [];
    const approve_profile_data: any = [];
    const rowCount = await dbConnection.query(`
    select 
    count(*) as row_count
    from manage_getsters_db.getster_profile a inner join
    manage_getsters_db.getster_profile_changes_pending_for_approval b 
    on a.getster_id = b.getster_id
  
    `);

    const gId = await dbConnection.query(`
    select 
    getster_id
    from
    manage_getsters_db.getster_profile_changes_pending_for_approval
    `);
    for (let i = 0; i < gId.length; i++) {
      const data = await dbConnection.query(`
       SELECT * FROM manage_getsters_db.getster_profile_changes_pending_for_approval
       where getster_id =${mysql.escape(gId[i].getster_id)}
      `);
      if (data[0].first_name != null) {
        const res = await dbConnection.query(`
        select
        b.getster_id,
        b.first_name,
        b.last_name,
        b.date_of_birth,
        b.gender,
        b.registered_mobile_country_code,
        b.emergency_mobile_number,
        b.about_user,
        b.getster_email_id,
        b.getster_address,
        b.getster_blood_group,
        b.additional_user_data_field_values,
        a.registered_mobile_number,
        a.previous_login_image_of_the_day_ceph_object_id
        from manage_getsters_db.getster_profile a inner join
        manage_getsters_db.getster_profile_changes_pending_for_approval b
        on a.getster_id = b.getster_id
        where  b.getster_id =${mysql.escape(gId[i].getster_id)}
        `);
        approve_profile_data.push({ ...res[0] });
      } else {
        const res = await dbConnection.query(`
        select
        a.getster_id,
       
        a.last_name,
        a.date_of_birth,
        a.gender,
        a.registered_mobile_country_code,
        a.additional_getster_data_field_values,
        a.emergency_mobile_no as emergency_mobile_number,
        a.about_user,
        a.e_id_card_email_id as getster_email_id,
        b.getster_address,
        a.getster_blood_group,
        a.registered_mobile_number,
        a.first_name,
        a.previous_login_image_of_the_day_ceph_object_id
        from manage_getsters_db.getster_profile a left join
        manage_getsters_db.getster_profile_changes_pending_for_approval b
        on a.getster_id = b.getster_id
        where  a.getster_id =${mysql.escape(gId[i].getster_id)}
        `);

        approve_profile_data.push({ ...res[0] });
      }
    }
    // const approve_profile_data = await dbConnection.query(`
    // select
    // b.getster_id,
    // b.first_name,
    // b.last_name,
    // b.date_of_birth,
    // b.gender,
    // b.registered_mobile_country_code,
    // b.emergency_mobile_number,
    // b.about_user,
    // b.getster_email_id,
    // b.getster_address,
    // b.getster_blood_group,
    // a.registered_mobile_number,
    // a.previous_login_image_of_the_day_ceph_object_id
    // from manage_getsters_db.getster_profile a inner join
    // manage_getsters_db.getster_profile_changes_pending_for_approval b
    // on a.getster_id = b.getster_id
    // `);

    for (let i = 0; i < approve_profile_data.length; i++) {
      const getProfile = await dbConnection.query(
        `SELECT previous_login_image_of_the_day_ceph_object_id FROM manage_getsters_db.getster_profile
        where getster_id= ${approve_profile_data[i].getster_id}
        `,
      );
      profileImages.push({ ...getProfile[0] });
    }

    let b: any[] = [];
    for (let i = 0; i < approve_profile_data.length; i++) {
      let a: any[] = [];
      const category_id = await dbConnection.query(`
        SELECT getster_category_id
        FROM manage_getsters_db.registered_users_registered_getster_categories
        where getster_id=${approve_profile_data[i].getster_id};
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
    for (let i = 0; i < approve_profile_data.length; i++) {
      final_ans.push({
        row_count: rowCount[0].row_count,
        getster_id: approve_profile_data[i].getster_id,
        name: approve_profile_data[i].first_name,
        lastName: approve_profile_data[i].last_name,
        dob: approve_profile_data[i].date_of_birth,
        gender: approve_profile_data[i].gender,
        coutry_code: approve_profile_data[i].registered_mobile_country_code,
        getser_category: b[i],
        mobile: approve_profile_data[i].registered_mobile_number,
        emgcontact: approve_profile_data[i].emergency_mobile_number,
        // profilepic: face_id[i].first_login_image_of_the_day_without_bg,
        aditional_field_user: approve_profile_data[i].about_user,
        email: approve_profile_data[i].getster_email_id,
        blood: approve_profile_data[i].getster_blood_group,
        adlocationadd: approve_profile_data[i].getster_address,
        previous_login_image_of_the_day_ceph_object_id:
          profileImages[i].previous_login_image_of_the_day_ceph_object_id,
        additional_field:
          approve_profile_data[i].additional_getster_data_field_values,
      });
    }

    return final_ans;
  }

  async deleteApproveProfileChangesByUsersDelete(
    getster_id: number,
    loginData: any,
  ) {
    const dateTime = loginData.user.time_zone_iana_string;
    var local = DateTime.local({ zone: dateTime });
    var overrideZone = DateTime.fromISO(local, {
      zone: dateTime,
    });
    var entry_local_date_time = overrideZone.toString();

    const delete_user = await dbConnection.query(`
    delete from manage_getsters_db.getster_profile_changes_pending_for_approval
    where getster_id =${mysql.escape(getster_id)};`);

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
      'Deny changes',
            date_format( ${mysql.escape(
              entry_local_date_time,
            )},'%y-%m-%d %h:%i:%s'),
      ${mysql.escape(loginData.user.getster_id)}
    )
    `);

    return delete_user;
  }

  async approveProfileChangesByUsersUpdate(
    data: any,
    getster_id: number,
    loginData: any,
  ) {
    const dateTime = loginData.user.time_zone_iana_string;
    var local = DateTime.local({ zone: dateTime });
    var overrideZone = DateTime.fromISO(local, {
      zone: dateTime,
    });
    var entry_local_date_time = overrideZone.toString();
    try {
      // await dbConnection.query(`SET SQL_SAFE_UPDATES = 0;`);

      const checkGetster = await dbConnection.query(
        `SELECT * FROM manage_getsters_db.getster_profile_changes_pending_for_approval where getster_id = ${mysql.escape(
          getster_id,
        )};`,
      );

      const checkApprovelGetster = await dbConnection.query(
        `SELECT * FROM manage_getsters_db.getster_profile
         where getster_id = ${mysql.escape(getster_id)}
        `,
      );

      if (checkGetster[0].first_name != null) {
        await dbConnection.query(`
          UPDATE manage_getsters_db.getster_profile
          SET
          first_name=${mysql.escape(checkGetster[0].first_name)},
          last_name=${mysql.escape(checkGetster[0].last_name)},
          date_of_birth=${mysql.escape(checkGetster[0].date_of_birth)},
          gender =${mysql.escape(checkGetster[0].gender)},
          about_user=${mysql.escape(checkGetster[0].about_user)},
          
          additional_getster_data_field_values = ${mysql.escape(
            data.additionalDataFields,
          )},
          getster_blood_group = ${mysql.escape(
            checkGetster[0].getster_blood_group,
          )},
          emergency_mobile_no=${mysql.escape(
            checkGetster[0].emergency_mobile_number,
          )},
          e_id_card_email_id=${mysql.escape(checkGetster[0].getster_email_id)},
          e_id_card_address =${mysql.escape(checkGetster[0].getster_address)}
       
          WHERE getster_id=${mysql.escape(getster_id)};
        `);

        if (checkGetster[0].getster_address_gps != null) {
          // console.log('true');

          await dbConnection.query(`
        update  manage_getsters_db.getster_profile
        set
        
        residential_address_gps = point(${mysql.escape(
          checkGetster[0].getster_address_gps.x,
        )},${mysql.escape(
            checkGetster[0].getster_address_gps.y,
          )}) where getster_id=${mysql.escape(getster_id)}`);
        }
      } else {
        await dbConnection.query(`
        update  manage_getsters_db.getster_profile
        set
        e_id_card_address = ${mysql.escape(checkGetster[0].getster_address)},
        residential_address_gps = point(${mysql.escape(
          checkGetster[0].getster_address_gps.x,
        )},${mysql.escape(
          checkGetster[0].getster_address_gps.y,
        )}) where getster_id=${mysql.escape(getster_id)}`);
      }
      await dbConnection.query(`
      delete from manage_getsters_db.getster_profile_changes_pending_for_approval
      where getster_id =${mysql.escape(getster_id)};`);

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
          'Approve Changes',
          date_format( ${mysql.escape(
            entry_local_date_time,
          )},'%y-%m-%d %h:%i:%s'),
      ${mysql.escape(loginData.user.getster_id)}
        )
    `);

      return data;
    } catch (error) {
      console.log(error);

      return {
        message: 'Invalid Request',
        status: HttpStatus.BAD_REQUEST,
        data: error,
      };
      // throw error;
    }
  }

  async getsterProfileLoginResetGetsterCategoryName(getster_id: number) {
    const getster_category_id = await dbConnection.query(`
    select c.getster_category_id from manage_getsters_db.getster_profile  a
    inner join  manage_getsters_db.registered_users_registered_getster_categories b
    on a.getster_id = b.getster_id left join  manage_getsters_db.getster_category c
    on b.getster_category_id = c.getster_category_id where 
     a.getster_id = ${mysql.escape(getster_id)};
    `);
    const checkCategory = await dbConnection.query(`
     SELECT getster_category_id  FROM manage_getsters_db.registered_users_registered_getster_categories
     where ${mysql.escape(getster_id)}`);

    for (let i = 0; i < checkCategory.length; i++) {
      const cardFormat = await dbConnection.query(
        `SELECT getster_category_id FROM manage_getsters_db.getster_profile_eidentity_card_format
         where getster_category_id = ${mysql.escape(
           checkCategory[i].getster_category_id,
         )}
        `,
      );

      if (cardFormat.length == 0) {
        const addCategory = await dbConnection.query(`
        INSERT INTO manage_getsters_db.getster_profile_eidentity_card_format
        (
        getster_category_id,
        is_getster_photo_id_to_be_displayed,
        is_app_icon_to_be_displayed,
        is_barcode_id_to_be_displayed,
        is_getster_date_of_birth_to_be_displayed,
        is_getster_category_name_to_be_displayed,
        is_registered_educational_institution_name_to_be_displayed,
        is_registered_mobile_no_to_be_displayed,
        is_additional_mobile_no_to_be_displayed,
        is_getster_blood_group_to_be_dispalyed,
        is_email_to_be_displayed,
        is_address_to_be_displayed
        )
        VALUES
        (
         ${mysql.escape(checkCategory[i].getster_category_id)},
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1'
         )
        `);
      }
    }

    return getster_category_id;
  }

  async manageGetsterProfileLoginResetGetsterCategoryName(loginData: any) {
    const getster_category_id = await dbConnection.query(`
    select c.getster_category_id from manage_getsters_db.getster_profile  a
    inner join  manage_getsters_db.registered_users_registered_getster_categories b
    on a.getster_id = b.getster_id left join  manage_getsters_db.getster_category c
    on b.getster_category_id = c.getster_category_id where 
     a.getster_id = ${mysql.escape(loginData.user.getster_id)};
    `);

    const checkCategory = await dbConnection.query(`
     SELECT getster_category_id  FROM manage_getsters_db.registered_users_registered_getster_categories
     where ${mysql.escape(loginData.user.getster_id)}`);

    for (let i = 0; i < checkCategory.length; i++) {
      const cardFormat = await dbConnection.query(
        `SELECT getster_category_id FROM manage_getsters_db.getster_profile_eidentity_card_format
         where getster_category_id = ${mysql.escape(
           checkCategory[i].getster_category_id,
         )}
        `,
      );

      if (cardFormat.length == 0) {
        const addCategory = await dbConnection.query(`
        INSERT INTO manage_getsters_db.getster_profile_eidentity_card_format
        (
        getster_category_id,
        is_getster_photo_id_to_be_displayed,
        is_app_icon_to_be_displayed,
        is_barcode_id_to_be_displayed,
        is_getster_date_of_birth_to_be_displayed,
        is_getster_category_name_to_be_displayed,
        is_registered_educational_institution_name_to_be_displayed,
        is_registered_mobile_no_to_be_displayed,
        is_additional_mobile_no_to_be_displayed,
        is_getster_blood_group_to_be_dispalyed,
        is_email_to_be_displayed,
        is_address_to_be_displayed
        )
        VALUES
        (
         ${mysql.escape(checkCategory[i].getster_category_id)},
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1'
         )
        `);
      }
    }
    // console.log(getster_category_id);

    return getster_category_id;
  }

  async getsterBizLocationUpdate(getster: any, loginData: any): Promise<any> {
    try {
      // await dbConnection.query(`SET SQL_SAFE_UPDATES = 0;`);
      const dateTime = loginData.user.time_zone_iana_string;
      var local = DateTime.local({ zone: dateTime });
      var overrideZone = DateTime.fromISO(local, {
        zone: dateTime,
      });
      var entry_local_date_time = overrideZone.toString();
      const data = await dbConnection.query(`
      UPDATE manage_getsters_db.getster_profile
      SET
      residential_address_gps = point(${mysql.escape(
        getster.gps_coordinates.lat,
      )},${mysql.escape(getster.gps_coordinates.lng)}),
      e_id_card_address = ${mysql.escape(getster.address)}
      where getster_id = ${mysql.escape(getster.getster_id)}
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
      ${mysql.escape(getster.getster_id)},
       'Update',
      date_format( ${mysql.escape(entry_local_date_time)},'%y-%m-%d %h:%i:%s'),
      ${mysql.escape(loginData.user.getster_id)}
      );
      `);
      return {
        status: HttpStatus.OK,
        message: 'Update Successful',
      };
    } catch {
      return {
        status: HttpStatus.BAD_GATEWAY,
        message: 'Invalid Request',
      };
    }
  }

  async getGesterEIdentityCardValues(getster_id: number) {
    let is_getster_photo_id_to_be_displayed = 0;
    let is_app_icon_to_be_displayed = 0;
    let is_barcode_id_to_be_displayed = 0;
    let is_getster_date_of_birth_to_be_displayed = 0;
    let is_getster_category_name_to_be_displayed = 0;
    let is_registered_educational_institution_name_to_be_displayed = 0;
    let is_registered_mobile_no_to_be_displayed = 0;
    let is_additional_mobile_no_to_be_displayed = 0;
    let is_getster_blood_group_to_be_dispalyed = 0;
    let is_email_to_be_displayed = 0;
    let is_address_to_be_displayed = 0;
    let is_getster_background_color: any;
    let is_getster_text_type_1: any;
    let is_getster_text_type_2: any;
    let is_getster_text_type_3: any;
    let is_getster_font: any;
    const getsterIds: any = [];
    const result: any = [];

    const checkCategory = await dbConnection.query(`
     SELECT getster_category_id  FROM manage_getsters_db.registered_users_registered_getster_categories
     where ${mysql.escape(getster_id)}`);

    for (let i = 0; i < checkCategory.length; i++) {
      const cardFormat = await dbConnection.query(
        `SELECT getster_category_id FROM manage_getsters_db.getster_profile_eidentity_card_format
         where getster_category_id = ${mysql.escape(
           checkCategory[i].getster_category_id,
         )}
        `,
      );

      if (cardFormat.length == 0) {
        const addCategory = await dbConnection.query(`
        INSERT INTO manage_getsters_db.getster_profile_eidentity_card_format
        (
        getster_category_id,
        is_getster_photo_id_to_be_displayed,
        is_app_icon_to_be_displayed,
        is_barcode_id_to_be_displayed,
        is_getster_date_of_birth_to_be_displayed,
        is_getster_category_name_to_be_displayed,
        is_registered_educational_institution_name_to_be_displayed,
        is_registered_mobile_no_to_be_displayed,
        is_additional_mobile_no_to_be_displayed,
        is_getster_blood_group_to_be_dispalyed,
        is_email_to_be_displayed,
        is_address_to_be_displayed
        )
        VALUES
        (
         ${mysql.escape(checkCategory[i].getster_category_id)},
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1',
         '1'
         )
        `);
      }
    }

    const getId = await dbConnection.query(`
           SELECT a.getster_id, b.getster_category_id, getster_category_id as gester_category_ids 
       FROM manage_getsters_db.getster_profile a
       left join  manage_getsters_db.registered_users_registered_getster_categories b
       on a.getster_id = b.getster_id 
       where b.getster_id=${mysql.escape(getster_id)}
    `);

    for (let i = 0; i < getId.length; i++) {
      getsterIds.push(getId[i].getster_category_id);
    }
    // console.log(getsterIds);

    // const card = await dbConnection
    //   .query(
    //     `
    //    SELECT a.getster_id, b.getster_category_id, group_concat(getster_category_id) as gester_category_ids
    //    FROM manage_getsters_db.getster_profile a
    //    left join  manage_getsters_db.registered_users_registered_getster_categories b
    //    on a.getster_id = b.getster_id
    //    where b.getster_id=${mysql.escape(getster_id)}
    //    group by b.getster_id`,
    //   )
    //   .then((data) => data[0]);

    // const collection_of_categories = card.gester_category_ids.split(',');

    for (let i = 0; i < getsterIds.length; i++) {
      const idCard = await dbConnection
        .query(
          `
        SELECT * FROM manage_getsters_db.getster_profile_eidentity_card_format
        where getster_category_id = ${mysql.escape(getsterIds[i])}
         `,
        )
        .then((data) => data[0]);

      if (idCard.is_getster_photo_id_to_be_displayed == 1) {
        is_getster_photo_id_to_be_displayed = 1;
      }

      if (idCard.is_app_icon_to_be_displayed == 1) {
        is_app_icon_to_be_displayed = 1;
      }

      if (idCard.is_barcode_id_to_be_displayed == 1) {
        is_barcode_id_to_be_displayed = 1;
      }

      if (idCard.is_getster_date_of_birth_to_be_displayed == 1) {
        is_getster_date_of_birth_to_be_displayed = 1;
      }

      if (idCard.is_getster_category_name_to_be_displayed == 1) {
        is_getster_category_name_to_be_displayed = 1;
      }
      if (
        idCard.is_registered_educational_institution_name_to_be_displayed == 1
      ) {
        is_registered_educational_institution_name_to_be_displayed = 1;
      }
      if (idCard.is_registered_mobile_no_to_be_displayed == 1) {
        is_registered_mobile_no_to_be_displayed = 1;
      }
      if (idCard.is_additional_mobile_no_to_be_displayed == 1) {
        is_additional_mobile_no_to_be_displayed = 1;
      }
      if (idCard.is_getster_blood_group_to_be_dispalyed == 1) {
        is_getster_blood_group_to_be_dispalyed = 1;
      }
      if (idCard.is_email_to_be_displayed == 1) {
        is_email_to_be_displayed = 1;
      }
      if (idCard.is_address_to_be_displayed == 1) {
        is_address_to_be_displayed = 1;
      }
    }
    result.push({
      getster_photo: is_getster_photo_id_to_be_displayed,
      app_icon: is_app_icon_to_be_displayed,
      barcode: is_barcode_id_to_be_displayed,
      dob: is_getster_date_of_birth_to_be_displayed,
      category: is_getster_category_name_to_be_displayed,
      institution: is_registered_educational_institution_name_to_be_displayed,
      mobile1: is_registered_mobile_no_to_be_displayed,
      mobile2: is_additional_mobile_no_to_be_displayed,
      bldg: is_getster_blood_group_to_be_dispalyed,
      email: is_email_to_be_displayed,
      add: is_address_to_be_displayed,
    });

    return result;
  }

  async getsterCompleteDetails(getster_id: number) {
    const getster = await dbConnection.query(`
     SELECT 
     a.getster_id,
     a.registered_mobile_country_code,
     a.registered_mobile_number,
     a.getster_registration_login_approval_status,
     a.first_name,
     a.last_name,
     a.date_of_birth,
     a.gender,
     a.about_user,
     a.e_id_card_mobile_no,
     a.e_id_card_website,
     a.e_id_card_email_id,
     a.e_id_card_address,
     a.residential_address_gps as gps,
     a.emergency_mobile_no,
     a.getster_blood_group,
     a.additional_getster_data_field_values,
     b.getster_password

     FROM manage_getsters_db.getster_profile a 
     left join manage_getsters_db.getster_login_data b 
     on a.getster_id = b.getster_id
      where a.getster_id = ${mysql.escape(getster_id)} 
    `);

    let b: any[] = [];
    for (let i = 0; i < getster.length; i++) {
      let a: any[] = [];
      const category_id = await dbConnection.query(`
        SELECT getster_category_id
        FROM manage_getsters_db.registered_users_registered_getster_categories
        where getster_id=${getster[i].getster_id};
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
    const result: any = [];

    for (let i = 0; i < getster.length; i++) {
      result.push({
        getster_id: getster[i].getster_id,
        name: getster[i].first_name,
        lastName: getster[i].last_name,
        dob: getster[i].date_of_birth,
        pass: getster[i].getster_password,
        gender: getster[i].gender,
        coutry_code: getster[i].registered_mobile_country_code,
        getser_category: b[0][0],
        mobile: getster[i].registered_mobile_number,
        emgcontact: getster[i].emergency_mobile_no,
        // profilepic: getster[i].first_login_image_of_the_day_without_bg,
        aditional_field_user: getster[i].about_user,
        ademail: getster[i].e_id_card_email_id,
        bldgrup: getster[i].getster_blood_group,
        adlocationadd: getster[i].e_id_card_address,
        additional_field: getster[i].additional_getster_data_field_values,
        gps: getster[i].gps,
      });
    }

    return result;
  }

  async manageGetsterApproveCompleteDetails(loginData) {
    const getster = await dbConnection.query(`
     SELECT 
     a.getster_id,
     a.registered_mobile_country_code,
     a.registered_mobile_number,
     a.getster_registration_login_approval_status,
     a.first_name,
     a.last_name,
     a.date_of_birth,
     a.gender,
     a.about_user,
     a.e_id_card_mobile_no,
     a.e_id_card_website,
     a.e_id_card_email_id,
     a.e_id_card_address,
     a.residential_address_gps as gps,
     a.emergency_mobile_no,
     a.getster_blood_group,
     a.additional_getster_data_field_values,
     b.getster_password

     FROM manage_getsters_db.getster_profile a 
     left join manage_getsters_db.getster_login_data b 
     on a.getster_id = b.getster_id
      where a.getster_id = ${mysql.escape(loginData.user.getster_id)} 
    `);

    let b: any[] = [];
    for (let i = 0; i < getster.length; i++) {
      let a: any[] = [];
      const category_id = await dbConnection.query(`
        SELECT getster_category_id
        FROM manage_getsters_db.registered_users_registered_getster_categories
        where getster_id=${getster[i].getster_id};
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
    const result: any = [];

    for (let i = 0; i < getster.length; i++) {
      result.push({
        getster_id: getster[i].getster_id,
        name: getster[i].first_name,
        lastName: getster[i].last_name,
        dob: getster[i].date_of_birth,
        pass: getster[i].getster_password,
        gender: getster[i].gender,
        coutry_code: getster[i].registered_mobile_country_code,
        getser_category: b[0][0],
        mobile: getster[i].registered_mobile_number,
        emgcontact: getster[i].emergency_mobile_no,
        // profilepic: getster[i].first_login_image_of_the_day_without_bg,
        aditional_field_user: getster[i].about_user,
        ademail: getster[i].e_id_card_email_id,
        bldgrup: getster[i].getster_blood_group,
        adlocationadd: getster[i].e_id_card_address,
        additional_field: getster[i].additional_getster_data_field_values,
        gps: getster[i].gps,
      });
    }

    return result;
  }

  async checkIdentityCardAvailable(category_id: any): Promise<any> {
    console.log(category_id);
    let categoryCount = 0;

    for (let i = 0; i < category_id.length; i++) {
      const count = await dbConnection.query(`
     SELECT count(*) as getsterCategoryIdCount  FROM 
     manage_getsters_db.getster_profile_eidentity_card_format
     where getster_category_id = ${mysql.escape(
       category_id[i].getster_category_id,
     )}
     `);
      categoryCount = categoryCount + Number(count[0].getsterCategoryIdCount);
    }
    console.log(categoryCount);

    return {
      status: HttpStatus.OK,
      message: 'Get Successfully',
      data: [{ categoryCount: categoryCount }],
    };
  }
}
