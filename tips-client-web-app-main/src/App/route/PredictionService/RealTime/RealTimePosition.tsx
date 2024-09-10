import React, { useContext } from 'react'
import './RealTime.scss'
import {
  SensorData,
  RealTimeProps as Props,
} from './RealTime.type'
import { useSensorDisplay, useSensorTableData } from './RealTimeHooks'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/VectorShort.svg'

const RealTimePosition: React.FC<Props> = (props) => {
  const { PredictData, RangeMax, RangeMin } = useSensorTableData(props.PredictData || ({} as SensorData), props.RangeMax || ({} as SensorData), props.RangeMin || ({} as SensorData))
  const roll = useSensorDisplay(PredictData.roll_ATTITUDE_PREDICT, RangeMin.roll_ATTITUDE, RangeMax.roll_ATTITUDE)
  const pitch = useSensorDisplay(PredictData.pitch_ATTITUDE_PREDICT, RangeMin.pitch_ATTITUDE, RangeMax.pitch_ATTITUDE )
  const yaw = useSensorDisplay(PredictData.yaw_ATTITUDE_PREDICT, RangeMin.yaw_ATTITUDE, RangeMax.yaw_ATTITUDE)
  const { themeName } =useContext(SystemThemeContext)
 
  if (themeName === 'tft') {
    return (
      <div className="grid grid-row w-full h-full">
        <div className="real-time-drone-position-wrapper w-full h-full grid">
          <span className=" real-time-drone-header">• 기체 자세 </span>
          <div className="real-time-drone-position-top">
            <img className='vector-page vector-pos-sensor pos-sensor' alt='vector' src={SVG}/>
            <div className="real-time-drone-box-contents-position">
              <div>
                <span className="real-time-drone-box-contents-title">Roll</span>
              </div>
              <div>
                <span className={`real-time-drone-box-contents-value ${roll.className}`}>{roll.value}</span>
              </div>
              <div>
                <span className="real-time-drone-box-contents-range-position">
                  {RangeMin.roll_ATTITUDE} ~ {RangeMax.roll_ATTITUDE}
                </span>
              </div>
            </div>
          </div>
          
          <div className="real-time-drone-position-middle pos-gap">
            <div className="real-time-drone-box-contents-position">
              <div>
                <span className="real-time-drone-box-contents-title">Pitch</span>
              </div>
              <div>
                <span className={`real-time-drone-box-contents-value ${pitch.className}`}>{pitch.value}</span>
              </div>
              <div>
                <span className="real-time-drone-box-contents-range-position">
                  {RangeMin.pitch_ATTITUDE} ~ {RangeMax.pitch_ATTITUDE}
                </span>
              </div>
            </div>
          </div>
          
          <div className="real-time-drone-position-bottom">
            <div className="real-time-drone-box-contents-position">
              <div>
                <span className="real-time-drone-box-contents-title">Yaw</span>
              </div>
              <div>
                <span className={`real-time-drone-box-contents-value ${yaw.className}`}>{yaw.value}</span>
              </div>
              <div>
                <span className="real-time-drone-box-contents-range-position">
                  {RangeMin.yaw_ATTITUDE} ~ {RangeMax.yaw_ATTITUDE}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="grid grid-row w-full h-full">
        <div className="real-time-drone-position-wrapper w-full h-full grid">
          <span className=" real-time-drone-header">• 기체 자세 </span>
          <div className="real-time-drone-position-top">
            <div className="real-time-drone-box-contents-position">
              <div>
                <span className="real-time-drone-box-contents-title">Roll</span>
              </div>
              <div>
                <span className={`real-time-drone-box-contents-value ${roll.className}`}>{roll.value}</span>
              </div>
              <div>
                <span className="real-time-drone-box-contents-range-position">
                  {RangeMin.roll_ATTITUDE} ~ {RangeMax.roll_ATTITUDE}
                </span>
              </div>
            </div>
          </div>
          <div className="real-time-drone-position-middle">
            <div className="real-time-drone-box-contents-position">
              <div>
                <span className="real-time-drone-box-contents-title">Pitch</span>
              </div>
              <div>
                <span className={`real-time-drone-box-contents-value ${pitch.className}`}>{pitch.value}</span>
              </div>
              <div>
                <span className="real-time-drone-box-contents-range-position">
                  {RangeMin.pitch_ATTITUDE} ~ {RangeMax.pitch_ATTITUDE}
                </span>
              </div>
            </div>
          </div>
          <div className="real-time-drone-position-bottom">
            <div className="real-time-drone-box-contents-position">
              <div>
                <span className="real-time-drone-box-contents-title">Yaw</span>
              </div>
              <div>
                <span className={`real-time-drone-box-contents-value ${yaw.className}`}>{yaw.value}</span>
              </div>
              <div>
                <span className="real-time-drone-box-contents-range-position">
                  {RangeMin.yaw_ATTITUDE} ~ {RangeMax.yaw_ATTITUDE}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default RealTimePosition
