import { Request } from "express";
import { type } from "os";

export type TRole = "user" | "admin";

export interface IPublicUserData {
    id: string;
    login: string;
    email: string;
    confirmed: boolean;
}

export interface IPrivateUserData {
    password: string;
    phone_number: string | null;
    role: TRole;
}

export interface IUser extends IPublicUserData, IPrivateUserData { }

export type TRequestUser = Pick<IUser, 'id' | 'role'>

export type TRegistrationUserData = Omit<IUser, 'id' | 'confirmed' | 'role'>;

export type TRegistrationRequest = Request<{}, {}, TRegistrationUserData>;