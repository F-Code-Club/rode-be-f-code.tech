import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Not, Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Account } from './entities/account.entity';
import { RoleEnum } from '@etc/enums';
import { UpdateRoleAccountDto } from './dtos/update-role-account.dto';
import AccountsUtils from './accounts.utils';
import { SendEmailDto } from 'mail/dto/send-mail.dto';
import { Utils } from '@etc/utils';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async paginateGetAll(query: PaginateQuery, account?: Account) {
    return [
      await paginate(query, this.accountRepository, {
        defaultLimit: 10,
        sortableColumns: ['fullName', 'createdAt'],
        defaultSortBy: [
          ['createdAt', 'DESC'],
          ['fullName', 'ASC'],
        ],
        searchableColumns: ['fullName', 'phone', 'email'],
        filterableColumns: {
          isActive: [FilterOperator.EQ],
        },
      }),
      null,
    ];
  }

  async getAll(enable: string | null) {
    if (!enable) {
      const accounts = await this.accountRepository.find();
      return [accounts, null];
    }
    const isEnabled = enable == 'true';
    const accounts = await this.accountRepository.find({
      where: {
        isEnabled,
      },
    });
    return [accounts, null];
  }

  async getByEmail(email: string, noCheckActive?: boolean) {
    return await this.accountRepository.findOne({
      where: {
        email: email,
        isEnabled: noCheckActive ? null : true,
      },
    });
  }

  async getById(id: string, checkLoggedIn?: boolean) {
    return await this.accountRepository.findOne({
      where: {
        id: id,
        isLoggedIn: checkLoggedIn ? true : null,
      },
    });
  }

  async createOne(info: CreateAccountDto) {
    const err = [];
    if (!info.fullName) {
      err.push({
        at: 'fname',
        message: 'First name is required',
      });
    }
    const checkEmail = await this.accountRepository.findOne({
      where: {
        email: info.email,
      },
    });
    if (checkEmail) {
      err.push({
        at: 'email',
        message: 'Email already exists',
      });
    }
    const checkPhone = await this.accountRepository.findOne({
      where: {
        phone: info.phone,
      },
    });
    if (checkPhone) {
      err.push({
        at: 'phone',
        message: 'Phone already exists',
      });
    }
    const checkStudentId = await this.accountRepository.findOne({
      where: {
        studentId: info.studentId,
      },
    });
    if (checkStudentId) {
      err.push({
        at: 'studentId',
        message: 'Student ID already exists',
      });
    }
    if (err.length > 0) {
      return [null, err];
    }
    const account = await this.accountRepository.save({
      studentId: info.studentId,
      fullName: info.fullName,
      email: info.email,
      dob: info.dob,
      phone: info.phone,
    });
    return [account, err];
  }

  async updateOne(id: string, info: UpdateAccountDto) {
    const account = await this.getById(id);
    if (!account) {
      return [null, 'Account not found'];
    }
    const err = [];
    if (info.phone) {
      const checkPhone = await this.accountRepository.findOne({
        where: {
          phone: info.phone,
          id: Not(id),
        },
      });
      if (checkPhone) {
        err.push({
          at: 'phone',
          message: 'Phone already exists',
        });
      }
    }
    if (err.length > 0) {
      return [null, err];
    }
    account.fullName = info.fullName ?? account.fullName;
    account.dob = info.dob ?? account.dob;
    account.phone = info.phone ?? account.phone;
    await this.accountRepository.save(account);
    return [account, err];
  }

  async toggleActive(id: string) {
    const account = await this.accountRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!account) {
      return [null, 'Account not found'];
    }
    account.isEnabled = !account.isEnabled;
    await this.accountRepository.save(account);
    return [account, null];
  }

  async updateLoggedIn(id: string, isLoggedIn: boolean) {
    const account = await this.accountRepository.findOne({
      where: {
        id: id,
      },
      select: ['isLoggedIn'],
    });
    if (!account) {
      return [null, 'User not found'];
    }
    //check if user is already connected
    if (isLoggedIn && account.isLoggedIn) {
      return [null, 'User already logged in'];
    }
    if (isLoggedIn != account.isLoggedIn) {
      account.isLoggedIn = !account.isLoggedIn;
      await this.accountRepository.update({ id: id }, account);
      return [account, null];
    }
  }

  async activateAllAccount() {
    try {
      await this.accountRepository
        .createQueryBuilder()
        .update(Account)
        .set({ isEnabled: true })
        .where('role = :role', { role: RoleEnum.USER })
        .andWhere('isActive = :active', { active: false })
        .andWhere('isLocked = :locked', { locked: false })
        .execute();
    } catch (exception) {
      return 'Update Users Failed';
    }

    return 'Active Users Successfully';
  }
  async activeAccount(id: string) {
    const activeAccount = await this.accountRepository.findOne({
      where: {
        id: id,
      },
      select: [
        'id',
        'fullName',
        'email',
        'password',
        'role',
        'isEnabled',
        'isLocked',
      ],
    });
    //Account User with Role User,
    //locked is false, not enable and password is null

    if (activeAccount.role !== RoleEnum.USER)
      throw new Error('Account must be user account to be actived');
    if (activeAccount.isLocked) throw new Error('Account has been locked');
    if (activeAccount.isEnabled) throw new Error('Account has been actived');
    if (activeAccount.password)
      throw new Error('Account password has been generated');
    // Account when active will generate a random password,
    const randomPwd = AccountsUtils.generateRandomPassword(12);
    // hash pass
    const hashPwd = await Utils.hashPassword(randomPwd);

    //and save in database with enable true
    activeAccount.password = hashPwd;
    activeAccount.isEnabled = true;
    await this.accountRepository.update({ id: id }, activeAccount);

    const sendEmailDto: SendEmailDto = {
      recipients: [
        { name: activeAccount.fullName, address: activeAccount.email },
      ],
      placeholderReplacement: {
        fullName: activeAccount.fullName,
        password: randomPwd,
      },
    };
    return sendEmailDto;
  }

  async updateUserRole(update: UpdateRoleAccountDto, accountRole: RoleEnum) {
    const currentUser = await this.accountRepository.findOne({
      where: {
        id: update.id,
      },
      select: ['id', 'fullName', 'role', 'isLocked'],
    });
    if (accountRole == RoleEnum.MANAGER && currentUser.role >= accountRole)
      return [null, "You Can't Update User With Higher Role Or Same Role"];
    if (!currentUser) return [null, 'Not Found Account With This Id'];
    if (currentUser.isLocked)
      return [null, "Can't Change Role With A Locked Account"];
    if (currentUser.role == update.role) return [currentUser, null];
    currentUser.role = update.role;
    await this.accountRepository.update({ id: update.id }, currentUser);
    return [currentUser, null];
  }

  async removeAccount(id: string, curAccount: Account) {
    if (curAccount.id === id) return [null, "You can't remove self account"];

    const removeAccount = await this.accountRepository.findOne({
      where: {
        id: id,
      },
      select: ['id', 'role', 'isEnabled'],
    });
    if (!removeAccount) return [null, "Can't find account to remove"];
    if (removeAccount.isEnabled) return [null, 'This account already active'];
    if (removeAccount.role === RoleEnum.ADMIN)
      return [null, "You can't remove admin account"];
    if (
      curAccount.role === RoleEnum.USER ||
      (curAccount.role === RoleEnum.MANAGER &&
        removeAccount.role !== RoleEnum.USER)
    ) {
      return [null, 'Account role must be higher to remove this account'];
    }

    await this.accountRepository.remove(removeAccount);
    return ['Remove account successful!', null];
  }
}
