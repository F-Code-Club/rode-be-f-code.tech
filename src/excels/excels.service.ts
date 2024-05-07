import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { TeamExcel } from './utils/excels.type';
import { Readable } from 'stream';
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
}
