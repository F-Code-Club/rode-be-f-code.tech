import { RoleEnum } from "@etc/enums";

export class AuthTokenReturn {
    timeStamp: Date;
    accessToken: string;
    refreshToken: string;
    role: RoleEnum;

    constructor(
        accessToken: string, 
        refreshToken: string,
        role: RoleEnum
    ){
            this.timeStamp = new Date();
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.role = role;
    }
    
}