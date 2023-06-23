import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { ProgrammingLangEnum } from '@etc/enums';
import RodeConfig from '../etc/config';

const oauth2Client = new google.auth.OAuth2(
  RodeConfig.CLIENT_ID,
  RodeConfig.CLIENT_SECRET,
  RodeConfig.REDIRECT_URL,
);
oauth2Client.setCredentials({ refresh_token: RodeConfig.REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
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
}
