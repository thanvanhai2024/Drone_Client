import React, { useContext } from 'react'
import './RealTime.scss'
import { useSensorDisplay, useSensorTableData } from './RealTimeHooks'
import {
  SensorData,
  RealTimeProps as Props,
} from './RealTime.type'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/sensor.svg'

const RealTimeGyroSensorTable: React.FC<Props> = (props) => {
  const { PredictData, RangeMax, RangeMin } = useSensorTableData(props.PredictData || ({} as SensorData), props.RangeMax || ({} as SensorData), props.RangeMin || ({} as SensorData))
  const xGyro = useSensorDisplay(PredictData.xgyro_RAW_IMU_PREDICT, RangeMin.xgyro_RAW_IMU, RangeMax.xgyro_RAW_IMU)
  const yGyro = useSensorDisplay(PredictData.ygyro_RAW_IMU_PREDICT, RangeMin.ygyro_RAW_IMU, RangeMax.ygyro_RAW_IMU)
  const zGyro = useSensorDisplay(PredictData.zgyro_RAW_IMU_PREDICT, RangeMin.zgyro_RAW_IMU, RangeMax.zgyro_RAW_IMU)
  const { themeName } =useContext(SystemThemeContext)
  
  return (
    <div className="grid grid-row w-full h-full">
      <div className="real-time-drone-sensor-wrapper w-full h-full grid ">
        <span className=" real-time-drone-header">• 자이로 센서 </span>
        {
          themeName === 'tft' &&
          <img className="vector-page vector-sensor absolute left-[400px] sensor-line-left" alt="vector" src={SVG}/>
        }
        <div className="real-time-drone-sensor-contents-left">
          <div className="real-time-drone-box-contents">
            <div>
              <span className="real-time-drone-box-contents-title">X축</span>
            </div>
            <div>
              <span className={`real-time-drone-box-contents-value ${xGyro.className}`}>{xGyro.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.xgyro_RAW_IMU} ~ {RangeMax.xgyro_RAW_IMU}
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
              <span className={`real-time-drone-box-contents-value ${yGyro.className}`}>{yGyro.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.ygyro_RAW_IMU} ~ {RangeMax.ygyro_RAW_IMU}
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
              <span className={`real-time-drone-box-contents-value ${zGyro.className}`}>{zGyro.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.zgyro_RAW_IMU} ~ {RangeMax.zgyro_RAW_IMU}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default RealTimeGyroSensorTable
