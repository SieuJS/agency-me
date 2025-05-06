import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AgencyModule } from './modules/agency/agency.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './modules/common';
import { DistrictModule } from './modules/district/district.module';

@Module({
  imports: [ CommonModule, AuthModule, UsersModule, AgencyModule, DistrictModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
