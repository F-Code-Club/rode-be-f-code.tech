export type ImportTeamDto = {
  groupName: string;
  schoolName: string;
  member: ImportMemberDto[];
};
export type ImportMemberDto = {
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
  dob: Date;
};
