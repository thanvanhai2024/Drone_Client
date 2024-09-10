import React, { useContext } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MissionContext } from './components/MissionContext'


export const HeaderMenuItems = (props) => {
  const { setSubMode } = useContext(MissionContext)
  return (<div className="flex space-x-2 mb-3">
    {
      props.items.map(item => (
        <button key={item.mode} type="button"
          className={`text-white text-xl rounded-xl hover:bg-white hover:text-gray-900 w-10 h-10 
        ${props.mode === item.mode ? 'bg-[#6359E9]' : ''} ${props.mode === item.mode ? 'header-menu-tft' : ''}`}
          onClick={() => {
            props.setMode(item.mode)
            setSubMode(item.mode)
          }}>
          <FontAwesomeIcon icon={item.icon} alt="icon"/>
        </button>
      ))
    }
  </div>)
}
