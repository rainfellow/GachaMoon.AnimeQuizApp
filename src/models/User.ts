export interface LoginData {
    loginData: {
        accountId: number;
        token: string;
    }
}

export interface AccountInfo {
    accountName: string;
    accountType: string;
    premiumCurrencyAmount: number;
    wildcardSkillItemCount: number;
    standardBannerRollsAmount: number;
}

export interface FriendRequest {
    id: number;
    requestType: FriendRequestType;
    friendData: FriendData;
}

export interface FriendData {
    accountId: number;
    accountName: string;
}

export enum FriendRequestType {
    Incoming = "Incoming", Outgoing = "Outgoing"
}