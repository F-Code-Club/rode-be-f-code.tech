import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import RodeConfig from '../etc/config';
import { Readable } from 'stream';

const serviceAuth = new google.auth.JWT({
  email: RodeConfig.SERVICE_ACCOUNT_EMAIL,
  key: RodeConfig.SERVICE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
  keyId: RodeConfig.SERVICE_PRIVATE_KEY_ID,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

const drive = google.drive({ version: 'v3', auth: serviceAuth });
const sheets = google.sheets({ version: 'v4', auth: serviceAuth });
@Injectable()
export class GoogleApiService {
  async uploadFileBuffer(fileName: string, fileBuffer: Buffer) {
    try {
      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          // mimeType: file.mimetype,
          parents: [RodeConfig.FOLDER_TEMPLATE_ID],
        },
        media: {
          // mimeType: file.mimetype,
          body: Readable.from(fileBuffer),
        },
      });
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      return response.data.id;
    } catch (error) {
      throw new Error(error.message);
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

  async deleteFileById(fileId: string) {
    try {
      await drive.files.delete({
        fileId,
      });
    } catch (error) {
      throw new Error('Error when delete file!');
    }
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
      return [null, 'Error when getting data on sheets: ' + err.message];
    }
    const rows = metadata.data.values;
    if (rows.length == 0) return [null, 'No data found!'];
    return [rows, null];
  }
}
