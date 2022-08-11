import { createEntityAdapter, EntityState, createSelector, EntityId } from "@reduxjs/toolkit";
import { baseApi } from "../../app/api";
import { RootState } from "../../app/store";
import { Task, TasksResponse, TaskUpdateInput } from "./types";

const tasksAdapter = createEntityAdapter<Task>({
  selectId: task => task._id
});

const initialState = tasksAdapter.getInitialState();

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<EntityState<Task>, void>({
      query: () => ({
        url: '/tasks',
        credentials: 'include'
      }),
      transformResponse: (responseData: TasksResponse ) => {
        return tasksAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => 
        result
        ? [
          {type: 'Task', id: 'LIST'},
          ...result.ids.map(id => ({type: 'Task' as const, id }))
        ]
        : [{type: 'Task', id: 'LIST'}]
    }),
    createTask: builder.mutation<any, string>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: {
          task
        },
        credentials: 'include'
      }),
      invalidatesTags: [
        { type: 'Task', id: 'LIST' }
      ]
    }),
    updateStatus: builder.mutation<any, TaskUpdateInput>({
      query: ({taskId, done}) => ({
        url: `/tasks/${taskId}`,
        method: 'PATCH',
        body: {done}
      }),
      async onQueryStarted({ taskId, done }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, draft => {
            const task = draft.entities[taskId];
            if (task) task.done = done as boolean;
          })
        )
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      }
    }),
    updateTask: builder.mutation<any, TaskUpdateInput>({
      query: ({taskId, task}) => ({
        url: `/tasks/${taskId}`,
        method: 'PATCH',
        body: {task}
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Task', id: arg.taskId}
      ]
    }),
    deleteTask: builder.mutation<any, EntityId>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Task', id: arg}
      ]
    }) 
  })
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateStatusMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation
} = tasksApi;

const selectTasksResult = tasksApi.endpoints.getTasks.select();
const selectTasksData = createSelector(
  selectTasksResult,
  taskResult => taskResult.data
)

export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds
} = tasksAdapter.getSelectors<RootState>(state => selectTasksData(state) ?? initialState);