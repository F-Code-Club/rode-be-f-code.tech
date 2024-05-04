import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountsService } from '../accounts/accounts.service';
import RodeConfig from '../etc/config';
import { AuthLogin } from './dtos/auth.login.dto';
import { Account } from '@accounts/entities/account.entity';
import { Utils } from '@etc/utils';
import { AuthTokenReturn } from './dtos/auth.token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateUsingUserPass(auth: AuthLogin) {
    const user = await this.accountsService.getByEmail(auth.username, false);
    const validateResult = this.validateLoginProcess(user);
    if (validateResult != null) return validateResult;
    const isCorrectPassword = await Utils.comparePassword(
      auth.password,
      user.password,
    );
    if (!isCorrectPassword)
      return [null, 'Password Is Not Correct, Please Check Password Again'];
    this.accountsService.updateLoggedIn(user.id, true);
    const key = await this.generateToken(user);
    return [
      new AuthTokenReturn(key[0], user.role).setRefreshToken(key[1]),
      null,
    ];
  }

  async refreshToken(user: Account) {
    if (!user.isEnabled || user.isLocked)
      return [null, 'This Account Is Not Active Or Locked'];
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.id,
      },
      {
        secret: RodeConfig.JWT_SECRET,
        expiresIn: RodeConfig.JWT_EXPIRES_IN,
      },
    );
    return [new AuthTokenReturn(accessToken, user.role), null];
  }

  private validateLoginProcess(user: Account) {
    if (!user) {
      return [null, 'Account Not Found'];
    }
    if (!user.isEnabled || user.isLocked)
      return [null, 'This Account Is Not Active Or Locked'];
    if (user.isLoggedIn) {
      return [null, 'This Account Is Already Login'];
    }
    return null;
  }
  async generateToken(user: Account) {
    const username = user.email;
    const id = user.id;
    return await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          username: username,
        },
        {
          secret: RodeConfig.JWT_SECRET,
          expiresIn: RodeConfig.JWT_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          username: username,
        },
        {
          secret: RodeConfig.REFRESH_TOKEN,
          expiresIn: RodeConfig.JWT_REFRESH_EXPIRES_IN,
        },
      ),
    ]);
  }
}
