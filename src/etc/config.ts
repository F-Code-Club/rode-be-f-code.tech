export default class RodeConfig {
  static readonly PORT = parseInt(process.env.PORT || '3000');
  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = parseInt(process.env.DB_PORT || '5432');
  static readonly DB_USERNAME = process.env.DB_USERNAME || 'root';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'Vinh12345.';
  static readonly DB_DATABASE = process.env.DB_DATABASE || 'rode-be-test';
  static readonly ADMIN_EMAIL =
    process.env.ADMIN_EMAIL || 'shopp.ts.app@gmail.com';
  static readonly ADMIN_DEFAULT_PASSWORD =
    process.env.ADMIN_DEFAULT_PASSWORD || 'vinhquametmoi12345*.*';
  static readonly JWT_SECRET = process.env.JWT_SECRET || '12345';
  static readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || '123456789';
  static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
  static readonly JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || '10d';

  static readonly FOLDER_TEMPLATE_ID = process.env.FOLDER_TEMPLATE_ID || '';
  static readonly SALT_ROUND = parseInt(process.env.SALT_ROUND) || 3;

  static readonly MAIL_HOST = process.env.MAIL_HOST || 'smtp.gmail.com';
  static readonly MAIL_PORT = parseInt(process.env.MAIL_PORT || '587');
  static readonly MAIL_USER = process.env.MAIL_USER || 'example@gmail.com';
  static readonly MAIL_APP_PASSWORD =
    process.env.MAIL_APP_PASSWORD || 'abcd abcd abcd abcd';
  static readonly MAIL_SENDER = process.env.MAIL_SENDER || 'F-Code';
  static readonly MAIL_SENDER_EMAIL =
    process.env.MAIL_SENDER_EMAIL || 'f-code.tech@gmail.com ';

  static readonly SERVICE_PRIVATE_KEY =
    process.env.SERVICE_PRIVATE_KEY ||
    '-----BEGIN PRIVATE KEY-----\nyour private key\n-----END PRIVATE KEY-----\n';
  static readonly SERVICE_PRIVATE_KEY_ID =
    process.env.SERVICE_PRIVATE_KEY_ID || '';
  static readonly SERVICE_ACCOUNT_EMAIL =
    process.env.SERVICE_ACCOUNT_EMAIL || '';

  static readonly ORIGIN_DOMAIN = process.env.ORIGIN_DOMAIN || '';

  static readonly ORIGIN_DOMAIN_LOCAL =
    process.env.ORIGIN_DOMAIN_LOCAL || 'http://localhost:3000';

  static readonly TEMPLATE_LOCAL_PATH =
    process.env.TEMPLATE_LOCAL_PATH || 'localpath';
}
