import React, { useContext } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { SystemThemeContext } from '../AppWrapper'

import tab1Active from '../../../resources/tft/tab1.svg'
import tab1Inactive from '../../../resources/tft/tab1inactive.svg'
import tab2Active from '../../../resources/tft/activetap.svg'
import tab2Inactive from '../../../resources/tft/tab_next.svg'
import './TFTMediaWrapper.scss'


const MediaWrapper = (props:any) => {
  const { themeName } = useContext(SystemThemeContext)
  const classNames=`bg-[#1D1D41] h-[50px] rounded-lg text-[#6359E9] flex flex-row items-center px-3 font-normal ${themeName} background`
  const location = useLocation()
  const isActive = (path : any) => location.pathname === path

  return (
    <div className="w-full h-full grid grid-rows-[50px_auto] gap-2">
      <div className={classNames}>
        <Link to="/image-processing" className="flex flex-col items-center justify-center text-center ">
          <img
            className="w-full"
            alt="이미지 분석"
            src={isActive('/image-processing') ? tab1Active : tab1Inactive}
          />
          <b className="absolute text-white">이미지 분석</b>
        </Link>

        <Link to="/video-analysis" className="flex flex-col items-center justify-center text-center mx-[-35px]">
          <img
            className="w-full"
            alt="영상 분석"
            src={isActive('/video-analysis') ? tab2Active : tab2Inactive}
          />
          <b className="absolute text-white">영상 분석</b>
        </Link>

        <Link to="/realtime-monitor-multi" className="flex flex-col items-center justify-center text-center">
          <img
            className="w-full"
            alt="멀티 실시간 모니터링"
            src={isActive('/realtime-monitor-multi') ? tab2Active : tab2Inactive}
          />
          <b className="absolute text-white">실시간 모니터링</b>
        </Link>
      </div>
      <Outlet />
    </div>
  )

}


export default MediaWrapper
