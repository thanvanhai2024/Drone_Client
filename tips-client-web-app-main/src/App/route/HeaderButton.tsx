import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { PiSignOutBold } from 'react-icons/pi'
import { FaHome } from 'react-icons/fa'
import { AuthProvider } from '../Auth/Auth'

export default function HeaderButton() {
  const controls = useAnimation()
  const controlText = useAnimation()
  const navigate = useNavigate()

  const headerBtn = [
    {
      title: 'Home',
      icon: FaHome,
      action: () => window.location.replace(window.location.origin),
    },
    {
      title: 'Logout',
      icon: PiSignOutBold,
      action: () => AuthProvider.signOut(),
    },
  ]

  return (
    <div className='fixed top-0 right-0 flex items-center p-2 shadow-md'>
      {headerBtn.map((item, index) => (
        <motion.div
          key={index}
          className='flex items-center cursor-pointer hover:bg-[#6359E9] top-header-btn'
          onClick={item.action ? item.action : undefined}
          animate={controls}
        >
          <item.icon className='text-lg m-1'/>
          {/*<motion.p animate={controlText} className='ml-2'>{item.title}</motion.p>*/}

        </motion.div>
      ))}

    </div>
  )
}
