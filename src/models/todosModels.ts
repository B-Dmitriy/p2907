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
