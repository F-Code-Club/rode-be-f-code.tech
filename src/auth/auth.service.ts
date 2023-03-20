import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { AccountsService } from '../accounts/accounts.service';
import RodeConfig from '../etc/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly jwtService: JwtService,
  ) {}

  async getInfoFromGoogle(credential: string) {
    const client = new OAuth2Client(RodeConfig.GOOGLE_CLIENT_ID);
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: RodeConfig.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (
        payload.email != RodeConfig.ADMIN_EMAIL &&
        payload.hd != 'fpt.edu.vn'
      ) {
        return [null, 'Your email is not allowed'];
      }
      return [payload, null];
    } catch (err) {
      return [null, err];
    }
  }

  async googleLogin(credential: string) {
    // Verify credential
    const [payload, err] = await this.getInfoFromGoogle(credential);
    if (err) {
      return [null, err];
    }
    const email = payload.email;

    // Check database
    const account = await this.accountsService.getByEmail(email);
    if (!account) {
      return [null, 'Account not found'];
    }

    // Sign JWT
    const token = this.jwtService.sign({ sub: account.id });
    return [token, null];
  }
}
