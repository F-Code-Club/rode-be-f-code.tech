import { RoleEnum } from "@etc/enums";

export class AuthTokenReturn {
    timeStamp: Date;
    accessToken: string;
    refreshToken?: string;
    role: RoleEnum;

    constructor(
        accessToken: string, 
        role: RoleEnum
    ){
            this.timeStamp = new Date();
            this.accessToken = accessToken;
            this.role = role;
    }

    setRefreshToken(refreshToken: string) : AuthTokenReturn{
        this.refreshToken = refreshToken;
        return this;
    }
    
}