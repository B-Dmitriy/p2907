import { Request } from 'express';

export type GetTodosRequest = Request<{}, {}, {}, {
    limit: string,
    page: string,
}>

export type GetTodoByIdRequest = Request<{
    todoId: string;
}, {}, {}, {}>

export type CreateTodoRequest = Request<{}, {}, {
    title: string,
    description: string,
    deadline: string,
}, {}>

export type UpdateTodoRequest = Request<any, {
    title: string,
    description: string,
    is_done: boolean,
    deadline: string,
}, any, {}>

export type DeleteTodoRequest = Request<{
    todoId: string;
}, {}, {}, {}>

export interface ITodo {
    id: string;
    title: string;
    is_done: boolean;
}