import React, { useContext } from 'react'
import RealTimeDroneForm from './RealTimeDroneForm'
import RealTimeDroneStatus from './RealTimeDroneStatus'
import RealTimeDroneGraph from './RealTimeDroneGraph'
import RealTimePosition from './RealTimePosition'
import RealTimeGyroSensorTable from './RealTimeGyroSensorTable'
import RealTimeAccSensorTable from './RealTimeAccSensorTable'
import RealTimeMagSensorTable from './RealTimeMagSensorTable'
import RealTimeVibrationSensorTable from './RealTimeVibrationSensorTable'
import { SignalRContext } from '../../AppGCS/DroneRealtime/SignalRContainer'
import { DataMap } from '../components/DataMap'
import { SensorData, RealTimePageType } from './RealTime.type'
import { SystemThemeContext } from '../../AppWrapper'
import { useSubscribe } from '../../common/useRxjs'

const filterRangeMax = (SensorData: Record<string, any>) => {
  if (SensorData === null) {
    return
  }
  const THRESHOLD: Record<string, any> = DataMap.originalThreshold
  const rangeMax: Record<string, any> = {}
  DataMap.dependent_var.forEach(key => {
    rangeMax[key] = SensorData[key] + THRESHOLD[key]
  })
  return rangeMax
}

const filterRangeMin = (SensorData: Record<string, any>) => {
  if (SensorData === null) {
    return
  }
  const THRESHOLD: Record<string, any> = DataMap.originalThreshold
  const rangeMin: Record<string, any> = {}
  DataMap.dependent_var.forEach(key => {
    rangeMin[key] = SensorData[key] - THRESHOLD[key]
  })
  return rangeMin
}

const updateKeyObject = (object: Record<string, any>) => {
  const newObject = Object.entries(object).reduce((acc, [key]) => {
    const splitKey = key.split(/(?<=[a-z])(?=[A-Z])/)
    const keyObject = splitKey[0].toLowerCase() + '_' + splitKey[1]
    const firstKey = keyObject.split('_')[0]
    return key === 'WarningCount'
      ? { ...acc, warning_count: object[key] }
      : key.includes('ATTITUDEWARNING')
        ? { ...acc, [firstKey + '_ATTITUDE_WARNING']: object[key] }
        : key.includes('RAWIMUWARNING')
          ? { ...acc, [firstKey + '_RAW_IMU_WARNING']: object[key] }
          : key.includes('ATTITUDEPREDICT')
            ? { ...acc, [firstKey + '_ATTITUDE_PREDICT']: object[key] }
            : key.includes('RAWIMUPREDICT')
              ? { ...acc, [firstKey + '_RAW_IMU_PREDICT']: object[key] }
              : key.includes('VIBRATIONWARNING')
                ? {
                    ...acc,
                    [firstKey + '_' + keyObject.split('_')[1].charAt(0).toLowerCase() + '_VIBRATION_WARNING']:
                      object[key],
                  }
                : key.includes('VIBRATIONPRED')
                  ? {
                      ...acc,
                      [firstKey + '_' + keyObject.split('_')[1].charAt(0).toLowerCase() + '_VIBRATION_PREDICT']:
                        object[key],
                    }
                  : { ...acc }
  }, {})
  return newObject
}

