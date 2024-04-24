import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Request } from 'express';
import { AuthService } from 'src/auth/services/auth.service';
import ResponseInterface from 'src/models/interface/responce-interface.dto';
@Controller('login')
export class LoginController {
  constructor(private _authService: AuthService) {}

  @Get('get--token-gen')
  async getTOkenGen(
    // @Query('customer_id') customer_id: number,
    // @Query('country_code') country_code: string,
    @Req() req: Request,
  ): Promise<ResponseInterface> {
    try {
      // const payload = {
      //   getster_id: 2,
      //   time_zone_iana_string: 'Asia/Kolkata',
      //   country_code: 'in',
      //   registered_mobile_country_code: '91',
      // };

      const payload = {
        getster_id: 3,
        registered_mobile_country_code: 91,
        roles: 1,
        time_zone_iana_string: 'Asia/Kolkata',
      };
      const token = await this._authService.generateJwt(payload);

      // console.log("token", token);

      return {
        statusCode: 200,
        message: 'Get data successful',
        data: token,
      };
    } catch (error) {
      throw error;
    }
  }
}
