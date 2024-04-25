import RodeConfig from '../etc/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

const RodeDataSource = new DataSource({
  type: 'mysql',
  host: RodeConfig.DB_HOST,
  port: RodeConfig.DB_PORT,
  username: RodeConfig.DB_USERNAME,
  password: RodeConfig.DB_PASSWORD,
  database: RodeConfig.DB_DATABASE,
  entities: [path.resolve(__dirname + '/../**/*.entity{.js,.ts}')],
  migrations: [path.resolve(__dirname + '/../migrations', '*{.js,.ts}')],
  synchronize: true,
  logger: 'advanced-console',
  logging: 'all',
});

console.log(RodeDataSource.options);

export default RodeDataSource;
