import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useLocalStorage } from "./use-local-storage";

export interface IAccount {
    token: string;
    accountId: number;
}

export interface IAuth {
    account: IAccount | null;
    isAuthenticated: () => IAccount | null;
    login: (account: IAccount) => void;
    logout: () => void;
}

export const useAuth = (): IAuth => {
    const { account, setAccount, setAccountInfo } = useContext(AuthContext);
    const { setItem, removeItem } = useLocalStorage();

    const isAuthenticated = (): IAccount | null => {
        return account;
    };

    const addAccount = (account: IAccount): void => {
        setAccount(account);
        setItem("account", JSON.stringify(account));
        console.log('logged in');
    };

    const removeAccount = (): void => {
        setAccount(null);
        setAccountInfo(null);
        removeItem("account");
    };

    const login = (account: IAccount): void => {
        console.log("logging in token " + account.token)
        addAccount(account);
    };

    const logout = (): void => {
        removeAccount();
    };

    return { account, login, logout, isAuthenticated };
};
