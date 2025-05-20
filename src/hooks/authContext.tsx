'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { KEY_COOKIES } from '@/lib/constants/auth.constants';
import { UserModel } from '@/lib/constants/user.constants';
import { deleteClientCookie, getClientCookie } from '@/lib/cookies.client';
import { decryptData } from '@/lib/helper';

interface AuthContextType {
    isAuthenticated: boolean;
    userInfo: UserModel | null;
    login: () => void;
    logout: () => void;
    token: string;
    refreshToken: string;
    setInfoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                          children,
                                                                      }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userInfo, setUser] = useState<UserModel | null>(null);
    const token = getClientCookie(KEY_COOKIES.TOKEN) ?? '';
    const refreshToken = getClientCookie(KEY_COOKIES.REFRESH_TOKEN) ?? '';

    useEffect(() => {
        getDataUser();
    }, []);

    const getDataUser = React.useCallback(() => {
        const token = getClientCookie(KEY_COOKIES.TOKEN) ?? '';
        const dataUser = getClientCookie(KEY_COOKIES.USER);

        if (token) {
            setIsAuthenticated(true);
        }

        // Need to change after full user data
        console.log(KEY_COOKIES.USER, dataUser)
        // if (dataUser) {
        //     const encryptInfoUser = decryptData(dataUser);
        //     const parseInfoUser = JSON.parse(encryptInfoUser);
        //     setUser(parseInfoUser);
        //     return dataUser
        // }
    }, []);

    const setInfoUser = React.useCallback(() => {
        const dataUser = getClientCookie(KEY_COOKIES.USER);

        if (dataUser) {
            const encryptInfoUser = decryptData(dataUser);
            const parseInfoUser = JSON.parse(encryptInfoUser);
            setUser(parseInfoUser);
        }
    }, []);

    const login = useCallback(() => {
        getDataUser();
    }, []);

    const logout = useCallback(() => {
        deleteClientCookie(KEY_COOKIES.TOKEN);
        deleteClientCookie(KEY_COOKIES.REFRESH_TOKEN);
        deleteClientCookie(KEY_COOKIES.USER);
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            login,
            logout,
            userInfo,
            token,
            refreshToken,
            setInfoUser,
        }),
        [isAuthenticated, login, logout, userInfo, token, setInfoUser],
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};