export interface AuthState {
  token: string,
  currentUser?: string
}

export interface LoginInput {
  username: string,
  password: string
}

export interface RegisterInput {
  username: string,
  password: string,
  name: string
}

export interface Token {
  accessToken: string
}


export interface TokenPayload {
  user: string
}