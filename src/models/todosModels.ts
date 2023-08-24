import type { Request } from 'express';

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

export type UpdateTodoRequest = Request<{
    todoId: string;
}, {}, {
    title: string,
    description: string,
    is_done: boolean,
    deadline: string,
}, {}>

export type DeleteTodoRequest = Request<{
    todoId: string;
}, {}, {}, {}>

export interface Todo {
    id: number
    user_id: number
    title: string
    description: string | null
    is_done: boolean
    deadline: Date | null
    created_at: Date
    updated_at: Date | null
}
