import jwtDecode from "jwt-decode";
import { baseApi } from "../../app/api";
import { loggedOut, setCredentials } from "./authSlice";
import { LoginInput, RegisterInput, Token, TokenPayload } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<Token, LoginInput>({
      query: (loginInput) => ({
        url: '/auth/login',
        method: 'POST',
        body: loginInput,
        credentials: 'include'
      }),
      async onQueryStarted(loginInput, { dispatch, queryFulfilled }) {
        try {
          const {data} = await queryFulfilled;
          const decoded: TokenPayload = jwtDecode(data.accessToken);

          dispatch(setCredentials({
            token: data.accessToken,
            currentUser: decoded.user
          }));
        } catch (err) {} // error will be handled in Login component
      }
    }),
    register: builder.mutation<any, RegisterInput>({
      query: (registerInput) => ({
        url: '/auth/register',
        method: 'POST',
        body: registerInput
      })
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
        credentials: 'include'
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(loggedOut());
          dispatch(baseApi.util.resetApiState());
        } catch {
          // error will be handled in component
        }
      }
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation
} = authApi;