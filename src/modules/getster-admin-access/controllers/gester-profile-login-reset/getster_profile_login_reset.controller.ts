import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/services/auth.service';
import { treegetstercategory } from 'src/models/dto/treegetstercategory.dto';
import { NewUserDto } from 'src/models/dto/user.dto';
import { GetsterProfileLoginResetService } from '../../services/gester-profile-login-reset/getster_profile_login_reset.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
@Controller('getster-profile-login-reset')
@ApiTags('Getster-profile-login')
export class GetsterProfileLoginResetController {
  constructor(
    private service: GetsterProfileLoginResetService,
    private _authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-getster-profile-login-reset')
  async getsterProfileLoginReset(
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number,
    @Query('camp_id') campId: number,
    @Req() request: Request,
  ) {
    const data = await this.service.getsterProfileLoginReset(pageNo, pageSize, campId);
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('update-getsters-profile-login-reset')
  async updategetstersProfileLoginReset(
    @Query('getster_id') getster_id: number,
    @Req() request: Request,
    @Body() data: any,
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

    return await this.service.updategetstersProfileLoginReset(
      getster_id,
      loginData,
      data,
    );
  }
  @Put('update-getsters-profile-login-reset-mobile')
  async updateGetsteresProfileLoginResetMobileNo(
    @Query('getster_id') getster_id: number,
    @Query('getster_id') entry_by_user_id: number,
    @Body() data: NewUserDto,
  ) {
    // console.log(data);

    return await this.service.updateGetsteresProfileLoginResetMobileNo(
      data,
      getster_id,
      entry_by_user_id,
    );
  }
  @Put('update-getsters-profile-login-reset-pass')
  async updateGetstersProfileLoginResetPass(
    @Query('getster_id') getster_id: number,
    @Query('entry_by_user_id') entry_by_user_id: number,
    @Body() data: NewUserDto,
  ) {
    // console.log(data);

    return await this.service.updateGetstersProfileLoginResetPass(
      data,
      getster_id,
      entry_by_user_id,
    );
  }
  @Get('get-getster-profile-login-reset-getster-category-name')
  async getsterProfileLoginResetgetsterCategoryName(
    @Query('getster_id') getster_id: number,
  ) {
    const data = await this.service.getsterProfileLoginResetgetsterCategoryName(
      getster_id,
    );
    return {
      statusCode: 200,
      message: 'Get data successful',
      data,
    };
  }

  @Put('update-approve-getsters-profile-login-reset-mobile')
  async updateApproveGetstersProfileLoginResetMobileNo(
    @Query('getster_id') getster_id: number,
    @Query('entry_by_user_id') entry_by_user_id: number,
    @Body() data: any,
  ) {
    // console.log(data);

    return await this.service.updateApproveGetstersProfileLoginResetMobileNo(
      getster_id,
      entry_by_user_id,
      data,
    );
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('update-approve-getsters-profile-login-reset')
  async updateApproveGetstersProfileLoginReset(
    @Req() request: Request,
    @Body() data: any,
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
    return await this.service.updateApproveGetstersProfileLoginReset(
      loginData,
      data,
    );
  }

  @Get('get-getster-category-wise-additional-fields')
  async getGetsterCategoryWiseAdditionalFields(
    @Query('getster_id') getster_id: number,
  ) {
    let data = await this.service.getGetsterCategoryWiseAdditionalFields(
      getster_id,
    );
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }
  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-manage-getster-category-wise-additional-fields')
  async getManageGetsterCategoryWiseAdditionalFields(@Req() request: Request) {
    let token;
    if (request.headers.authorization)
      token = String(request.headers.authorization).replace('Bearer ', '');
    if (request.headers.authenticationtoken)
      token = String(request.headers.authenticationtoken).replace(
        'Bearer ',
        '',
      );
    let loginData = await this._authService.verifyJwt(token);

    let data = await this.service.getManageGetsterCategoryWiseAdditionalFields(
      loginData,
    );
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-approve-getster-category-wise-additional-fields')
  async getApproveGetsterCategoryWiseAdditionalFields(
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

    let data = await this.service.getApproveGetsterCategoryWiseAdditionalFields(
      getster_id,
    );
    return {
      statusCode: 200,
      message: 'ok',
      data,
    };
  }

  @Get('get-getster-category')
  async getGetsterCategory(
    @Query('getster_category_id') getster_category_id: any,
  ) {
    let data = await this.service.getGetsterCategory(getster_category_id);
    return data;
  }

  @Put('tree-category-id-update')
  async updateTreeCategoryId(
    @Query('getster_id') getster_id: number,
    @Body() category_id: treegetstercategory,
  ) {
    return await this.service.updateTreeCategoryId(getster_id, category_id);
  }

  @Put('update-approve-tree-category-id')
  async updateApproveTreeCategoryId(
    @Query('getster_id') getster_id: number,
    @Body() category_id: any,
  ) {
    return await this.service.updateApproveTreeCategoryId(
      getster_id,
      category_id,
    );
  }
}
