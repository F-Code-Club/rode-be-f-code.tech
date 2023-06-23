import { config } from 'dotenv';

config();

export default class RodeConfig {
  static readonly PORT = parseInt(process.env.PORT || '3000');
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = parseInt(process.env.DB_PORT || '3306');
  static readonly DB_USERNAME = process.env.DB_USERNAME || 'root';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'longmetmoivcl';
  static readonly DB_DATABASE = process.env.DB_DATABASE || 'rode';
  static readonly ADMIN_EMAIL =
    process.env.ADMIN_EMAIL || 'shopp.ts.app@gmail.com';
  static readonly GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID || 'google_client_id';
  static readonly JWT_SECRET = process.env.JWT_SECRET || '12345';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
  static readonly CHROMIUM_PATH = process.env.CHROMIUM_PATH;
  static readonly CLIENT_ID = process.env.CLIENT_ID;
  static readonly CLIENT_SECRET = process.env.CLIENT_SECRET;
  static readonly REDIRECT_URL = process.env.REDIRECT_URL;
  static readonly REFRESH_TOKEN = process.env.REFRESH_TOKEN;
  static readonly FOLDER_ID = process.env.FOLDER_ID;
}
