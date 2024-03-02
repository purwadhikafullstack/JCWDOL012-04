type DecryptedUserToken = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
};

declare namespace Express {
    export interface Request {
        user?: DecryptedUserToken | null
    }
}