import { Request } from 'express';

export type GetTodosRequest = Request<{}, {}, {}, {
    userId: string,
    limit: string,
    page: string,
}>

export type GetTodoByIdRequest = Request<any, any, any, {
    userId: string
}>

export type CreateTodoRequest = Request<any, {
    title: string,
    description: string,
    deadline: string,
}, any, {
    userId: string
}>

export type UpdateTodoRequest = Request<any, {
    title: string,
    description: string,
    is_done: boolean,
    deadline: string,
}, any, {
    userId: string
}>

export type DeleteTodoRequest = Request<any, any, any, {
    userId: string
}>

export interface ITodo {
    id: string;
    title: string;
    is_done: boolean;
}