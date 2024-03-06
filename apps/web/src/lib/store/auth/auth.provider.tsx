"use client";

import { UsersModel } from "@/model/UsersModel";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { verifyToken } from "./auth";
import { getCookie, logOutAction } from "@/utils/helper";

export type AuthContextType = {
    isLoading: boolean;
    user: UserAuthType | null;
    setUser: Dispatch<SetStateAction<UserAuthType | null>>;
    logOut: () => void;
} | null | undefined;

export type UserAuthType = {
    isAuthenticated: boolean;
    data: UsersModel | null;
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

    useEffect(() => {
        if (!hasCookie) {
            setIsLoading(true);
            setUser(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }));
            setIsLoading(false);
        } else if (hasCookie && !user?.isAuthenticated) {
            setIsLoading(true);
            verifyToken(setUser, setIsLoading);
        }
    }, []);

    const logOut = () => {
        setUser(prevUser => ({ ...prevUser, isAuthenticated: false, data: null }));
        logOutAction();
        window.location.href = "/auth/login";
    }

    return (
        <AuthContext.Provider value={{ isLoading, user, setUser, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
