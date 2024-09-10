import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { object, string, TypeOf } from 'zod'
import { AUTH_SERVICE_URL } from '../route/common/path'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { axiosCredentials } from './AuthorizedRoute'

interface ViolationProps {
  fieldName: string
  message: string
}

const registerSchema = object({
  username: string().min(1, 'Username is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  passwordConfirm: string().min(1, 'Please confirm your password'),
  name: string().min(1, 'Name is required'),
  phoneNumber: string().min(10, 'Phone number has at least 10 digits')

}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
})

export type RegisterInput = TypeOf<typeof registerSchema>

const Register: React.FC = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const showPasswordToggle = () => setShowPassword(!showPassword)

  const onRegisterUser = async (registerInput: RegisterInput) => {
    axiosCredentials.post(`${AUTH_SERVICE_URL}/api/auth/register`, {
      ...registerInput,
    })
      .then((response) => {
        console.log(response)
        toast.success(`${response.data.message}`)
        window.location.replace(`${window.location.origin}${process.env.PUBLIC_URL}/auth/login`)
        console.log(`Successfully register ${response.data?.username}!`, {
          type: 'success',
        })
      })
      .catch((error) => {
        console.log(`Failed to register new user with error ${error}!`, {
          type: 'error',
        })

        if (error.response && error.response.data && error.response.data.violations) {
          const violations = error.response.data.violations
          violations.forEach((violation: any) => {
            toast.error(`${violation.fieldName}: ${violation.message}`)
          })
        } else {
          // toast.error('Failed to register new user.')
        }

      // const violationsError = error.response?.data['violations']
      // violationsError((element: ViolationProps) => {
      //   toast.error(`${element.fieldName}: ${element.message}`)
      // })
      })
  }

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    console.log('reset()')
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])


  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    onRegisterUser(values)
  }

  return (
    <div className={'flex h-screen items-center justify-center bg-main bg-cover'}>
      <div className={`flex flex-col md:w-[690px] items-center justify-center backdrop-blur-lg bg-white/10
       rounded-3xl`}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={'flex flex-col w-full h-full gap-6 p-3'}>
            <h2 className={'font-bold text-2xl text-center'}>AI 드론 관제 시스템</h2>
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

            <div className="flex flex-col gap-1">
              <label>
                비밀번호 확인
                {errors.passwordConfirm && (
                  <span className="text-red-500">
                    {` ${errors.passwordConfirm?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:w-[500px] md:h-[50px] p-2 text-black'}
                  placeholder="Password Confirm"
                  type={showPassword ? 'text' : 'password'}
                  {...register('passwordConfirm')}
                />
                <div
                  className={'absolute ml-[270px] md:ml-[470px]'}>
                  {showPassword ?
                    <EyeOff className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                    :
                    <Eye className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                  }
                </div>
              </div>

            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email">
                이메일
                {errors.email && (
                  <span className="text-red-500 text-sm text-center mt-1">
                    {` ${errors.email?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg md:w-[500px] md:h-[50px] p-2 text-black'}
                placeholder="Email"
                {...register('email')}
              />
            </div>

            {/*name*/}
            <div className="flex flex-col gap-1">
              <label htmlFor="name">
                이름
                {errors.name && (
                  <span className="text-red-500 text-sm text-center mt-1">
                    {` ${errors.name?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg md:w-[500px] md:h-[50px] p-2 text-black'}
                placeholder="Name"
                {...register('name')} //add name const registerSchema
              />
            </div>

            {/*phoneNumber*/}
            <div className="flex flex-col gap-1">
              <label htmlFor="phoneNumber">
                전화번호
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm text-center mt-1">
                    {` ${errors.phoneNumber?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg md:w-[500px] md:h-[50px] p-2 text-black'}
                placeholder="Phone number"
                {...register('phoneNumber')}
              />

              <div className="flex mt-2">
                <span
                  className="hover:underline hover:cursor-pointer text-xs text-white/50"
                  onClick={() =>
                    window.location.replace(`${window.location.origin}${process.env.PUBLIC_URL}/auth/login`)}
                >
                Sign in
                </span>
              </div>
            </div>


            <Button variant={'primary'} className={'md:w-[500px] md:h-[60px]'} type="submit">
              Register
            </Button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
