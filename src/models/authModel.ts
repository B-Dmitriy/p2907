export type TRole = "user" | "admin";

export interface IPublicUserData {
    id: string;
    login: string;
    email: string;
}

export interface IPrivateUserData {
    password: string;
    phone_number: string;
    role: TRole;
}

export interface IUser extends IPublicUserData, IPrivateUserData { }