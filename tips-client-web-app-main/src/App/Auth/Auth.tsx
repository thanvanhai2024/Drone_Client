import { AUTH_SERVICE_URL } from '../route/common/path'
import { axiosCredentials } from './AuthorizedRoute'
import axios from 'axios'
import { jwtDecode, JwtPayload } from 'jwt-decode'


class Auth {
  private readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async signIn(username: any, password: any) {
    const postURL = `${this.endpoint}/api/auth/login`
    const res = await axiosCredentials.post(postURL, { username: username, password: password })

    // TODO: need more handle here
    if (res.status !== 200) {
      throw new Error('Invalid username or password')
    }
    axios.defaults.headers.common = {
      Authorization: `Bearer ${res.data.token}`,
    }

    localStorage.setItem('authToken', res.data.token)
    localStorage.setItem('authRefreshToken', res.data.refreshToken)
    return res.data
  }

  signOut() {
    axiosCredentials.post(`${this.endpoint}/api/auth/logout`).then((response) => {
      console.log(response)
      console.log('Logout successfully!')
    }).catch((error) => {
      console.log(`Logout failed with error: ${error.message}`)
    }).finally(() => {
      localStorage.clear()
      window.location.reload()
    })
  }

  getToken(): string {
    const res = localStorage.getItem('authToken')
    if (!res) {
      return ''
      // throw new UnauthorizedError('Access Token expired')
    }
    return res
  }

  isAuth() {
    const token: string | null = localStorage.getItem('authToken')
    if (token) {
      return !this.isTokenExpired(token)
    }
    return false
  }

  isTokenExpired(token: string){
    const decodedToken = jwtDecode<JwtPayload>(token)
    if (decodedToken?.exp) {
      return !(new Date() <= new Date(decodedToken?.exp * 1000))
    }
    return false
  }

}

export class UnauthorizedError extends Error {
}

export const AuthProvider = new Auth(`${AUTH_SERVICE_URL}`)
