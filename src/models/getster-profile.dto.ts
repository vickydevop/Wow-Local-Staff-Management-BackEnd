/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class GetsterProfile {
  @ApiProperty()
  getster_id: number;
  @ApiProperty()
  approval_status: boolean;
  @ApiProperty()
  entry_getster_id: number;
  @ApiProperty()
  date_time: string;
}
