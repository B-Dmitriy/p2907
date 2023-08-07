import { Request } from 'express';

export interface Task {
    id: number;
    todo_id: number;
    title: string;
    description: string | null;
    is_done: boolean;
}

export type GetTasksRequest = Request<{
    todoId: string;
}, {}, {}, {
    userId: string;
    limit: string;
    page: string;
}>

export type GetTasksByIdRequest = Request<{
    todoId: string;
    taskId: string;
}, {}, {}, {
    userId: string;
}>

export type CreateTaskRequest = Request<{
    todoId: string;
}, {}, {
    title: string;
    description: string;
}, {
    userId: string;
}>

export type UpdateTaskRequest = Request<{
    todoId: string;
    taskId: string;
}, {}, {
    title: string;
    description: string;
    isDone: boolean;
}, {
    userId: string;
}>

export type DeleteTaskRequest = Request<{
    todoId: string;
    taskId: string;
}, {}, {}, {
    userId: string;
}>