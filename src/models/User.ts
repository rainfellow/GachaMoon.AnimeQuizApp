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
