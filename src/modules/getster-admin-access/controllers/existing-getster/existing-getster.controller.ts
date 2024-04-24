import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { ExistingGetsterService } from '../../services/existing-getster/existing-getster.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@ApiTags('existing-getster')
@Controller('/admin/getster')
export class ExistingGetsterController {
  constructor(private _service: ExistingGetsterService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-existing-getster')
  async getExistingGetster(
    @Req() request: Request,
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('camp_id') CampId: number,
  ): Promise<any> {
    const data = await this._service.getExistingGetster(pageNo, pageSize, CampId);
    return data;
  }
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('JWT-auth')
  // @Get('get-console-getster')
  // async getConsoleGetster(
  //   @Req() request: Request,
  //   @Query('pageNo') pageNo: number,
  //   @Query('pageSize') pageSize: number,
  // ): Promise<any> {
  //   const data = await this._service.getConsoleGetster(pageNo, pageSize);
  //   return data;
  // }
}
