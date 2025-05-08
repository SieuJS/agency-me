import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Service } from 'src/modules/tokens';
import { Config } from 'src/modules/common/model';
import { CommonModule } from '../common';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [CommonModule],
      inject: [Service.CONFIG],
      useFactory: (config: Config) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
