import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const JWT_SECRET = process.env.JWT_SECRET ?? 'cannotReadJWTSecretFromEnvFile';
console.log(JWT_SECRET);

function simulateLogin() {
    dotenv.config({ path: '.env.development' });

    const token = jwt.sign({
        id: 1,
        firstName: "customer1",
        lastName: "lastName1",
        email: "email1@bata.com",
        isverified: true,
        role: "CUSTOMER"
    }, JWT_SECRET);
    return token;
}

interface CustomRequest extends Request {
    user: any;
}

export async function simulateAuthencticateToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token = simulateLogin();
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}