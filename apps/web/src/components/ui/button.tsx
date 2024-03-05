import { googleLogin } from '@/app/services/auth';
import clsx from 'clsx';
import { PiGoogleLogoBold } from 'react-icons/pi';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={clsx('flex h-10 items-center rounded-lg bg-[var(--primaryColor)] text-sm font-medium text-white transition-colors hover:bg-[var(--lightPurple)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible: outline-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
                className)}
        >
            {children}
        </button>
    )
}

export function GoogleLoginButton({ text }: { text?: string }) {
    return (
        <Button className=" w-full px-3 text-left " onClick={googleLogin}>
            {text ? text : 'Login with Google'} <PiGoogleLogoBold className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
    )
}