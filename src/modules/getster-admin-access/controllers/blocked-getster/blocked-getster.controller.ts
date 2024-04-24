import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { BlockedGetsterService } from '../../services/blocked-getster/blocked-getster.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@ApiTags('blocked-getster')
@Controller('/getster/admin')
export class BlockedGetsterController {
  constructor(private _service: BlockedGetsterService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-manual-block-getster')
  async getManualBockGetster(
    @Req() request: Request,
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('camp_id') campId: number,
  ): Promise<any> {
    const data = await this._service.getManualBockGetster(pageNo, pageSize, campId);
    return data;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-auto-block-getster')
  async getAutoBockGetster(
    @Req() request: Request,
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('camp_id') campId: number,
  ): Promise<any> {
    const data = await this._service.getAutoBockGetster(pageNo, pageSize, campId);
    return data;
  }

  @Get('check-roll-back')
  async checkRollBack(): Promise<any> {
    const data = await this._service.checkRollBack();
    return data;
  }
}
