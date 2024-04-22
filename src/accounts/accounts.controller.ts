import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/role.guard';
import Roles from '../decorators/roles.decorator';
import { RoleEnum } from '../etc/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import ResponseObject from '../etc/response-object';
import { UpdateAccountDto } from './dtos/update-account.dto';
import CurrentAccount from '@decorators/current-account.decorator';
import { Account } from './entities/account.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginationDto } from '@etc/pagination.dto';
import { UpdateRoleAccountDto } from './dtos/update-role-account.dto';
import CurrentAccountRole from '@decorators/current-account-role.decorator';

@Controller('accounts')
@ApiTags('Accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('get-all')
  @ApiQuery({ type: PaginationDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  async getAll(@Paginate() query: PaginateQuery) {
    const [accounts, err] = await this.accountsService.paginateGetAll(query);
    if (!accounts) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get all accounts failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get all accounts success!',
      accounts,
      null,
    );
  }

  @Get('get-one/:id')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getById(@Param('id') id: string) {
    const account = await this.accountsService.getById(id);
    if (!account) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get account failed!',
        null,
        'check ID again',
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get account success!',
      account,
      null,
    );
  }

  @Post('create-one')
  async createOne(@Body() info: CreateAccountDto) {
    const [account, err] = await this.accountsService.createOne(info);
    if (!account) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Create account failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Create account success!',
      account,
      null,
    );
  }

  @Post('update-one/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async updateOne(
    @Param('id') id: string,
    @CurrentAccount() curAccount: Account,
    @Body() info: UpdateAccountDto,
  ) {
    const [account, err] = await this.accountsService.updateOne(
      curAccount.role == RoleEnum.ADMIN ? id : curAccount.id,
      info,
    );
    if (!account) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update account failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Update account success!',
      account,
      null,
    );
  }

  @Post('toggle-active/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async toggleActive(@Param('id') id: string) {
    const [account, err] = await this.accountsService.toggleActive(id);
    if (!account) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Toggle active account failed!',
        null,
        err,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Toggle active account success!',
      account,
      null,
    );
  }

  @Roles(RoleEnum.MANAGER)
  @Post('users/active-account')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async activeUser() {
    return await this.accountsService.activateAllAccount();
  }

  @Roles(RoleEnum.MANAGER, RoleEnum.ADMIN)
  @Patch('change-role')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async changeUserRole(
    @Body() updateRole: UpdateRoleAccountDto,
    @CurrentAccountRole() role: RoleEnum,
  ) {
    const [data, err] = await this.accountsService.updateUserRole(
      updateRole,
      role,
    );
    if (!data)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Update Role Failed',
        data,
        err,
      );
    return new ResponseObject(HttpStatus.OK, 'Update Role Success', data, err);
  }
}
