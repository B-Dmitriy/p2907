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
    userId: string,
    limit: string,
    page: string,
}>