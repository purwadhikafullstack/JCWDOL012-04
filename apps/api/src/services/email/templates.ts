import { transporter } from "./config"

const isProduction = process.env.NODE_ENV === 'production'
const CLIENT_URL = isProduction ? process.env.WEB_CLIENT_BASE_URL_PROD : process.env.WEB_CLIENT_BASE_URL_DEV

export const sendVerificationEmail = async (email: string, token: string) => transporter.sendMail(
    {
        from: 'suryaadiwiguna.dev@gmail.com',
        to: 'suryaadiwiguna@gmail.com',
        subject: 'Verify your email',
        text: `Thanks for signing up! 
        Please click the link below to verify your email.
        
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
