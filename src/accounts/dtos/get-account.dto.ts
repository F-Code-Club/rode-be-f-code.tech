import { RoleEnum } from "@etc/enums";
import { IsNotEmpty } from "class-validator";

export class CreateAccountDto {
    fullName: string;
    email: string;
    studentId: string;
    phone: string;
    dob: Date;
    isLogin: boolean;
    role:RoleEnum;
}