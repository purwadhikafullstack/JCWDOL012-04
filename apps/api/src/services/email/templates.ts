import { transporter } from "./config"

const isProduction = process.env.NODE_ENV === 'production'
const CLIENT_URL = isProduction ? process.env.WEB_CLIENT_BASE_URL_PROD : process.env.WEB_CLIENT_BASE_URL_DEV

export const sendVerificationEmail = async (email: string, token: string) => transporter.sendMail(
    {
        from: 'suryaadiwiguna.dev@gmail.com',
        to: email,
        subject: 'Verify your email',
        text: `Thanks for signing up! Please click the link below within 1 hour to verify your email.
        \n\n ${CLIENT_URL}/auth/verify?token=${token}`,
    },
    (err, info) => {
        if (err) {
            console.log(err)
            return err
        } else {
            console.log(info)
            return info
        }
    })

export const sendChangeEmailInstructions = async (email: string, token: string) => transporter.sendMail(
    {
        from: 'Palugada Store - Account Services',
        to: email,
        subject: 'Change your email',
        text: `You requested to change the email of your Palugada Store account. Please click the link below within 1 hour to verify your new email.
        \n${CLIENT_URL}/auth/verify/change-email?token=${token}`,
    },
    (err, info) => {
        if (err) {
            console.log(err)
            return err
        } else {
            console.log(info)
            return info
        }
    })

export const sendResetPasswordInstructions = async (email: string, token: string) => transporter.sendMail(
    {
        from: 'Palugada Store - Account Services',
        to: email,
        subject: 'Reset your password',
        text: `You requested to reset the password of your Palugada Store account. Please click the link below within 1 hour to reset your password.
        \n${CLIENT_URL}/auth/verify/reset-password?token=${token}`,
    },
    (err, info) => {
        if (err) {
            console.log(err)
            return err
        } else {
            console.log(info)
            return info
        }
    }
)

