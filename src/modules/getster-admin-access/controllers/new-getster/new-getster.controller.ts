import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { GetsterProfile } from 'src/models/dto/getster-profile.dto';
import { NewGetsterService } from '../../services/new-getster/new-getster.service';
import { Request } from 'express';
import { log } from 'console';
@ApiTags('new-getster')
@Controller('/admin/getster')
export class NewGetsterController {
  constructor(
    private _service: NewGetsterService,
    private _authService: AuthService,
  ) {}

  @Get('get-new-getster')
  async getNewGetster(
    @Query('pageno') pageno: number,
    @Query('per_page') per_page: number,
    @Query('camp_id') CampId: number,
  ): Promise<any> {
    // console.log('res', request.headers.authorization);
    const data = await this._service.getNewGetster(pageno, per_page,CampId);
    return data;
  }
  @ApiBearerAuth('JWT-auth')
  // @UseGuards(JwtAuthGuard)
  @Put('update-new-getster')
  async updateNewGetster(
    @Req() request: Request,
    @Body() body: GetsterProfile,
  ): Promise<any> {
    // let token = String(request.headers.authorization).replace('Bearer ', '');
    let token;
    if (request.headers.authorization) {
      token = String(request.headers.authorization).replace('Bearer ', '');
    }
    if (request.headers.authenticationtoken) {
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    }

    let loginData = await this._authService.verifyJwt(token);
    // console.log(body);
    const data = await this._service.updateNewGetster(body, loginData);
    return data;
  }
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('get-getster-profile')
  async getGesterProfile(
    @Query('getster_id') getster_id: number,
    @Req() request: Request,
  ): Promise<any> {
    const data = await this._service.getGesterProfile(getster_id);
    return data;
  }
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('get-audit-trail')
  async getAuditTrail(
    @Query('pageno') pageno: number,
    @Query('per_page') per_page: number,
    @Req() request: Request,
  ): Promise<any> {
    const data = await this._service.getAuditTrail(pageno, per_page);
    return data;
  }

  @Get('profile-card-url')
  async profileCardUrl(@Query('getster_id') getster_id: number): Promise<any> {
    try {
      const payload = {
        getster_id: getster_id,
      };
      const token = await this._authService.generateJwt(payload);
      const cardURl = `http://g14.getster.tech/#/?token=${token}`;
      return {
        status: HttpStatus.OK,
        message: 'Data Get Successfully',
        data: cardURl,
      };
    } catch {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid Request',
      };
    }
  }
}
