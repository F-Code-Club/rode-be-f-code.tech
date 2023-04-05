import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@accounts/entities/account.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from '../etc/enums';
import RodeConfig from '../etc/config';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';

@Injectable()
export class DatabaseService implements BeforeApplicationShutdown {
  constructor(
    @Log('DatabaseService') private readonly logger: LogService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async beforeApplicationShutdown(signal?: string) {
    this.logger.log('beforeApplicationShutdown: ' + signal);
    this.logger.log('Reset isLoggedIn to false for all accounts');
    await this.accountRepository.update({}, { isLoggedIn: false });
  }

  async loadAdmin() {
    const admin = await this.accountRepository.findOne({
      where: {
        email: RodeConfig.ADMIN_EMAIL,
      },
    });
    if (!admin) {
      await this.accountRepository.delete({
        role: RoleEnum.ADMIN,
      });
      await this.accountRepository.save({
        fname: 'Admin',
        lname: '',
        sname: '',
        email: RodeConfig.ADMIN_EMAIL,
        dob: new Date(),
        phone: '',
        studentId: '',
        role: RoleEnum.ADMIN,
      });
    }
  }
}
