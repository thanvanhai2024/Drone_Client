import React from 'react'

export interface DecodedJwtToken {
  exp: number,
  iat: number,
  sub: string,
  aud: string
}

export interface LoggedUser {
  id?: string,
  username: string;
  email?: string;
  role?: string[]
  is_superuser: boolean
  token?: string
}

export interface Role {
  id: string,
  name: string
}

export const MeContext = React.createContext<LoggedUser>({ username:'', is_superuser: false })