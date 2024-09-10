import React, { useContext } from 'react'
import './RealTime.scss'
import {
  SensorData,
  RealTimeProps as Props,
} from './RealTime.type'
import { useSensorDisplay, useSensorTableData } from './RealTimeHooks'
import SVG from '../../../../resources/tft/sensor.svg'

import { SystemThemeContext } from '../../AppWrapper'

const RealTimeVibrationSensorTable: React.FC<Props> = (props) => {
  const { PredictData, RangeMax, RangeMin } = useSensorTableData(props.PredictData || ({} as SensorData), props.RangeMax || ({} as SensorData), props.RangeMin || ({} as SensorData))
  
  const xVib = useSensorDisplay(PredictData.vibration_x_VIBRATION_PREDICT, RangeMin.vibration_x_VIBRATION, RangeMax.vibration_x_VIBRATION)
  const yVib = useSensorDisplay(PredictData.vibration_y_VIBRATION_PREDICT, RangeMin.vibration_y_VIBRATION, RangeMax.vibration_y_VIBRATION)
  const zVib = useSensorDisplay(PredictData.vibration_z_VIBRATION_PREDICT, RangeMin.vibration_z_VIBRATION, RangeMax.vibration_z_VIBRATION)
  const { themeName } =useContext(SystemThemeContext)
  
  return (
    <div className="grid grid-row w-full h-full">
      <div className="real-time-drone-sensor-wrapper w-full h-full grid ">
        <span className=" real-time-drone-header">• 진동 센서 </span>
        {
          themeName === 'tft' &&
          <img className="vector-page vector-sensor absolute right-[110px] sensor-line-right" alt="vector" src={SVG}/>
        }
        <div className="real-time-drone-sensor-contents-left">
          <div className="real-time-drone-box-contents">
            <div>
              <span className="real-time-drone-box-contents-title">X축</span>
            </div>
            <div>
              <span className={`real-time-drone-box-contents-value ${xVib.className}`}>{xVib.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.vibration_x_VIBRATION} ~{' '}
                {RangeMax.vibration_x_VIBRATION}
              </span>
            </div>
          </div>
        </div>
        
        <div className="real-time-drone-sensor-contents-center">
          <div className="real-time-drone-box-contents">
            <div>
              <span className="real-time-drone-box-contents-title">Y축</span>
            </div>
            <div>
              <span className={`real-time-drone-box-contents-value ${yVib.className}`}>{yVib.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {' '}
                {RangeMin.vibration_y_VIBRATION} ~{' '}
                {RangeMax.vibration_y_VIBRATION}
              </span>
            </div>
          </div>
        </div>
        
        <div className="real-time-drone-sensor-contents-right">
          <div className="real-time-drone-box-contents">
            <div>
              <span className="real-time-drone-box-contents-title">Z축</span>
            </div>
            <div>
              <span className={`real-time-drone-box-contents-value ${zVib.className}`}>{zVib.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.vibration_z_VIBRATION} ~{' '}
                {RangeMax.vibration_z_VIBRATION}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default RealTimeVibrationSensorTable
