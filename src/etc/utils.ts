import * as bcrypt from 'bcrypt'; 
import RodeConfig from './config';
export class Utils {
    static async hashPassword(password: string){
        return await bcrypt.hash(password, RodeConfig.SALT_ROUND);
    }

    static async comparePassword(password:string, hashPassword:string){
        return await bcrypt.compare(password, hashPassword);
    }
}