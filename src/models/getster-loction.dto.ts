/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class gpsCoordinates {
  @ApiProperty()
  lat: number;
  @ApiProperty()
  lng: number;
}
export class GetsterLocation {
  @ApiProperty()
  getster_id: number;
  @ApiProperty()
  gps_coordinates: gpsCoordinates;
}
