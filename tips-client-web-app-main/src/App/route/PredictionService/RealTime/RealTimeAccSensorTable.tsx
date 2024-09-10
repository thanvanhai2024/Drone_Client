import React, { useContext } from 'react'
import './RealTime.scss'
import {
  RealTimeProps as Props,
  SensorData,
} from './RealTime.type'
import { useSensorDisplay, useSensorTableData } from './RealTimeHooks'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/sensor.svg'


const RealTimeAccSensorTable: React.FC<Props> = (props) => {
  const { PredictData, RangeMax, RangeMin } = useSensorTableData(props.PredictData || ({} as SensorData), props.RangeMax || ({} as SensorData), props.RangeMin || ({} as SensorData))
  const xAcc = useSensorDisplay(PredictData.xacc_RAW_IMU_PREDICT, RangeMin.xacc_RAW_IMU, RangeMax.xacc_RAW_IMU)
  const yAcc = useSensorDisplay(PredictData.yacc_RAW_IMU_PREDICT, RangeMin.yacc_RAW_IMU, RangeMax.yacc_RAW_IMU)
  const zAcc = useSensorDisplay(PredictData.zacc_RAW_IMU_PREDICT, RangeMin.zacc_RAW_IMU, RangeMax.zacc_RAW_IMU)
  const { themeName } =useContext(SystemThemeContext)
  
  return (
    <div className="grid grid-row w-full h-full">
      <div className="real-time-drone-sensor-wrapper w-full h-full grid">
        <span className="real-time-drone-header">• 가속도계 센서 </span>
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
              <span className={`real-time-drone-box-contents-value ${xAcc.className}`}>{xAcc.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.xacc_RAW_IMU} ~ {RangeMax.xacc_RAW_IMU}
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
              <span className={`real-time-drone-box-contents-value ${yAcc.className}`}>{yAcc.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.yacc_RAW_IMU} ~ {RangeMax.yacc_RAW_IMU}
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
              <span className={`real-time-drone-box-contents-value ${zAcc.className}`}>{zAcc.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.zacc_RAW_IMU} ~ {RangeMax.zacc_RAW_IMU}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RealTimeAccSensorTable
