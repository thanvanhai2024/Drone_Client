import React, { Suspense, useEffect } from 'react'
import useUserStore from '../store'
import axios from 'axios'
import { AUTH_SERVICE_URL, AUTH_SERVICE_WEBSOCKET_URL } from '../route/common/path'
import { IUser } from '../store/types'
import { AuthProvider } from './Auth'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useNavigate } from 'react-router-dom'
import { LoadingPage5 } from '../route/LoadingPage/Loadingpage'
import { StompSessionProvider } from 'react-stomp-hooks'
import NotificationService from '../service/NotificationService'


export var axiosCredentials = axios.create({
  headers: {
    Authorization: `Bearer ${AuthProvider.getToken()}`
  }
})


export const AuthorizedRoute = () => {
  const { setAuthUser } = useUserStore((state) => state)
  const navigate = useNavigate()

  axios.defaults.headers.common = {
    Authorization: `Bearer ${AuthProvider.getToken()}`,
  }

  axiosCredentials = axios.create({
    headers: {
      Authorization: `Bearer ${AuthProvider.getToken()}`
    }
  })

  const fetchUserInfo = (): Promise<IUser> =>
    axiosCredentials.get(`${AUTH_SERVICE_URL}/api/user/me`)
      .then(response => response.data)

  const { data, isError, isPending } = useQuery({
    queryKey: ['meData'],
    queryFn: fetchUserInfo,
  })

  if (isError) {
    console.error('Failed to fetch user info! Please sign in again')
    navigate('/auth/login')
    if (process.env.NODE_ENV === 'production'){
      window.location.reload()
    }
  }

  useEffect(() => {
    if (!AuthProvider.isAuth()) {
      navigate('/auth/login')
      if (process.env.NODE_ENV === 'production'){
        window.location.reload()
      }
    }
    if (data){
      console.log(data)
      setAuthUser(data)
    }
  }, [data, setAuthUser, navigate])

  const authHeaders = {
    Authorization: `Bearer ${AuthProvider.getToken()}`
  }

  return isPending ? <LoadingPage5/> :
    <Suspense fallback={<LoadingPage5 />}>
      <StompSessionProvider url={`${AUTH_SERVICE_WEBSOCKET_URL}/ws`} connectHeaders={authHeaders}>
        <NotificationService />
        <Outlet/>
      </StompSessionProvider>
    </Suspense>
}
