export type TeamExcel = {
  groupName: string;
  schoolName: string;
  member?: MemberExcel[];
};
export type MemberExcel = {
  studentName: string;
  studentId: string;
  email: string;
  phone: string;
};
