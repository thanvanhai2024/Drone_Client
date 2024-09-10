import React, { useContext } from 'react'
import { SystemThemeContext } from '../../AppWrapper'

interface PredictionServiceHeaderProps {
  mode?: 'realTime' | 'logData' | 'predResult' // Make mode optional
  setMode: (mode: 'realTime' | 'logData' | 'predResult') => void
}
export const PredictionServiceHeader: React.FC<PredictionServiceHeaderProps> = (props) => {
  const { mode = 'realTime', setMode } = props
  const { themeName }=useContext(SystemThemeContext)

  return (
    <>
      <div className={`predict-header ${themeName}`}>
        <header id='PredictionHeader' className='w-[99%]'>
          <div className='bg-[#1D1D41] m-2 p-1 rounded-lg text-[#6359E9] font-normal background-header'>
            {/*{props.mode === 'realTime'*/}
            {mode === 'realTime'
              ? <button className='bg-[#6359E9] text-white border-[#6359E9] border rounded-md ml-1 mr-4 p-1 px-2 background-btn-hover' >실시간 장애진단</button>
              : <button className='hover:bg-[#6359E9] hover:text-white border-[#6359E9] border rounded-md ml-1 mr-4 p-1 px-2 background-btn'
                onClick={() => props.setMode('realTime')}>실시간 장애진단</button>
            }

            {/*{props.mode === 'logData'*/}
            {mode === 'logData'
              ? <button className='bg-[#6359E9] text-white border-[#6359E9] border rounded-md mr-4 p-1 px-2 background-btn-hover' >로그데이터 조회</button>
              : <button className='hover:bg-[#6359E9] hover:text-white border-[#6359E9] border rounded-md mr-4 p-1 px-2 background-btn'
                onClick={() => props.setMode('logData')}>로그데이터 조회</button>
            }

            {/*{props.mode === 'predResult'*/}
            {mode === 'predResult'
              ? <button className='bg-[#6359E9] text-white border-[#6359E9] border rounded-md mr-4 p-1 px-2 background-btn-hover' >장애진단 예측결과 조회</button>
              : <button className='hover:bg-[#6359E9] hover:text-white border-[#6359E9] border rounded-md mr-4 p-1 px-2 background-btn'
                onClick={() => props.setMode('predResult')}>장애진단 예측결과 조회</button>
            }
          </div>

        </header>
      </div>
    </>
  )
}
