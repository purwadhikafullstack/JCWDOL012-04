import { Response } from 'express';
import AccountCheckService from '@/services/account.check.service';

export default async function accCheck(user:any, res:Response): Promise<boolean>{
    const accountCheckService = new AccountCheckService();

    const userTemp = await accountCheckService.getById(user.id);
    if (userTemp===null) {
        res.status(401).json({ message: 'Unauthorized' });
        return false;
    }else if (user.role !== 'CUSTOMER' || !user.isVerified) {
        res.status(403).json({ message: 'Forbidden' });
        return false;
    }
    return true;
}