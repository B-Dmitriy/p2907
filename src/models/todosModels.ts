import type { Request } from 'express';

export type GetTodosRequest = Request<any, any, any, {
    limit: string
    page: string
}>;

export type GetTodoByIdRequest = Request<{
    todoId: string
}, any, any, any>;

export type CreateTodoRequest = Request<any, any, {
    title: string
    description: string
    deadline: string
}, any>;

export type UpdateTodoRequest = Request<{
    todoId: string
}, any, {
    title: string
    description: string
    isDone: boolean
    deadline: string
}, any>;

export type DeleteTodoRequest = Request<{
    todoId: string
}, any, any, any>;

export interface ITodo {
    id: string
    title: string
    isDone: boolean
}
