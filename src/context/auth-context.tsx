import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { type IAccount as IAccount } from "../hooks/use-auth";
import { AccountInfo } from "../models/User";

export interface IAuthContext {
    account: IAccount | null;
    setAccount: (user: IAccount | null) => void;
    accountInfo: AccountInfo | null;
    setAccountInfo: (info: AccountInfo | null) => void;
}

export const AuthContext = createContext<IAuthContext>({
    account: null,
    setAccount: () => { console.log("setting user") },
    accountInfo: null,
    setAccountInfo: () => { console.log("setting user info") },
});

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children
}: AuthContextProviderProps): ReactElement => {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

    const contextValue = {
        account,
        setAccount: useCallback((account: IAccount | null) => {
            setAccount(account);
        }, []),
        accountInfo,
        setAccountInfo: useCallback((info: AccountInfo | null) => {
            setAccountInfo(info);
        }, [])
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
