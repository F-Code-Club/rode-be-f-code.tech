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

    async googleLogin(credential: string) {
        // Verify credential
        const client = new OAuth2Client(RodeConfig.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: RodeConfig.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
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
