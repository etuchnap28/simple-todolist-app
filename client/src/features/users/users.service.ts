import { createEntityAdapter, EntityId, EntityState } from "@reduxjs/toolkit";
import { baseApi } from "../../app/api";
import { User } from "./types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        credentials: 'include'
      })
    })
  })
})

export const {
  useGetUserQuery
} = usersApi;