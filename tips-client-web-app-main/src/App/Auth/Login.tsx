import React, { useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router/dist/lib/hooks'
import { useNavigate } from 'react-router-dom'
import { AuthProvider } from './Auth'
import { object, string, TypeOf } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useUserStore from '../store'
import { toast } from 'react-toastify'
import { Button } from '../components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import theDron from '../../resources/theDron.png'

const loginSchema = object({
  username: string().min(1, 'Username is required').max(100),
  password: string()
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
})

export type LoginInput = TypeOf<typeof loginSchema>

export const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const showPasswordToggle = () => setShowPassword(!showPassword)

  const userStore = useUserStore()

  let navigate: NavigateFunction = useNavigate()
  const handleLogin = async (loginInput: LoginInput) => {
    userStore.setRequestLoading(true)

    AuthProvider.signIn(
      loginInput.username || '',
      loginInput.password || ''
    ).then( (response) => {
      console.log(response)
      userStore.setAuthUser(response)
      navigate('/')
    }).catch (e => {
      toast.error('Invalid ID or Password')
    }).finally(() => {
      userStore.setRequestLoading(false)
    })
  }

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods

  useEffect(() => {
    console.log('Login useEffect')
    if (isSubmitSuccessful) {
      reset()
    }
    // TODO
  }, [isSubmitSuccessful, reset])

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    handleLogin(values)
  }

  return (
    <div className={'flex h-screen items-center justify-center bg-main bg-cover'}>
      <div className={'flex flex-col md:w-[690px] md:h-[560px] items-center justify-center ' +
        'backdrop-blur-lg bg-white/10 rounded-3xl'}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={'flex flex-col gap-6 p-3'}>
            <div className={''}>
              <div className="w-[100px] h-[30px]">
                <img src={theDron} alt={'Logo'}></img>
              </div>
              <h1 className={'font-bold text-[38px] text-center'}>AI 드론 관제 시스템</h1>
            </div>
            <div className="flex flex-col gap-1">
              <label>
                사용자 ID
                {errors.username && (
                  <span className="text-red-500">
                    {` ${errors.username?.message}!`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg md:w-[500px] md:h-[50px] p-2 text-black'}
                placeholder="Username"
                type={'text'}
                {...register('username')}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>
                비밀번호
                {errors.password && (
                  <span className="text-red-500">
                    {` ${errors.password?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:w-[500px] md:h-[50px] p-2 text-black'}
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                />
                <div className={'absolute ml-[270px] md:ml-[470px]'}>
                  {showPassword ?
                    <EyeOff className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                    :
                    <Eye className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                  }
                </div>
              </div>

            </div>

            <div className="flex">
              <span
                className="hover:underline hover:cursor-pointer text-xs text-white/50"
                onClick={() => navigate('/auth/register')}
              >
                  Forget password?
              </span>

              <span
                className="ml-auto hover:underline hover:cursor-pointer text-xs text-white/50"
                onClick={() => navigate('/auth/register')}
              >
                  Register
              </span>
            </div>

            <Button
              variant={'primary'}
              className={'md:w-[500px] md:h-[60px]'}
              type="submit">
              로그인
            </Button>

          </div>
        </form>
      </div>
    </div>
  )
}
