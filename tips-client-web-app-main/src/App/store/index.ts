import { create } from 'zustand'
import { IUser } from './types'
import { persist } from 'zustand/middleware'

type UserStore = {
  authUser: IUser | null,
  requestLoading: boolean,
  setAuthUser: (user: IUser | null) => void,
  setRequestLoading: (isLoading: boolean) => void
}

const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      authUser: null,
      requestLoading: false,
      setAuthUser: (user) => set( (state) => ({ ...state, authUser: user })),
      setRequestLoading: (isLoading) => {
        set( (state) => ({ ...state, requestLoading: isLoading }) )
      } }),
    {
      name: 'userInfoStorage',
    }))
export default useUserStore