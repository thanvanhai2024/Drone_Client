import React, { useContext } from 'react'
import { SystemThemeContext } from '../../AppWrapper'

import tab1Active from '../../../../resources/tft/tab1.svg'
import tab1Inactive from '../../../../resources/tft/tab1inactive.svg'
import tab2Active from '../../../../resources/tft/activetap.svg'
import tab2Inactive from '../../../../resources/tft/tab_next.svg'
import '../../MediaProcessing/TFTMediaWrapper.scss'

interface PredictionServiceHeaderProps {
  mode?: 'realTime' | 'logData' | 'predResult' // Make mode optional
  setMode: (mode: 'realTime' | 'logData' | 'predResult') => void
}

export const TFTPredictionServiceHeader: React.FC<PredictionServiceHeaderProps> = (props) => {
  const { mode = 'realTime', setMode } = props
  const { themeName } = useContext(SystemThemeContext)
  const classNames = `predict-header ${themeName}`
  
  return (
    <div className={classNames}>
      <header id='PredictionHeader' className='w-[99%]'>
        <div className='bg-[#1D1D41] m-1 p-1 rounded-lg text-[#6359E9] font-normal background-header flex flex-row items-center'>
          <button className={`flex flex-col items-center justify-center text-center${mode === 'realTime' ? 'active-btn' : 'inactive-btn'}`}
            onClick={() => setMode('realTime')}>
            <img className='w-full' alt='실시간 장애진단' src={mode === 'realTime' ? tab1Active : tab1Inactive}/>
            <b className="absolute text-white">실시간 장애진단</b>
          </button>
          <button className={`flex flex-col items-center justify-center text-center mx-[-35px] ${mode === 'logData' ? 'active-btn' : 'inactive-btn'}`}
            onClick={() => setMode('logData')}>
            <img className='w-full' alt='로그데이터 조회' src={mode === 'logData' ? tab2Active : tab2Inactive}/>
            <b className="absolute text-white">로그데이터 조회</b>
          </button>
          <button className={`flex flex-col items-center justify-center text-center ${mode === 'predResult' ? 'active-btn' : 'inactive-btn'}`}
            onClick={() => setMode('predResult')}>
            <img className='w-full' alt='장애진단 예측결과 조회' src={mode === 'predResult' ? tab2Active : tab2Inactive}/>
            <b className="absolute text-white">장애진단 예측결과 조회</b>
          </button>
        </div>
      </header>
    </div>
  )
}
