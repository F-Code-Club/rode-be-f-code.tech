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

  static readonly CHROMIUM_PATH = process.env.CHROMIUM_PATH;
  static readonly GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID || 'google_client_id';
  static readonly GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
  static readonly GOOGLE_REDIRECT_URL = process.env.REDIRECT_URL;
  static readonly GOOGLE_REFRESH_TOKEN =
    process.env.REFRESH_TOKEN || '123456789';
  static readonly FOLDER_ID = process.env.FOLDER_ID;
  static readonly FOLDER_TEMPLATE_ID =
    process.env.FOLDER_TEMPLATE_ID || '197WvTcthn5whJ_a_zjq2Os53nVj7RZiE';
  static readonly FOLDER_TEAMS_EXCEL = process.env.FOLDER_TEAMS_EXCEL;
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
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC1PxPPQ6zl39wE\nCsR8IYjjsDzPdHahKciFOUxRNPgPYNVR9ZKSzp7X/HQ9JfIwRzQSrj7zSpBCOFQJ\nqVb9RodRXQRFrGRBYK48gbC5rc5fidenM1Z6sVWDFfWExqQxNnK4C5QBGOI/ET2c\n0h8qJh0hYADQKZ53EKkbZ5TFUBA58kVwtwyjSa2Zq1Kti11Tc5+s5s+aiP0b46gM\ngsHrXo/c7WOclzSXqs7qtvLbaUjnFazrpXJYqLqzVpb+bizefaCI+gMzQs4mdqxg\nuV6usbh851gXnAZszrV4xva7Qwbn3CZCQ3nz+TfwmdD7UgoOcylXljx7+PhGd35o\nzb/Xzn3pAgMBAAECggEAGEH0TB3fUCI2ojExZvkIseCZOEglcHXVKUTSmrPKLNS6\n+EMzy4OX7Ym+TPN9MfT1r+JeToBA79FLfheKAE/7ixTgniqafcg2HvxZ7h/9qk/F\nQH2LKin91ejkeVF/ZuQbVS1HhnYRdyYUPEmVyOBdBGXYS1lRT4I3/+ZMb7QYLTOu\nv4Gv3Os6eHHtsUOpcj89vtssE4DNsKo3bOgu1b+zNPspL2S1m2gNYbpYZzoETbhI\nW+SqL2ZxjglPE740eazPctTXiLw/g1V6KuoZzWFIBcWnPPYtpBZp7guTzYXZPajU\nP9dLPNEikT+V64GF5zmak2EMWLgK2RgJiLUi6Yw4uQKBgQDZS7HCUEWp2x/B4iTe\nFdj79EMqFdjw2tcOKzGguPJ061qCjAaDKNuwMOB+7mKjCiq1HB9QiFwIn3/fOhKa\nGebT94/KpiMNScUdE0lcE5R5cWYAJwifAhs70xpF6Y06MB4XPUHXLUQu2/ATpDeG\nDTcQV2zBTCPFuCiAqN/YECNbKwKBgQDVh5klPYq3Tle1NAqPVaIcgmx/KuzCQQNW\nNrUC+1Kvf/id3MXcN1Oj6u++V9qXPR4AlKyxt9fEpS3fpK7ENmV2IS02JqEUNcKA\nj9ZpoM2WAgUATjO2+FRPFKJ16MH/IGa8oxxHxWSFAz6I2fhnnT0Oj/FzvdIsvnCJ\naX/xlf/xOwKBgQDGgY3sc6SQXSuP1WXUtKS61xQceETtEx5vRSpbJ1nnUbInnH++\nhi7bsGsFygS16O3G8d/xlABvqDYK2WRw/sSOU5Q6jrdqxj+aJipYQVLb9qo17XLE\nwAndBybzQz7PL3HtzPo+9o1ZOXcCmnxWq+/nr9YcZ9AuKeRmVN/Y5DVIbQKBgQCj\nNR2NJVjdevf2/GwF2oIqIFYlbP3CDEcsomwAd3BfzASPRKvHAlLfuza72hKt/nzs\nHLdSrx4wo8BIbGtYdetfO0R/W09LTzv3X/mWit4YhjqkXSGR/IUUXMVAMkP1aSKd\nlF6NTQbj0/L8Tv5a1AhTFRqMSM5YfMcvgH/We7xA+QKBgGUQOqAHuP+FNPyF0YR1\n2TTvvsfX4fpvfHlS94jX/E5Gde3rIi7qSIsFpDpaDgVxFlN132fbGi+24Jjb16Zr\ng3NxgAM4PFwROuhGwW+j9FEnbrISJ84LtXEc7NXhCtyScmmst07mtcwsD8JFpoM3\nWNXFfSzU8buiw2+0S8S/maV6\n-----END PRIVATE KEY-----\n';
  static readonly SERVICE_PRIVATE_KEY_ID =
    process.env.SERVICE_PRIVATE_KEY_ID ||
    '55307c87eabb06deb92ee528ff4a910c46f85bfc';
  static readonly SERVICE_ACCOUNT_EMAIL =
    process.env.SERVICE_ACCOUNT_EMAIL ||
    'test-856@be-rode.iam.gserviceaccount.com';
}
