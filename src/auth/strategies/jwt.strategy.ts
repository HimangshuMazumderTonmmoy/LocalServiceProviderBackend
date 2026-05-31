import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // This extracts token from header Authorization: Bearer <token>
      ignoreExpiration: false,                                  // Was this token signed using the correct secret?
      secretOrKey: process.env.JWT_SECRET as string,            // It will not ignore if token is expired
    });
  }

  async validate(payload: { sub: number; role: string }) {
    return { id: Number(payload.sub), role: payload.role }; // this becomes req.user on every protected route
  }
}