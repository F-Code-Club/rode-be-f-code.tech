import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Account } from '../accounts/entities/account.entity';
import CurrentAccount from '../decorators/current-account.decorator';
import ResponseObject from '../etc/response-object';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthLogin } from '@auth/dtos/auth.login.dto';

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

  @Post('authenticate')
  async authentication(@Body() login: AuthLogin){
    const[data, err] = await this.authService.authenticateUsingUserPass(login);
    if(!data){
      return new ResponseObject(
        HttpStatus.UNAUTHORIZED,
        'Login Failed',
        null,
        err
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Login Success',
      data,
      err
    );
  }

}
