import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { type IAccount as IAccount } from "../hooks/use-auth";
import { AccountInfo } from "../models/User";
import { PlayerInfo } from "@/models/GameConfiguration";

export interface IAuthContext {
    account: IAccount | null;
    setAccount: (user: IAccount | null) => void;
    accountInfo: AccountInfo | null;
    setAccountInfo: (info: AccountInfo | null) => void;
    friends: PlayerInfo[] | null
    setFriends: (friends: PlayerInfo[] | null) => void;
    friendsCount: number
}

export const AuthContext = createContext<IAuthContext>({
    account: null,
    setAccount: () => { console.log("setting user") },
    accountInfo: null,
    setAccountInfo: () => { console.log("setting user info") },
    friends: null,
    setFriends: () => { console.log("setting user info") },
    friendsCount: 0,
});

interface AuthContextProviderProps {
    children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children
}: AuthContextProviderProps): ReactElement => {
    const [account, setAccount] = useState<IAccount | null>(null);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [friends, setFriends] = useState<PlayerInfo[] | null>(null);
    const [friendsCount, setFriendsCount] = useState<number>(0);

    const contextValue = {
        account,
        setAccount: useCallback((account: IAccount | null) => {
            setAccount(account);
        }, []),
        accountInfo,
        setAccountInfo: useCallback((info: AccountInfo | null) => {
            setAccountInfo(info);
        }, []),
        friends,
        setFriends: useCallback((friends: PlayerInfo[] | null) => {
            setFriends(friends);
            if (friends != null)
            {
                setFriendsCount(friends.length);
            }
        }, []),
        friendsCount
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
