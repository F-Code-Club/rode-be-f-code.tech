import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { Not, Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async paginateGetAll(query: PaginateQuery) {
    return [
      await paginate(query, this.accountRepository, {
        defaultLimit: 10,
        sortableColumns: ['studentId', 'fname', 'createdAt'],
        searchableColumns: ['fname', 'lname', 'phone', 'studentId', 'email'],
        filterableColumns: {
          isActive: [FilterOperator.EQ],
        },
      }),
      null,
    ];
  }

  async getAll(active: string | null) {
    if (!active) {
      const accounts = await this.accountRepository.find();
      return [accounts, null];
    }
    const isActive = active == 'true' ? true : false;
    const accounts = await this.accountRepository.find({
      where: {
        isActive,
      },
    });
    return [accounts, null];
  }

  async getByEmail(email: string, noCheckActive?: boolean) {
    return await this.accountRepository.findOne({
      where: {
        email: email,
        isActive: noCheckActive ? null : true,
      },
    });
  }

  async getById(id: string) {
    return await this.accountRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async createOne(info: CreateAccountDto) {
    const err = [];
    if (!info.fname) {
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
      fname: info.fname,
      lname: info.lname,
      email: info.email,
      dob: info.dob,
      phone: info.phone,
      studentId: info.studentId,
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
    if (info.studentId) {
      const checkStudentId = await this.accountRepository.findOne({
        where: {
          studentId: info.studentId,
          id: Not(id),
        },
      });
      if (checkStudentId) {
        err.push({
          at: 'studentId',
          message: 'Student ID already exists',
        });
      }
    }
    if (err.length > 0) {
      return [null, err];
    }
    account.fname = info.fname ?? account.fname;
    account.lname = info.lname ?? account.lname;
    account.dob = info.dob ?? account.dob;
    account.phone = info.phone ?? account.phone;
    account.studentId = info.studentId ?? account.studentId;
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
    account.isActive = !account.isActive;
    await this.accountRepository.save(account);
    return [account, null];
  }
}
