import React, { useContext } from 'react'
import './RealTime.scss'
import { RealTimeProps, DroneStatusProps } from './RealTime.type'
import { useWarningCount } from './RealTimeHooks'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/statu.svg'
import { DRONE_POWER_V_THRESHOLD, DRONE_TEMPERATURE_C_THRESHOLD } from '../../common/Constants'

type RealTimeDroneProps = RealTimeProps & DroneStatusProps;

interface RealTimeStateTableProps {
  warningCount: number;
  DroneTemperature: number;
  DroneVoltage: number;
}

const RealTimeDroneStatus = (props: Pick<RealTimeDroneProps, 'WarningData' |'DroneTemperature'|'DroneVoltage'>) => {
  const { WarningData, DroneTemperature, DroneVoltage } = props
  const warningCount = WarningData?.warning_count || 0
  const sensorCounts = useWarningCount(WarningData)
  const { themeName } = useContext(SystemThemeContext)

  return (
    <div className='grid w-full h-full'>
      <div className='real-time-drone-status-wrapper w-full h-full grid'>
        {
          themeName === 'tft' &&
          <img className="vector-page vector-status absolute" alt="vector" src={SVG}/>
        }
        <span className='real-time-drone-header'>• 드론 상태 진단 현황</span>
        <span className='real-time-drone-header'>• 로그별 이상 발생 현황</span>
        <div className='real-time-drone-status-total-count'>
          <RealTimeStateTable warningCount={warningCount} DroneTemperature ={DroneTemperature} DroneVoltage={DroneVoltage} />
        </div>
        <div className='real-time-drone-status-sensor-count'>
          <RealTimeAnomalyTable sensorCounts={sensorCounts} />
        </div>
      </div>
    </div>
  )
}

export const RealTimeAnomalyTable = (props: { sensorCounts: any }) => {
  const { sensorCounts } = props

  const renderCountCircle = (count: number) => {
    const circleStyle = {
      //  0이면 정상(green)
      backgroundColor: count === 0 ? 'green' : 'red'
    }

    return <div className="circle" style={circleStyle}></div>
  }

  return (
    <div className='grid grid-row w-full h-full'>
      <div className='real-time-drone-status-total-sensor-table table-border w-full h-full grid'>
        <div className='real-time-drone-status-table-title table-design-top-left'> 기체 자세</div>
        <div className='real-time-drone-status-table-title border-left'> 자이로 센서</div>
        <div className='real-time-drone-status-table-title border-left'> 가속도 센서</div>
        <div className='real-time-drone-status-table-title border-left'> 지자기 센서</div>
        <div className='real-time-drone-status-table-title table-design-top-right border-left'> 진동 센서</div>

        <div className='real-time-drone-status-table-subtitle'> Roll</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> Pitch</div>
        <div className='real-time-drone-status-table-subtitle'> Yaw</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> X축</div>
        <div className='real-time-drone-status-table-subtitle'> Y축</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> Z축</div>
        <div className='real-time-drone-status-table-subtitle'> X축</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> Y축</div>
        <div className='real-time-drone-status-table-subtitle'> Z축</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> X축</div>
        <div className='real-time-drone-status-table-subtitle'> Y축</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> Z축</div>
        <div className='real-time-drone-status-table-subtitle'> X축</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'> Y축</div>
        <div className='real-time-drone-status-table-subtitle'> Z축</div>

        <div className='real-time-drone-status-table-value table-design-bottom-left'>{renderCountCircle(sensorCounts.roll)}</div>
        <div className='real-time-drone-status-table-value table-bottom-side'>{renderCountCircle(sensorCounts.pitch)}</div>
        <div className='real-time-drone-status-table-value'>{renderCountCircle(sensorCounts.yaw)}</div>

        <div className='real-time-drone-status-table-value table-bottom-side'>{renderCountCircle(sensorCounts.xgyro)}</div>
        <div className='real-time-drone-status-table-value'> {renderCountCircle(sensorCounts.ygyro)} </div>
        <div className='real-time-drone-status-table-value table-bottom-side'>{renderCountCircle(sensorCounts.zgyro)}</div>

        <div className='real-time-drone-status-table-value'>{renderCountCircle(sensorCounts.xacc)}</div>
        <div className='real-time-drone-status-table-value table-bottom-side'>{renderCountCircle(sensorCounts.yacc)}</div>
        <div className='real-time-drone-status-table-value'>{renderCountCircle(sensorCounts.zacc)}</div>

        <div className='real-time-drone-status-table-value table-bottom-side'>{renderCountCircle(sensorCounts.xmag)}</div>
        <div className='real-time-drone-status-table-value'> {renderCountCircle(sensorCounts.ymag)} </div>
        <div className='real-time-drone-status-table-value table-bottom-side'>{renderCountCircle(sensorCounts.zmag)}</div>

        <div className='real-time-drone-status-table-value'>{renderCountCircle(sensorCounts.vibx)}</div>
        <div className='real-time-drone-status-table-value table-bottom-side'> {renderCountCircle(sensorCounts.viby)} </div>
        <div className='real-time-drone-status-table-value table-design-bottom-right'>{renderCountCircle(sensorCounts.vibz)}</div>
      </div>
    </div>
  )
}

export default RealTimeDroneStatus

const RealTimeStateTable: React.FC<RealTimeStateTableProps> = (props) => {
  const renderTrafficLightCircle = (props:any) => {
    const { warningCount, DroneTemperature, DroneVoltage } = props
    const TemperatureStatus = (value : any) : boolean => value < DRONE_TEMPERATURE_C_THRESHOLD
    const VoltageStatus = (value : any) : boolean => value > DRONE_POWER_V_THRESHOLD

    const hasTempertureOrVoltageProblem = !(TemperatureStatus(DroneTemperature) && VoltageStatus(DroneVoltage))

    let NormalBackgroundColor = 'gray'
    let CauseBackgroundColor = 'gray'
    let DangerBackgroundColor = 'gray'

    // normal, caution, danger
    if (hasTempertureOrVoltageProblem) {
      DangerBackgroundColor = 'red'
    } else if (warningCount < 10) {
      NormalBackgroundColor = 'green'
    } else if (warningCount >= 10) {
      CauseBackgroundColor = 'orange'
    }


    return (
      <>
        <div className='real-time-drone-status-table-value table-design-bottom-left'>
          <div className="circle" style={{ backgroundColor: NormalBackgroundColor }}></div>
        </div>
        <div className='real-time-drone-status-table-value table-bottom-side'>
          <div className="circle" style={{ backgroundColor: CauseBackgroundColor }}></div>
        </div>
        <div className='real-time-drone-status-table-value table-design-bottom-right'>
          <div className="circle" style={{ backgroundColor: DangerBackgroundColor }}></div>
        </div>
      </>
    )
  }

  return (
    <div className='grid grid-row w-full h-full'>
      <div className='real-time-drone-status-total-count-table table-border w-full h-full grid'>
        <div className='real-time-drone-status-table-title table-design'>상태진단</div>
        <div className='real-time-drone-status-table-subtitle'>정상</div>
        <div className='real-time-drone-status-table-subtitle table-bottom-side'>주의</div>
        <div className='real-time-drone-status-table-subtitle'>위험</div>
        {renderTrafficLightCircle(props)}
      </div>
    </div>
  )
}
