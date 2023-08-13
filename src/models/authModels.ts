import { Request } from "express";

export interface IPublicUserData {
    id: string;
    login: string;
    email: string;
    confirmed: boolean;
    roles: number[];
}

export interface IPrivateUserData {
    password: string;
    phone_number: string | null;
}

export interface IUser extends IPublicUserData, IPrivateUserData { }

type TLoginData = Pick<IUser, 'login' | 'password'>;
export type TRequestUser = Pick<IUser, 'id' | 'roles'>;
export type TJWVPayload = TRequestUser;
export type TRegistrationUserData = Omit<IUser, 'id' | 'confirmed' | 'roles'>;

export type TRegistrationRequest = Request<{}, {}, TRegistrationUserData>;
export type TLoginRequest = Request<{}, {}, TLoginData>;