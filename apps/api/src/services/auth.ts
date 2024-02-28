import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import { Request } from "express";

const prisma = new PrismaClient();

export async function createNewUser(reqBody: Request['body']) {
    const { email, password, firstName, lastName, gender, phoneNumber } = reqBody;
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return await prisma.users.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            gender,
            phoneNumber
        }
    });
}