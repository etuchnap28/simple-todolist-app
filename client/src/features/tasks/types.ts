import { EntityId } from "@reduxjs/toolkit";

export interface Task {
  _id: string,
  userId: string,
  task: string,
  done: boolean
}

export interface TaskUpdateInput {
  taskId: EntityId,
  done?: boolean,
  task?: string
}

export type TasksResponse = Task[];