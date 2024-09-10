import UpdatePW from './UpdatePW'
import React from 'react'
import UserInfo from './UserInfo'

const UserInfoPage = () => {
  return (
    <div className={'flex-1 flex h-[99%] items-center justify-center'}>
      <div className={'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6'}>
        <UserInfo />
        <UpdatePW />
      </div>
    </div>
  )
}

export default UserInfoPage