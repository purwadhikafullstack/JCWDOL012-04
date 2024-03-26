import nodemailer from 'nodemailer';

const AUTH_EMAIL = process.env.AUTH_EMAIL;
const AUTH_EMAIL_PASSWORD = process.env.AUTH_EMAIL_PASSWORD;
if (!AUTH_EMAIL) throw new Error('AUTH_EMAIL is not defined')
if (!AUTH_EMAIL_PASSWORD) throw new Error('AUTH_EMAIL_PASSWORD is not defined')

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: AUTH_EMAIL,
        pass: AUTH_EMAIL_PASSWORD,
    },
})