import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { ProgrammingLangEnum } from '@etc/enums';
import RodeConfig from '../etc/config';
import { Readable } from 'stream';

const oauth2Client = new google.auth.OAuth2(
  RodeConfig.GOOGLE_CLIENT_ID,
  RodeConfig.GOOGLE_CLIENT_SECRET,
  RodeConfig.GOOGLE_REDIRECT_URL,
);

const serviceAuth = new google.auth.JWT({
  email: RodeConfig.SERVICE_ACCOUNT_EMAIL,
  key: RodeConfig.SERVICE_PRIVATE_KEY,
  keyId: RodeConfig.SERVICE_PRIVATE_KEY_ID,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

oauth2Client.setCredentials({ refresh_token: RodeConfig.GOOGLE_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
const sheets = google.sheets({ version: 'v4', auth: serviceAuth });
@Injectable()
export class GoogleApiService {
  async uploadFile(filePath: string, language: ProgrammingLangEnum) {
    let name = '';
    if (language == ProgrammingLangEnum.C_CPP) {
      name = randomUUID() + '.cpp';
    } else if (language == ProgrammingLangEnum.JAVA) {
      name += 'Main.java';
    } else if (language == ProgrammingLangEnum.PYTHON) {
      name += randomUUID() + '.py';
    }
    try {
      const response = await drive.files.create({
        requestBody: {
          name,
          // mimeType: file.mimetype,
          parents: [RodeConfig.FOLDER_ID],
        },
        media: {
          // mimeType: file.mimetype,
          body: fs.createReadStream(filePath),
        },
      });
      fs.unlinkSync(filePath);
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async getFileById(fileId: string) {
    try {
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType',
      });
      return result.data;
    } catch (error) {
      return null;
    }
  }

  async getFileByName(fileName: string) {
    try {
      const result = await drive.files.list({
        q: `'${RodeConfig.FOLDER_ID}' in parents and name ='${fileName}'`,
        fields: 'files(id, name, mimeType)',
      });
      return result.data.files[0];
    } catch (error) {
      return null;
    }
  }

  async deleteFileById(fileId: string) {
    try {
      await drive.files.delete({
        fileId,
      });
    } catch (error) {}
  }

  async deleteMultipleFiles(fileIds: string[]) {
    try {
      await drive.files.delete({ fileId: fileIds.join(',') });
    } catch (error) {}
  }

  async downloadTeamsRegisterSheetTemplate(
    fileId: string,
  ): Promise<[Readable, any]> {
    try {
      const response = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' },
      );
      return [response.data, null];
    } catch (error) {
      return [null, 'Error When Pull File From Google Drive'];
    }
  }

  async getTeamsRegisterFromSheet(fileId: string) {
    let metadata;
    try {
      metadata = await sheets.spreadsheets.values.get({
        auth: serviceAuth,
        spreadsheetId: fileId,
        range: 'Sheet1!A2:V',
      });
    } catch (err) {
      return [null,'Error when getting data on sheets: '+ err.message];
    }
    const rows = metadata.data.values;
    if (rows.length == 0) return [null, 'No data found!'];
    return [rows, null];
  }
}
