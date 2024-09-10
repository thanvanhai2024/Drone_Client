import React, { useState, useContext } from 'react'
import { PredictionServiceHeader } from './Prediction/PredictionServiceHeader'
import { TFTPredictionServiceHeader } from './Prediction/TFTPredictionServiceHeader'
import RealTime from './RealTime/RealTime'
import LogDataSelect from './Log/LogDataSelect'
import { PredictionResultSelect } from './Prediction/PredictionResultSelect'
import { SystemThemeContext } from '../AppWrapper'

type Mode = 'realTime' | 'logData' | 'predResult'

export const RealtimeMonitoring: React.FC = () => {
  const [mode, setMode] = useState<Mode>('realTime')
  const { themeName } = useContext(SystemThemeContext)
  const [loading, setLoading] = useState(false)

  return (
    <div id='realtimemonitoring' className='h-[99%] w-full'>
      {themeName === 'tft' ? (
        <TFTPredictionServiceHeader mode={mode} setMode={setMode} />
      ) : (
        <PredictionServiceHeader mode={mode} setMode={setMode} />
      )}
      {mode === 'realTime' && <RealTime />}
      {mode === 'logData' && <LogDataSelect loading={loading} setLoading={setLoading} />}
      {mode === 'predResult' && <PredictionResultSelect loading={loading} setLoading={setLoading}/>}
    </div>
  )
}