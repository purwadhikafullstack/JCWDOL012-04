"use client"
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UseRecordPreviousPath() {
    const currentPath = usePathname();

    useEffect(() => {
        if (
            !currentPath.includes('/login') &&
            !currentPath.includes('/register') &&
            !currentPath.includes('/auth/verify') &&
            !currentPath.includes('/auth/reset-password') &&
            !currentPath.includes('/logout')
        ) {
            sessionStorage.setItem('prevPath', currentPath);
        }
    }, [currentPath]);

    return (<></>)
};