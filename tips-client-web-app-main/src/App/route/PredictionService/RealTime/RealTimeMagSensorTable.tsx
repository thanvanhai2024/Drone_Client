import React, { useContext } from 'react'
import './RealTime.scss'
import {
  SensorData,
  RealTimeProps as Props,
} from './RealTime.type'
import { useSensorDisplay, useSensorTableData } from './RealTimeHooks'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/sensor.svg'


const RealTimeMagSensorTable: React.FC<Props> = (props) => {
  const { PredictData, RangeMax, RangeMin } = useSensorTableData(props.PredictData || ({} as SensorData), props.RangeMax || ({} as SensorData), props.RangeMin || ({} as SensorData))
  const xMag = useSensorDisplay(PredictData.xmag_RAW_IMU_PREDICT, RangeMin.xmag_RAW_IMU, RangeMax.xamg_RAW_IMU)
  const yMag = useSensorDisplay(PredictData.ymag_RAW_IMU_PREDICT, RangeMin.ymag_RAW_IMU, RangeMax.ymag_RAW_IMU)
  const zMag = useSensorDisplay(PredictData.zmag_RAW_IMU_PREDICT, RangeMin.zmag_RAW_IMU, RangeMax.zmag_RAW_IMU)
  const { themeName } =useContext(SystemThemeContext)
  
  return (
    <div className="grid grid-row w-full h-full">
      <div className="real-time-drone-sensor-wrapper w-full h-full grid ">
        <span className=" real-time-drone-header">• 지자계 센서 </span>
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
              <span className={`real-time-drone-box-contents-value ${xMag.className}`}>{xMag.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.xmag_RAW_IMU} ~ {RangeMax.xmag_RAW_IMU}
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
              <span className={`real-time-drone-box-contents-value ${yMag.className}`}>{yMag.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.ymag_RAW_IMU} ~ {RangeMax.ymag_RAW_IMU}
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
              <span className={`real-time-drone-box-contents-value ${zMag.className}`}>{zMag.value}</span>
            </div>
            <div>
              <span className="real-time-drone-box-contents-range">
                {RangeMin.zmag_RAW_IMU} ~ {RangeMax.zmag_RAW_IMU}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default RealTimeMagSensorTable
