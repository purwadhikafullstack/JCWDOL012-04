import {prisma} from './prisma.service'

export default class AccountCheckService {
    prisma;
    constructor() {
        this.prisma = prisma;
    }

    async getById(id: number): Promise<any> {
        return await this.prisma.users.findUnique({
            where: {
                id: id,
                archived: false
            }
        });
    }
}