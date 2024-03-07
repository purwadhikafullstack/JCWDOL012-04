"use client";

import { UsersModel } from "@/model/UsersModel";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { logInAction, verifyToken, logOutAction, setPasswordAction, registerWithEmailAction } from "./auth.action";
import { getCookie } from "@/utils/helper";

export type AuthContextType = {
    isLoading: boolean;
    user: UserAuthType | null;
    error: UserAuthErrorType
    setUser: Dispatch<SetStateAction<UserAuthType | null>>;
    verifyActivationToken: (token: string) => void;
    setPassword: (values: { password: string }, token?: string, redirectTo?: string) => void;
    logIn: (values: { email: string, password: string }) => void;
    logOut: () => void;
    registerWithEmail: (values: { email: string, firstName: string, lastName: string }) => void;
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
    const [user, setUser] = useState<UserAuthType | null>(initialUserAuth);
    const [error, setError] = useState<UserAuthErrorType>({ status: null, message: null });

    useEffect(() => {
        if (!hasCookie) {
            setIsLoading(true);
            setUser(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }));
            setIsLoading(false);
        } else if (hasCookie && !user?.isAuthenticated) {
            setIsLoading(true);
            verifyToken(setUser, setError, setIsLoading);
        }
    }, []);

    const logOut = () => {
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
        verifyToken(setUser, setError, setIsLoading, token);
    }

    const setPassword = (values: { password: string }, token?: string, redirectTo?: string) => {
        setIsLoading(true);
        setPasswordAction(values, setUser, setError, setIsLoading, token, redirectTo);
    }

    const registerWithEmail = (values: { email: string, firstName: string, lastName: string }) => {
        setIsLoading(true);
        registerWithEmailAction(values, setUser, setError, setIsLoading);
    }

    return (
        <AuthContext.Provider value={{ isLoading, user, error, setUser, logIn, logOut, verifyActivationToken, setPassword, registerWithEmail }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
