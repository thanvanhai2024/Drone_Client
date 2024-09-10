import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useEffect, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'
import { Button } from '../components/ui/button'
import useUserStore from '../store'
import { AUTH_SERVICE_URL } from '../route/common/path'
import { toast } from 'react-toastify'
import { axiosCredentials } from './AuthorizedRoute'
import { SystemThemeContext } from '../route/AppWrapper'

const UserInfoSchema = object({
  id: string().min(1),
  username: string().min(1, 'Username is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  name: string().min(1, 'Name is required'),
  phoneNumber: string().min(10, 'Phone number has at least 10 digits')
})

export type UserInfoInput = TypeOf<typeof UserInfoSchema>

const UserInfo = () => {
  const { authUser, setAuthUser } = useUserStore(state => state)
  const [isPending, startTransition] = useTransition()
  const { themeName } = useContext(SystemThemeContext)

  const onModifyUserInfo = async (userInfoInput: UserInfoInput) => {
    console.log(userInfoInput)
    axiosCredentials.put(`${AUTH_SERVICE_URL}/api/user/update`, {
      ...userInfoInput,
    })
      .then((response) => {
        let newData = response.data
        toast.success(`Successfully update ${newData?.username}!`)
        setAuthUser(newData)

        setValue('name', userInfoInput.name)
        setValue('phoneNumber', userInfoInput.phoneNumber)
        setValue('email', userInfoInput.email)
      })
      .catch((error) => {
        console.log(`Failed to update ${userInfoInput.username} with error: ${error}!`)
      })
  }

  const {
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = useForm<UserInfoInput>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      id: authUser?.id,
      username: authUser?.username,
      name: authUser?.name,
      email: authUser?.email,
      phoneNumber: authUser?.phoneNumber,
    }
  })

  useEffect(() => {
    console.log('isSubmitSuccessful')
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])


  const onSubmitHandler: SubmitHandler<UserInfoInput> = (values) => {
    startTransition(() => {
      onModifyUserInfo(values)
    })
  }
  
  if (themeName === 'tips') {
    return (
      <div className={'flex flex-col items-center justify-center backdrop-blur-lg bg-white/10 rounded-3xl'}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={'flex flex-col w-full h-full gap-6 p-3'}>
            <h2 className={'font-bold text-2xl text-center'}>사용자 정보 수정</h2>
            <div className="hidden">
              <input
                type={'text'}
                {...register('id')}
              />
              <input
                className={'rounded-lg md:h-[50px] p-2'}
                placeholder="Username"
                type={'text'}
                {...register('username')}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>
                이름
                {errors.name && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.name?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                placeholder="Name"
                {...register('name')} //add name const registerSchema
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label htmlFor="email">
                이메일
                {errors.email && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.email?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                placeholder="Email"
                {...register('email')}
              />
            </div>
            
            {/*phoneNumber*/}
            <div className="flex flex-col gap-1">
              <label htmlFor="phoneNumber">
                전화번호
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.phoneNumber?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                placeholder="Phone number"
                {...register('phoneNumber')}
              />
            </div>
            
            <Button disabled={isPending} variant={'primary'} type="submit" >
              정보 수정
            </Button>
          
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div className={'flex flex-col items-center justify-center backdrop-blur-lg bg-white/10 rounded-3xl w-[350px] mt-[-80px]'}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={'flex flex-col w-full h-full gap-6 p-3'}>
            <h2 className={'font-bold text-2xl text-center'}>사용자 정보 수정</h2>
            <div className="hidden">
              <input
                type={'text'}
                {...register('id')}
              />
              <input
                className={'rounded-lg md:h-[50px] p-2'}
                placeholder="Username"
                type={'text'}
                {...register('username')}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>
                이름
                {errors.name && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.name?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg w-[300px] md:h-[50px] p-2 text-black'}
                placeholder="Name"
                {...register('name')} //add name const registerSchema
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">
                이메일
                {errors.email && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.email?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                placeholder="Email"
                {...register('email')}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phoneNumber">
                전화번호
                {errors.phoneNumber && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.phoneNumber?.message}`}
                  </span>
                )}
              </label>
              <input
                className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                placeholder="Phone number"
                {...register('phoneNumber')}
              />
            </div>
            <Button disabled={isPending} variant={'primary'} type="submit" style={{ background:'var(--button-background)' }}>
              정보 수정
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserInfo
