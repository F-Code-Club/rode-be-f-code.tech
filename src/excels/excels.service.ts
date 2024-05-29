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

  isVietnamesePhoneNumber(number) {
    return /(0[3|5|7|8|9])+([0-9]{8})\b/g.test(number);
  }
  // yyyy/mm/dd format
  isValidDate(date: string): boolean {
    return /^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/.test(date);
  }


  async readImportTeamSheets(records): Promise<[TeamExcel[], string[]]> {
    const data: TeamExcel[] = [];
    const errorList: string[] = [];

    for (let row = 0; row < records.length; row++) {
      if (String(records[row][0]).trim().length == 0) {
        errorList.push(`Record ${row + 2}: Missing school name.`);
        continue;
      }
      if (String(records[row][1]).trim().length == 0) {
        errorList.push(`Record ${row + 2}: Missing group name.`);
        continue;
      }

      const teamTemp: TeamExcel = {
        schoolName: records[row][0],
        groupName: records[row][1],
        member: [],
      };
      // Check if there is validation error
      // If it does, don't push member and team
      // Purpose: to check all validation error that can happen
      let validateError: boolean = false;
      for (let col = 2; col < records[row].length; col += 5) {
        // Extract and validate student name
        const studentName = String(records[row][col]).trim();
        if (studentName.length == 0) {
          errorList.push(`Record ${row + 2}-${col + 1}: Missing student name.`);
        }
      
        // Extract and validate student ID
        const studentId = String(records[row][col + 1]).trim();
        if (studentId.length == 0) {
          errorList.push(`Record ${row + 2}-${col + 2}: Missing student ID.`);
        }
      
        // Extract and validate email
        const email = String(records[row][col + 2]).trim();
        if (email.length == 0) {
          errorList.push(`Record ${row + 2}-${col + 3}: Missing email.`);
        }
      
        // Extract and validate phone number
        const phone = String(records[row][col + 3]).trim()
        if(!this.isVietnamesePhoneNumber(phone)){
          errorList.push(`Record ${row + 2}-${col + 4}: Wrong phone format.`);
        }
      
        // Extract and validate date of birth
        let dob: Date = null;
        const dobString = String(records[row][col + 4]).trim();
        if(!this.isValidDate(dobString)){
          errorList.push(`Record ${row + 2}-${col + 5}: Wrong date of birth format.`);
        }
        else dob = new Date(dobString)
          
        // Add valid student to team members, handle errors if any field is invalid
        if (studentName && studentId && email && phone && dob && !validateError) {
          teamTemp.member.push({ studentName, studentId, email, phone, dob });
        }
        // Check if the record is empty, indicating fewer than 4 members
        else if (!studentName && !studentId && !email && !phone && !dobString) {
          errorList.splice(-5,5)
          continue;
        }
        else {
          validateError = true;
        }
      }
      
      if(validateError) errorList.push('TEAM['+teamTemp.groupName+'] has validation errors.');
      else if (teamTemp.member.length < 2 || teamTemp.member.length > 4) {
        errorList.push('TEAM['+teamTemp.groupName+'] must have from 2 to 4 members.');
      }
      else data.push(teamTemp);
    }
    return [data, errorList];
  }
}
