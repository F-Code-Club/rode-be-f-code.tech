import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import fs from 'fs';
import { ProgrammingLangEnum } from '@etc/enums';
const CLIENT_ID =
  '821968596288-2mdr67o5l7eq8hgvf7bekjhdmr03kckk.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URL = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
  '1//04dmZCctpi3ftCgYIARAAGAQSNwF-L9IrnI2w6kZPgauctsUgcbF3MozLd-DjFY_DuLJ5Rq-joqy7Aq8X1AH3Hyv524Teqw7xpiU';
const folderId = '1cmBA7OuNYExMQglguoGZvm6Oitp6Q1a-';
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth: oauth2Client });
@Injectable()
export class GoogleApiService {
  async uploadFile(filePath: string, language: ProgrammingLangEnum) {
    let name = crypto.randomUUID() + '.';
    if (language == ProgrammingLangEnum.C_CPP) {
      name += 'cpp';
    } else if (language == ProgrammingLangEnum.JAVA) {
      name += 'java';
    }
    try {
      const response = await drive.files.create({
        requestBody: {
          name,
          // mimeType: file.mimetype,
          parents: [folderId],
        },
        media: {
          // mimeType: file.mimetype,
          body: fs.createReadStream(filePath),
        },
      });
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
        q: `'${folderId}' in parents and name ='${fileName}'`,
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
