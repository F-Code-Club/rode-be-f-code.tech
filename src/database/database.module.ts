import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RodeDataSource from './datasource';
import { DatabaseService } from './database.service';
import { Account } from '@accounts/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(RodeDataSource.options),
    TypeOrmModule.forFeature([Account]),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {
  constructor(private readonly databaseService: DatabaseService) {}

  onModuleInit() {
    this.databaseService.loadAdmin();
  }
}
