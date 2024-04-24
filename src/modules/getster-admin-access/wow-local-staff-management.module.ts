import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { BlockedGetsterController } from './controllers/blocked-getster/blocked-getster.controller';
import { ExistingGetsterController } from './controllers/existing-getster/existing-getster.controller';
import { GetsterProfileLoginResetController } from './controllers/gester-profile-login-reset/getster_profile_login_reset.controller';
import { GetsterProfileController } from './controllers/getster-profile/getster-profile.controller';
import { LoginController } from './controllers/login/login.controller';
import { NewGetsterController } from './controllers/new-getster/new-getster.controller';
import { QueryProceduresModule } from './query-procedures/query-procedures.module';
import { BlockedGetsterService } from './services/blocked-getster/blocked-getster.service';
import { ExistingGetsterService } from './services/existing-getster/existing-getster.service';
import { GetsterProfileLoginResetService } from './services/gester-profile-login-reset/getster_profile_login_reset.service';
import { GetsterProfileService } from './services/getster-profile/getster-profile.service';
import { NewGetsterService } from './services/new-getster/new-getster.service';

@Module({
  imports: [QueryProceduresModule, AuthModule],
  controllers: [
    NewGetsterController,
    ExistingGetsterController,
    BlockedGetsterController,
    GetsterProfileController,
    GetsterProfileLoginResetController,
    LoginController,
  ],
  providers: [
    NewGetsterService,
    ExistingGetsterService,
    BlockedGetsterService,
    GetsterProfileService,
    GetsterProfileLoginResetService,
  ],
})
export class WowLocalStaffManagementModule {}
