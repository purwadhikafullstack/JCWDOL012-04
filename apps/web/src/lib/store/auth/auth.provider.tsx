"use client";

import { UsersModel } from "@/model/UsersModel";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { logInAction, verifyToken, logOutAction, setPasswordAction, registerWithEmailAction } from "./auth.action";
import { changeNameAction, changePasswordAction, changeEmailAction, updateEmailAction, verifyChangeEmailToken } from "./auth.profile.action";
import { getCookie } from "@/utils/helper";
import { usePathname, useSearchParams } from "next/navigation";

export type AuthContextType = {
    isLoading: boolean;
    user: UserAuthType;
    error: UserAuthErrorType
    setUser: Dispatch<SetStateAction<UserAuthType>>;
    verifyActivationToken: (token: string) => void;
    setPassword: (values: { password: string }, token?: string, redirectTo?: string) => void;
    logIn: (values: { email: string, password: string }) => void;
    logOut: () => void;
    registerWithEmail: (values: { email: string, firstName: string, lastName: string }) => void;
    changeName: (values: { firstName: string, lastName: string, password: string }) => void;
    changePassword: (values: { currentPassword: string, newPassword: string, retypeNewPassword: string }) => void;
    changeEmail: (values: { newEmail: string, password: string }) => void;
    updateEmail: (values: { password: string }, token: string) => void;
} | null;

export type UserAuthType = {
    isAuthenticated: boolean;
    data: UsersModel | null;
}

export type UserAuthErrorType = {
    status: number | null | undefined;
    message: string | null | undefined;
}

const initialUserAuth = {
    isAuthenticated: false,
    data: null
}

const AuthContext = createContext<AuthContextType>(null);
const cookieName: string = process.env.NEXT_PUBLIC_COOKIE_NAME || "";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const hasCookie = getCookie(cookieName);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserAuthType>(initialUserAuth);
    const [error, setError] = useState<UserAuthErrorType>({ status: null, message: null });
    const path = usePathname();
    const tokenQuery = useSearchParams().get('token')

    useEffect(() => {
        if (!hasCookie) {
            setIsLoading(true);
            setUser(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }));
            setIsLoading(false);
        } else if (hasCookie) {
            setIsLoading(true);
            verifyToken(setUser, setError, setIsLoading, undefined, path);
        }
    }, [hasCookie]);

    useEffect(() => {
        if (tokenQuery && path.includes('/auth/verify/change-email')) {
            validateChangeEmailToken(tokenQuery);
            return;
        }
    }, [path])

    const logOut = () => {
        setIsLoading(true);
        setUser(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }));
        logOutAction();
        window.location.href = "/auth/login";
    }

    const logIn = (values: { email: string, password: string }) => {
        setIsLoading(true);
        logInAction(values, setUser, setError, setIsLoading);
    }

    const verifyActivationToken = (token: string) => {
        setIsLoading(true);
        verifyToken(setUser, setError, setIsLoading, token, path);
    }

    const setPassword = (values: { password: string }, token?: string, redirectTo?: string) => {
        setIsLoading(true);
        setPasswordAction(values, setUser, setError, setIsLoading, token, redirectTo);
    }

    const registerWithEmail = (values: { email: string, firstName: string, lastName: string }) => {
        setIsLoading(true);
        registerWithEmailAction(values, setUser, setError, setIsLoading);
    }

    const changeName = async (values: { firstName: string, lastName: string, password: string }) => {
        setIsLoading(true);
        await changeNameAction(values, setUser, setError, setIsLoading);
    }

    const changePassword = async (values: { currentPassword: string, newPassword: string, retypeNewPassword: string }) => {
        setIsLoading(true);
        await changePasswordAction(values, setUser, setError, setIsLoading);
    }

    const changeEmail = async (values: { newEmail: string, password: string }) => {
        setIsLoading(true);
        await changeEmailAction(values, setUser, setError, setIsLoading);
    }

    const validateChangeEmailToken = async (token: string) => {
        setIsLoading(true);
        await verifyChangeEmailToken(token, setUser, setError, setIsLoading);
    }

    const updateEmail = async (values: { password: string }, token: string) => {
        setIsLoading(true);
        await updateEmailAction(values, token, setUser, setError, setIsLoading);
    }

    return (
        <AuthContext.Provider value={
            {
                isLoading,
                user,
                error,
                setUser,
                logIn,
                logOut,
                verifyActivationToken,
                setPassword,
                registerWithEmail,
                changeName,
                changePassword,
                changeEmail,
                updateEmail
            }
        }>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
