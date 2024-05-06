import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@accounts/entities/account.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from '../etc/enums';
import RodeConfig from '../etc/config';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';
import { Utils } from '@etc/utils';

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
        fullName: 'Super Admin',
        email: RodeConfig.ADMIN_EMAIL,
        dob: new Date(),
        phone: '0123456789',
        studentId: 'SE000000',
        role: RoleEnum.ADMIN,
        isEnabled: true,
        isLocked: false,
        password: await Utils.hashPassword(RodeConfig.ADMIN_DEFAULT_PASSWORD),
      });
    }
  }
}
