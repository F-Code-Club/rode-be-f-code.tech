import { AccountsService } from '@accounts/accounts.service';
import RodeConfig from '@etc/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly accountsService: AccountsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: RodeConfig.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(payload: any) {
    const accountId = payload.sub;
    const account = await this.accountsService.getById(accountId, true);
    if (!account || !account.isEnabled || account.isLocked) {
      return null;
    }
    return account;
  }
}
