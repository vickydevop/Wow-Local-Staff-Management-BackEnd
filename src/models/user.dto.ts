import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  additionalDataFields: string;
}
