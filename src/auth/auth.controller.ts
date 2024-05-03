import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Account } from '../accounts/entities/account.entity';
import CurrentAccount from '../decorators/current-account.decorator';
import ResponseObject from '../etc/response-object';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthLogin } from '@auth/dtos/auth.login.dto';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async self(@CurrentAccount() account: Account) {
    return account;
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@CurrentAccount() account: Account) {
    const [data, err] = await this.authService.refreshToken(account);
    if (!data) {
      return new ResponseObject(
        HttpStatus.UNAUTHORIZED,
        'Refresh Token Failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Refresh Token Success', data, err);
  }

  @Post('authenticate')
  async authentication(@Body() login: AuthLogin) {
    const [data, err] = await this.authService.authenticateUsingUserPass(login);
    if (!data) {
      return new ResponseObject(
        HttpStatus.UNAUTHORIZED,
        'Login Failed',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Login Success', data, err);
  }
}
