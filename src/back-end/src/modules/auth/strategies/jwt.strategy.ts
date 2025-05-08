import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../models/jwt-payload.dto';
import { JwtResponseDto } from '../models/jwt-response.dto';
import { Service } from 'src/modules/tokens';
import { Config } from 'src/modules/common/model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Service.CONFIG)
    private readonly config: Config,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET,
    });
  }

  validate(payload: JwtPayloadDto): JwtResponseDto {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
