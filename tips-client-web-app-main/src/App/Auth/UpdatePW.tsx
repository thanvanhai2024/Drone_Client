import { zodResolver } from '@hookform/resolvers/zod'
import React, { useContext, useEffect, useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { object, string, TypeOf } from 'zod'
import { AUTH_SERVICE_URL } from '../route/common/path'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import useUserStore from '../store'
import { axiosCredentials } from './AuthorizedRoute'
import { SystemThemeContext } from '../route/AppWrapper'

const modifyPasswordSchema = object({
  id: string().min(1),
  username: string().min(1, 'Username is required').max(100),
  currentPassword : string().min(1, 'Current password is required'),
  newPassword: string()
    .min(1, 'New password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  newPasswordConfirm: string().min(1, 'Please confirm your new password'),

}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  path: ['newPasswordConfirm'],
  message: 'New passwords do not match',
})

export type PasswordInput = TypeOf<typeof modifyPasswordSchema>

const UpdatePW = () => {
  const { authUser } = useUserStore(state => state)
  const [isPending, startTransition] = useTransition()
  const { themeName } = useContext(SystemThemeContext)

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const showPasswordToggle = () => setShowPassword(!showPassword)

  const onUpdatePW = async (passwordInput: PasswordInput) => {
    axiosCredentials.put(`${AUTH_SERVICE_URL}/api/user/update-password`, { ...passwordInput })
      .then((response) => {
        console.log(response)
        toast.success(`${response.data.message}`)
        console.log(`Successfully register ${response.data?.username}!`, {
          type: 'success',
        })
      })
      .catch((error) => {
        console.log(passwordInput)
        console.log(`Failed to update new password with error ${error}!`, {
          type: 'error',
        })

      })
  }

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = useForm<PasswordInput>({
    resolver: zodResolver(modifyPasswordSchema),
    defaultValues: {
      id: authUser?.id,
      username: authUser?.username
    }
  })

  useEffect(() => {
    console.log('UpdatePW.tsx')
    if (isSubmitSuccessful) {
      reset()
    }
  }, [isSubmitSuccessful, reset])

  const onSubmitHandler: SubmitHandler<PasswordInput> = (values) => {
    startTransition(() => {
      onUpdatePW(values)
    })
  }
  
  if (themeName === 'tips') {
    return (
      <div className={'flex flex-col items-center justify-center backdrop-blur-lg bg-white/10 rounded-3xl'}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={'flex flex-col w-full h-full gap-6 p-3'}>
            <h2 className={'font-bold text-2xl text-center'}>비밀번호 수정</h2>
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
                비밀번호
                {errors.currentPassword && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.currentPassword?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                  placeholder="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('currentPassword')}
                />
                <div className={'absolute ml-[270px]'}>
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
                {errors.newPassword && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.newPassword?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                  placeholder="New Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword')}
                />
                <div
                  className={'absolute ml-[270px]'}>
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
                {errors.newPasswordConfirm && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.newPasswordConfirm?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                  placeholder="New Password Confirm"
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPasswordConfirm')}
                />
                <div
                  className={'absolute ml-[270px]'}>
                  {showPassword ?
                    <EyeOff className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                    :
                    <Eye className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                  }
                </div>
              </div>
            </div>
            <Button type="submit" variant={'primary'} disabled={isPending} >비밀번호 변경</Button>
          </div>
        </form>
      </div>
    )
  } else {
    return (
      <div className={'flex flex-col items-center justify-center backdrop-blur-lg bg-white/10 rounded-3xl w-[350px] mt-[-80px]'}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={'flex flex-col w-full h-full gap-6 p-3'}>
            <h2 className={'font-bold text-2xl text-center'}>비밀번호 수정</h2>
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
                비밀번호
                {errors.currentPassword && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.currentPassword?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-[300px] md:h-[50px] p-2 text-black'}
                  placeholder="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('currentPassword')}
                />
                <div className={'absolute ml-[270px]'}>
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
                {errors.newPassword && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.newPassword?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                  placeholder="New Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword')}
                />
                <div
                  className={'absolute ml-[270px]'}>
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
                {errors.newPasswordConfirm && (
                  <span className="text-red-500 text-sm text-center">
                    {` ${errors.newPasswordConfirm?.message}!`}
                  </span>
                )}
              </label>
              <div className={'flex items-center'}>
                <input
                  className={'rounded-lg w-full md:h-[50px] p-2 text-black'}
                  placeholder="New Password Confirm"
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPasswordConfirm')}
                />
                <div
                  className={'absolute ml-[270px]'}>
                  {showPassword ?
                    <EyeOff className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                    :
                    <Eye className={'text-gray-500 p-1'} onClick={showPasswordToggle}/>
                  }
                </div>
              </div>
            </div>
            <Button type="submit" variant={'primary'} disabled={isPending} style={{ background:'var(--button-background)' }}>비밀번호 변경</Button>
          </div>
        </form>
      </div>
    )
  }
}

export default UpdatePW
