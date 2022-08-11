import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthState, Token } from "./types";

const initialState: AuthState = {
  token: '',
  currentUser: undefined
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state: AuthState, action: PayloadAction<AuthState>) => {
      const {token, currentUser} = action.payload;
      state.currentUser = currentUser;
      state.token = token;
    },
    tokenReceived: (state: AuthState, action: PayloadAction<Token>) => {
      state.token = action.payload.accessToken;
    },
    loggedOut: () => initialState
  }
});

export const {
  setCredentials,
  tokenReceived,
  loggedOut
} = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.currentUser;

export default authSlice.reducer;