const RealTime: React.FC = () => {
  const {
    droneListChanged,
    handleUpdateDroneSelectedId,
    selectedDroneId,
    setSelectedDroneId,
    selectedDroneStateObservable,
  } = useContext<RealTimePageType>(SignalRContext)
  const droneIds = droneListChanged.split('|')
  const [droneStateWithId] = useSubscribe(selectedDroneStateObservable)
  const droneState = droneStateWithId?.droneState
  const { themeName } = useContext(SystemThemeContext)

  const handleSelectDrone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setSelectedDroneId(value)
    handleUpdateDroneSelectedId(value)
  }
  // console.log(droneState)
  const PredictData = droneState?.PredictData ? updateKeyObject(droneState.PredictData) : {}
  const WarningData = droneState?.WarningData ? updateKeyObject(droneState.WarningData) : {}
  const DroneTemperature = droneState?.DroneRawState.TEMPERATURE_C
  const DroneVoltage = droneState?.DroneRawState.POWER_V
  const graphData = droneState?.DroneTrails
  const SensorData = {
    roll_ATTITUDE: droneState?.DroneTelemetry && droneState.DroneTelemetry?.attitude_roll,
    pitch_ATTITUDE: droneState?.DroneTelemetry && droneState.DroneTelemetry?.attitude_pitch,
    yaw_ATTITUDE: droneState?.DroneTelemetry && droneState.DroneTelemetry?.attitude_yaw,
    xacc_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_xacc,
    yacc_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_yacc,
    zacc_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_zacc,
    xgyro_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_xgyro,
    ygyro_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_ygyro,
    zgyro_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_zgyro,
    xmag_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_xmag,
    ymag_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_ymag,
    zmag_RAW_IMU: droneState?.DroneTelemetry && droneState.DroneTelemetry?.raw_imu_zmag,
    vibration_x_VIBRATION: droneState?.DroneTelemetry && droneState.DroneTelemetry?.vibration_vibration_x,
    vibration_y_VIBRATION: droneState?.DroneTelemetry && droneState.DroneTelemetry?.vibration_vibration_y,
    vibration_z_VIBRATION: droneState?.DroneTelemetry && droneState.DroneTelemetry?.vibration_vibration_z,
  }

  const RangeMax = (filterRangeMax(SensorData) as SensorData) || ({} as SensorData)
  const RangeMin = (filterRangeMin(SensorData) as SensorData) || ({} as SensorData)
  return (
    <div className={'real-time-drone'}>
      <div className="real-time-drone-button">
        <RealTimeDroneForm
          droneIds={droneIds}
          selectedValue={selectedDroneId}
          handleSelectedDrone={handleSelectDrone}
        />
      </div>
      <div id="real-time" className="real-time-page-wrapper w-full h-full grid gap-4">
        {/* <div className='real-time-drone-button'>
          <RealTimeDroneForm dataTransfer={dataTransfer}/>
        </div> */}
        {/*드론 상태 진단 현황*/}
        <div className="real-time-drone-status wrapper-border-radius">
          <RealTimeDroneStatus
            WarningData={WarningData}
            DroneTemperature={DroneTemperature}
            DroneVoltage={DroneVoltage}
          />
        </div>
        <div className="real-time-drone-height wrapper-border-radius">
          <RealTimeDroneGraph graphData={graphData} />
        </div>
        <div className="real-time-drone-position wrapper-border-radius">
          <RealTimePosition
            PredictData={PredictData}
            WarningData={WarningData}
            RangeMax={RangeMax}
            RangeMin={RangeMin}
          />
        </div>
        <div className="real-time-drone-gyro-sensor wrapper-border-radius">
          <RealTimeGyroSensorTable
            PredictData={PredictData}
            WarningData={WarningData}
            RangeMax={RangeMax}
            RangeMin={RangeMin}
          />
        </div>
        <div className="real-time-drone-acc-sensor  wrapper-border-radius">
          <RealTimeAccSensorTable
            PredictData={PredictData}
            WarningData={WarningData}
            RangeMax={RangeMax}
            RangeMin={RangeMin}
          />
        </div>
        <div className="real-time-drone-mag-sensor wrapper-border-radius">
          <RealTimeMagSensorTable
            PredictData={PredictData}
            WarningData={WarningData}
            RangeMax={RangeMax}
            RangeMin={RangeMin}
          />
        </div>
        <div className="real-time-drone-vib-sensor wrapper-border-radius">
          <RealTimeVibrationSensorTable
            PredictData={PredictData}
            WarningData={WarningData}
            RangeMax={RangeMax}
            RangeMin={RangeMin}
          />
        </div>
      </div>
    </div>
  )
}

export default RealTime
