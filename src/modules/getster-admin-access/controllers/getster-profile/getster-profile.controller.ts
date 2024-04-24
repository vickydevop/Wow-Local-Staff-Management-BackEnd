import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { eidentitycard } from 'src/models/dto/eidentitycard.dto';
import { GetsterProfileService } from '../../services/getster-profile/getster-profile.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@ApiTags('getster-profile')
@Controller('getster-profile')
export class GetsterProfileController {
  constructor(
    private service: GetsterProfileService,
    private _authService: AuthService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('create_tables')
  async getsterEIdentityCardEligibilityCard(
    @Query('getster_category_id') getster_category_id: string,
    @Body() data: eidentitycard,
    @Req() request: Request,
  ) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    await this.service.getsterEIdentityCardEligibilityCard(
      getster_category_id,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-e-identity-card-values')
  async getEIdentityCardValues(
    @Query('getster_category_id') getster_category_id: string,
    @Req() request: Request,
  ) {
    const data = await this.service.getEIdentityCardValues(getster_category_id);
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-all-categories')
  async getAllCategories(@Req() request: Request): Promise<any> {
    try {
      const tasksData = await this.service.getAllCategories();
      return {
        status: HttpStatus.OK,
        message: 'Tasks Fetched Successfully',
        data: tasksData,
      };
    } catch (error) {
      throw error;
    }
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-approve-getsters')
  async getApproveProfileChangesByUsers(@Req() request: Request) {
    const data = await this.service.getApproveProfileChangesByUsers();
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('delete-approve-getsters')
  async deleteApproveProfileChangesByUsersDelete(
    @Query('getster_id') getster_id: number,
    @Req() request: Request,
  ) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    await this.service.deleteApproveProfileChangesByUsersDelete(
      getster_id,
      loginData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('approve-profile-changes-by-users')
  async approveProfileChangesByUsersUpdate(
    @Query('getster_id') getster_id: number,
    @Body() data: any,
    @Req() request: Request,
  ) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    return await this.service.approveProfileChangesByUsersUpdate(
      data,
      getster_id,
      loginData,
    );
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-getster-profile-login-reset-getster-category-name')
  async getsterProfileLoginResetGetsterCategoryName(
    @Query('getster_id') getster_id: number,
    @Req() request: Request,
  ) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    const data = await this.service.getsterProfileLoginResetGetsterCategoryName(
      getster_id,
    );
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-manage-getster-profile-login-reset-getster-category-name')
  async manageGetsterProfileLoginResetGetsterCategoryName(
    @Req() request: Request,
  ) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    const data =
      await this.service.manageGetsterProfileLoginResetGetsterCategoryName(
        loginData,
      );
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('getster-biz-location-update')
  async getsterBizLocationUpdate(
    @Body() getster: any,
    @Req() request: Request,
  ): Promise<any> {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    const data = await this.service.getsterBizLocationUpdate(
      getster,
      loginData,
    );
    return;
  }

  @Get('get-getster-e-identity-card-values')
  async getGesterEIdentityCardValues(@Query('getster_id') getster_id: number) {
    const data = await this.service.getGesterEIdentityCardValues(getster_id);
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }

  @Get('get-gester-complete-details')
  async getsterCompleteDetails(@Query('getster_id') getster_id: number) {
    const data = await this.service.getsterCompleteDetails(getster_id);
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('manage-gester-complete-details')
  async manageGetsterApproveCompleteDetails(@Req() request: Request) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);
    const data = await this.service.manageGetsterApproveCompleteDetails(
      loginData,
    );
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }

  @Get('get-check-category')
  async checkIdentityCardAvailable(
    @Query('getster_id') getster_id: number,
  ): Promise<any> {
    const data = await this.service.checkIdentityCardAvailable(getster_id);
    return;
  }
}
