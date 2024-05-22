import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { TeamExcel } from './utils/excels.type';
import { Readable } from 'stream';
import { ImportTeamDto } from '@teams/dtos/import-team.dto';
@Injectable()
export class ExcelService {
  async readImportTeamExcel(stream: Readable) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(stream);

    const data: TeamExcel[] = [];
    const sheet = workbook.getWorksheet(1);
    sheet.eachRow((row, rowIndex) => {
      if (rowIndex == 1) return;
      const teamTemp: TeamExcel = {
        groupName: row.getCell(2).value.toString(),
        schoolName: row.getCell(1).value.toString(),
        member: [],
      };
      for (let i = 3; i <= 15; i += 4) {
        const studentName = row.getCell(i).value.toString();
        const studentId = row.getCell(i + 1).value.toString();
        const email = row.getCell(i + 2).value.toString();
        const phone = row.getCell(i + 3).value.toString();

        if (studentId || email || phone || studentName) {
          teamTemp.member.push({ studentName, studentId, email, phone });
        } else break;
      }
      if (teamTemp.member) data.push(teamTemp);
    });
    return data;
  }

  async readImportTeamSheets(records): Promise<[ImportTeamDto[], string[]]> {
    const data: ImportTeamDto[] = [];
    const errorList: string[] = [];

    for (let row = 0; row < records.length; row++) {
      if (String(records[row][0]).trim().length == 0) {
        errorList.push('Record ' + row + ': Missing group name.');
        continue;
      }
      if (String(records[row][1]).trim().length == 0) {
        errorList.push('Record ' + row + ': Missing school name.');
        continue;
      }

      const teamTemp: ImportTeamDto = {
        groupName: records[row][0],
        schoolName: records[row][1],
        member: [],
      };

      for (let col = 2; col < records[row].length; col += 5) {
        const studentName =
          String(records[row][col]).trim().length != 0
            ? records[row][col]
            : errorList.push(
                'Record ' + row + '-' + col + ': Missing student name.',
              );
        const studentId =
          String(records[row][col + 1]).trim().length != 0
            ? records[row][col + 1]
            : errorList.push(
                'Record ' + row + '-' + (col + 1) + ': Missing student id.',
              );
        const email =
          String(records[row][col + 2]).trim().length != 0
            ? records[row][col + 2]
            : errorList.push(
                'Record ' + row + '-' + (col + 2) + ': Missing email.',
              );
        const phone =
          String(records[row][col + 3]).trim().length != 0
            ? records[row][col + 3]
            : errorList.push(
                'Record ' + row + '-' + (col + 3) + ': Missing phone.',
              );
        const dob =
          String(records[row][col + 4]).trim().length != 0
            ? records[row][col + 4]
            : errorList.push(
                'Record ' + row + '-' + (col + 4) + ': Missing date of birth.',
              );

        if (studentId || email || phone || studentName || dob) {
          teamTemp.member.push({ studentName, studentId, email, phone, dob });
        }
      }
      if (teamTemp.member) data.push(teamTemp);
    }
    return [data, errorList];
  }
}
