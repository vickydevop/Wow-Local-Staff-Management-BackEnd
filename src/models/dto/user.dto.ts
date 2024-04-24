import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';
export class NewUserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  mobile: string;
  @ApiProperty()
  aditionaldata: string;
  @ApiProperty()
  dob: string;
  @ApiProperty()
  gender: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  headerValue0: string;
  @ApiProperty()
  headerValue1: string;
  @ApiProperty()
  headerValue2: string;
  @ApiProperty()
  formtwo1: string;
  @ApiProperty()
  formtwo2: string;
  @ApiProperty()
  formtwo3: string;
  @ApiProperty()
  formthree1: string;
  @ApiProperty()
  formthree2: string;
  @ApiProperty()
  formthree3: string;
}

export class getster_profile_eidentity_card_format {
  id: number;
  @ApiProperty()
  getster_category_id: string;
  @ApiProperty()
  is_getster_photo_id_to_be_displayed: boolean;
  @ApiProperty()
  is_app_icon_to_be_displayed: boolean;
  @ApiProperty()
  is_barcode_id_to_be_displayed: boolean;
  @ApiProperty()
  is_getster_date_of_birth_to_be_displayed: boolean;
  @ApiProperty()
  is_getster_category_name_to_be_displayed: boolean;
  @ApiProperty()
  is_registered_educational_institution_name_to_be_displayed: boolean;
  @ApiProperty()
  is_registered_mobile_no_to_be_displayed: boolean;
  @ApiProperty()
  is_additional_mobile_no_to_be_displayed: boolean;
  @ApiProperty()
  is_getster_blood_group_to_be_dispalyed: boolean;
  @ApiProperty()
  is_email_to_be_displayed: boolean;
  @ApiProperty()
  is_getster_background_color: string;
  @ApiProperty()
  is_getster_text_type_1: string;
  @ApiProperty()
  is_getster_text_type_2: string;
  @ApiProperty()
  is_getster_text_type_3: string;
  @ApiProperty()
  is_getster_font: string;
}

export class getster_profile_changes_pending_for_approval {
  @PrimaryGeneratedColumn('increment')
  getster_id: number;

  registered_mobile_country_code: string;

  registered_mobile_number: string;

  first_name: string;

  last_name: string;

  date_of_birth: string;

  gender: boolean;

  getster_blood_group: string;

  additional_user_data_field_values: string;

  about_user: string;

  emergency_mobile_number: string;

  getster_email_id: string;

  getster_address: string;

  getster_profile_update_datetime: string;
}

export class getster_profile_audit_trail {
  @PrimaryGeneratedColumn('increment')
  id: number;
  getster_id: number;
  entry_type_approve_delete_block_unblock_profile_login_reset: string;
  entry_local_date_time: string;
  entry_by_user_id: string;
}
