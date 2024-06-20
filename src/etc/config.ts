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

  static readonly FOLDER_TEMPLATE_ID =
    process.env.FOLDER_TEMPLATE_ID || '197WvTcthn5whJ_a_zjq2Os53nVj7RZiE';
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
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCGrf0++22WZ+DT\nWFmq90rhaJOa0Atklus4d5EcJZmtIwqBa2wQvWDpQROX3nJN2JuOfqIC7+BSMSmD\n+pjdJCkHbhQR8jwLiqEOl9rLe9BObErjL+pGE+f4Yw5excSacy9NjbcnDTwoABoY\nHpJrm85ggJDaIoHgqrQHDVnPBxFyJeTI/yfxFzhUVGZcWKgcEYzMdWSO1l8B2/Zj\nHANIAybPBs5A5LQabf5Q78ugXp2enCs+qobZcgsbTSj9+CzNaWkxgDvwlEElteXG\nEEM5ztNkPPx+M1jGhHQi9K0636yRlh4ex7uaqDcqt+VCwzC/KnSj0+GIM9sE1LeK\ncu+V3yDfAgMBAAECggEADB4OaYLEruIkw88wriW2yoYWtbifNcswWbHEUBR/+ahr\n8w3/uJfZZtMwmJrujNt+z3jMSdhcRfjfY90BsO/mcyEv1BeH2H/+EqqOCH3Y1Z1/\ntWYjvW9gESSUb+l6UW0opeEox+40aeLsdhwWD3GCxYL7xWySY+zn6rSETpCzvKHT\nwxipp6IA8mwryBvgzo31UzmDicZTQYXjCNoc3tC6DBbrOVFRMWOMTF3zrxVPtU9P\nkKfuO0q+MQnJ9EWG+3XyIBVLeujKu609P18wJa2XawrE2zX0Tp68TZ7g/zGxpAEN\nMN2uNdiaHYbqJDfnLesXNNudeoVhn8DpfKEpBMCvpQKBgQC9MxOnwaSkd8t8atii\nZm9j3ZIyT7nqxcaqE1mpyUHyNR0OV8w+bGhW/I2H8z2+ZR8mNH1wFBxta5h5uCCk\nWt7TYdJLVUrxOw9qJ5Z/s6viQerOGpIVqaa/Lw3on4+Cl7rcTICrF98NiQWx52gX\nNx2GR29BsQyNGvBIXJeSmawFUwKBgQC2OxkIY4+kDwWjUNVyNT32Qlxms6T+pnH3\nVj5QKfW4+7rY4sxqtVlOrb50hG0vFQ/VvWrlWq9mbYUDwcXD1yj7tNSTtcefppNt\nPmDG+zfMh2f1YqlLE4ejhxKGmyckttCA17tZjnN2QSkFkcDveDEtfUnB2cO5cryX\nDfY1ltvYxQKBgHcu6b7PmSuR2zlxBS6oYJsERMg0uOVP2SniLqVqBoTROJCEdkEM\ngV3qki2F6Os7QDgM8Mfdo1q6YL6sYsOmCqAWCycxf5geoEM61O90+134MDXNPyEu\nUcA1oAleGkUl16xW9ObSjswz+MZtA4E8Uvj3nvo+0a1BvwOWcFUFQPvJAoGANh5Q\n7dvbgcZwTzMnYJaNQ0Ar/tglDPdTazfyo44CiqA/uj+Io7wdvK7+m83kOxJPNJPf\nViPbaVjnItl+KQ4R/saSRxe6JCCtMclPpmhfBt/DsO1PB5vSMW9gwhb7xfyA6XKo\nEg2rHph1XVEO8k9Ik5DcwbQxWzbG6TldQEcAHV0CgYBXzD6P8qRgG2oka/ql0w07\nUHPVKpHYWqmz9nwu+PH9haVq7k7Tn9OVW37upratnsQ3CUccg86Dgh3EahmpnQP2\nZQYrV0CWibv4bV+BPriLMiZeBfRSLYjyUaGzFSgRbGJg5i9wxcsnKYtghjKfzvEF\nYw3eilUn06GMC6l4jIsUaQ==\n-----END PRIVATE KEY-----\n';
  static readonly SERVICE_PRIVATE_KEY_ID =
    process.env.SERVICE_PRIVATE_KEY_ID || '';
  static readonly SERVICE_ACCOUNT_EMAIL =
    process.env.SERVICE_ACCOUNT_EMAIL ||
    'rode-389917@rode-389917.iam.gserviceaccount.com';

  static readonly ORIGIN_DOMAIN = process.env.ORIGIN_DOMAIN || '';

  static readonly ORIGIN_DOMAIN_LOCAL =
    process.env.ORIGIN_DOMAIN_LOCAL || 'http://localhost:3000';

  static readonly TEMPLATE_LOCAL_PATH =
    process.env.TEMPLATE_LOCAL_PATH || 'localpath';
}
