export interface GenerateTokensResult {
    accessToken: string;
    refreshToken: string;
}

export interface ISaveTokenResponse {
    userId: string;
    refreshToken: string;
}

export interface IRefreshTokenResponse {
    userId: string;
    refreshToken: string;
    accessToken: string;
}