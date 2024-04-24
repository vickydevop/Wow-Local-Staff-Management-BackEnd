/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class eidentitycard {
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
  is_address_to_be_displayed: boolean;
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
