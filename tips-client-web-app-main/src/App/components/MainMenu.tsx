import React, { useState, useEffect, useCallback, } from 'react'
import TranslationToggle from '../../locale/Translation'

import { MdFeedback } from 'react-icons/md'

import { motion, useAnimation } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { TbHeartRateMonitor } from 'react-icons/tb'
import { GiArtificialIntelligence } from 'react-icons/gi'
import { RxDashboard } from 'react-icons/rx'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { BiMenu } from 'react-icons/bi'


export default function MainMenu() {
  const [active, setActive] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState(() => {
    return sessionStorage.getItem('activeMenuItem') || '/dashboard'
  })

  const controls = useAnimation()
  const controlText = useAnimation()
  const controlTitleText = useAnimation()
  const navigate = useNavigate()

  const mainMenu = [
    {
      name: '대시보드',
      icon: RxDashboard,
      link: '/dashboard',
    },
    {
      name: '드론관제',
      icon: HiOutlineLocationMarker,
      link: '/drone-monitor',
    },
    {
      name: '장애진단',
      icon: TbHeartRateMonitor,
      link: '/realtime-monitoring',
    },
    {
      name: '디블러링',
      icon: GiArtificialIntelligence,
      link: '/image-processing',
    },
  ]

  const dataFooter = [
    {
      name: '',
      items: [
        {
          title: 'UserInfo',
          icon: MdFeedback,
          action: () => navigate('/auth/user-info'),

        },
        // {
        //   title: 'Logout',
        //   icon: PiSignOutBold,
        //   action: () => AuthProvider.signOut(),
        // },
      ]
    },
  ]

  const showMore = useCallback(() => {
    controls.start({
      width: '215px',
      transition: { duration: 0.001 }
    })
    controlText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 }
    })
    controlTitleText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 }
    })

    setActive(true)
  }, [controlText, controlTitleText, controls])

  const showLess = useCallback(() => {
    controls.start({
      width: '60px',
      transition: { duration: 0.001 }
    })

    controlText.start({
      opacity: 0,
      display: 'none',
    })

    controlTitleText.start({
      opacity: 0,
      display: 'none',
    })

    setActive(false)
  }, [controlText, controlTitleText, controls])

  const handleMenuClick = (link: any) => {
    setActiveMenuItem(link)
    sessionStorage.setItem('activeMenuItem', link)
  }
  useEffect(() => {
    if (active) {
      showMore()
    } else {
      showLess()
    }

  }, [active, showLess, showMore])

  return (
    <motion.div animate={controls}
      className='app-menu animate duration-300 flex-col rounded-r-3xl shadow-xl py-10 h-full'>
      <div className={'menu-top flex-row'}>
        <div className="mx-3 w-[2.1rem] p-1 rounded-md bg-[#333353] hover:bg-[#6359E9] cursor-pointer background-btn-app-menu"
          onClick={active ? showLess : showMore}><BiMenu size={26}/></div>
        <div className={'flex items-center'}>
          {active
            ? <div className="flex mx-4 mt-3 mb-8 text-4xl overflow-hidden">GAION</div>
            : null}
          {active
            ? null
            : <div className="flex mx-4 mt-3 mb-8 text-4xl overflow-hidden">G</div>}

        </div>
        <div className='grow font-normal'>
          {
            mainMenu.map((group, index) => (
              <div key={index} className='mx-3 mt-3 rounded-md bg-[#333353] hover:bg-[#6359E9] background-btn-app-menu'>
                <Link to={group.link} className='block'>
                  <div className={`flex flex-row items-center h-[40px] p-2 ${
                    activeMenuItem === group.link ? 'rounded-md bg-[#6359E9] background-btn-app-menu-active' : ''
                  }`}
                  onClick={() => handleMenuClick(group.link)}>
                    <group.icon className='text-lg'/>
                    <motion.p animate={controlTitleText} className='ml-4 text-sm '>
                      {group.name}
                    </motion.p>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
      <div className="my-10 p-5">
        <hr className={'border-[#4B4B99]'}/>
      </div>
      <div className="menu-footer font-normal">
        <TranslationToggle isMenuExpanded={active}/>
        {dataFooter.map((group, index) => (
          <div key={index} className='mx-3 mt- rounded'>
            <motion.p animate={controlTitleText} className='ml-2 text-lg'>{group.name}</motion.p>
            {group.items.map((item, index2) => (
              <div key={index2} className='mb-3'>
                <div className="flex px-1 py-1 items-center h-[40px] rounded-md bg-[#333353] hover:bg-[#6359E9] text-btn background-btn-app-menu"
                  onClick={item.action ? item.action : undefined}>
                  <item.icon className='text-lg m-1'/>
                  <motion.p animate={controlText} className='ml-4 pt-0.5 text-sm cursor-pointer'>{item.title}</motion.p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
