import React from 'react'
import { ColorThema } from '../components/ProjectTema'
import { SensorData, RealTimeProps as Props, transformPropsObject } from './RealTime.type'


export const RealTimeBoardRight : React.FC<Props> = (props) => {
  // function transformPropsObject(obj: SensorData): Record<string, string | number> {

  //   function transformValue(value: any): string | number {
  //     if (typeof value === 'number') {
  //       return value.toExponential(2)
  //     }
  //     return value
  //   }

  // const transformedObject = {}
  //const transformedObject: Record<string, string | number> = {}

  // for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //         const value = obj[key]
  //         if (typeof value === 'number') {
  //             transformedObject[key] = value.toExponential(2)
  //         } else {
  //             // 숫자가 아닌 경우 그대로 할당
  //             transformedObject[key] = value
  //         }
  //     }
  // }
  // for (const key in obj) {
  //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //         const value = obj[key]
  //         if (typeof value === 'number') {
  //             transformedObject[key] = value.toExponential(2)
  //         } else {
  //             transformedObject[key] = value
  //         }
  //     }
  // }

  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       transformedObject[key] = transformValue(obj[key])
  //     }
  //   }

  //   return transformedObject
  // }

  const PredictData = transformPropsObject(props.PredictData || {} as SensorData)
  const RangeMax = transformPropsObject(props.RangeMax || {} as SensorData)
  const RangeMin = transformPropsObject(props.RangeMin || {} as SensorData)
  const WarningData = transformPropsObject(props.WarningData || {} as SensorData)


  // function transformPropsObject(obj) {
  //     const transformedObject = {}
  //
  //     for (const key in obj) {
  //         if (obj.hasOwnProperty(key)) {
  //             const value = obj[key]
  //             if (typeof value === 'number') {
  //                 transformedObject[key] = value.toExponential(2)
  //             } else {
  //                 // 숫자가 아닌 경우 그대로 할당
  //                 transformedObject[key] = value
  //             }
  //         }
  //     }
  //
  //     return transformedObject
  // }
  //
  // const PredictData = transformPropsObject(props.PredictData || {})
  // const RangeMax = transformPropsObject(props.RangeMax || {})
  // const RangeMin = transformPropsObject(props.RangeMin || {})
  // const WarningData = transformPropsObject(props.WarningData || {})


  return(
    <div className="flex flex-col h-full w-full">
      <div className="flex  flex-col w-full h-full">
        <div className={`flex flex-col w-full h-full p-3 mb-4 rounded-2xl ${ColorThema.Secondary4}`}>
          <span className="text-white rounded-md ml-3 font-bold text-medium">• 가속도 센서 </span>
          <div className="flex flex-row justify-around h-full p-5">
            <div className={`flex flex-col justify-around mr-4 w-full  h-full rounded-md ${ColorThema.Secondary2}`}>
              <span className="ml-5">X축</span>
              <span className={`mx-auto font-extrabold text-2xl ${WarningData.xacc_RAW_IMU?'text-[#8FE388]':'text-[#FFFF00]'}`}>{PredictData.xacc_RAW_IMU_PREDICT}</span>
              <span className="mx-auto">{RangeMin.xacc_RAW_IMU} ~ {RangeMax.xacc_RAW_IMU}</span>
            </div>
            <div className={`flex flex-col justify-around  mr-4 w-full h-full rounded-md ${ColorThema.Secondary2}`}>
              <span className="ml-5">Y축</span>
              <span className={`mx-auto font-extrabold text-2xl ${WarningData.yacc_RAW_IMU?'text-[#8FE388]':'text-[#FFFF00]'}`}>{PredictData.yacc_RAW_IMU_PREDICT}</span>
              <span className="mx-auto">{RangeMin.yacc_RAW_IMU} ~ {RangeMax.yacc_RAW_IMU}</span>
            </div>
            <div className={`flex flex-col justify-around w-full  h-full rounded-md ${ColorThema.Secondary2}`}>
              <span className="ml-5">Z축</span>
              <span className={`mx-auto font-extrabold text-2xl ${WarningData.acc_RAW_IMU?'text-[#8FE388]':'text-[#FFFF00]'}`}>{PredictData.zacc_RAW_IMU_PREDICT}</span>
              <span className="mx-auto">{RangeMin.zacc_RAW_IMU} ~ {RangeMax.acc_RAW_IMU}</span>
            </div>
          </div>
        </div>

        <div className={`flex flex-col w-full h-full p-3 rounded-2xl ${ColorThema.Secondary4}`}>
          <span className="text-white rounded-md ml-3 font-bold text-medium">• 진동 센서 </span>
          <div className="flex flex-row justify-around h-full p-5">
            <div className={`flex flex-col justify-around mr-4 w-full  h-full rounded-md ${ColorThema.Secondary2}`}>
              <span className="ml-5">X축</span>
              <span className={`mx-auto font-extrabold text-2xl ${WarningData.vibration_x_VIBRATION?'text-[#8FE388]':'text-[#FFFF00]'}`}>{PredictData.vibration_x_VIBRATION_PREDICT}</span>
              <span className="mx-auto">{RangeMin.vibration_x_VIBRATION} ~ {RangeMax.vibration_x_VIBRATION}</span>
            </div>
            <div className={`flex flex-col justify-around  mr-4 w-full h-full rounded-md ${ColorThema.Secondary2}`}>
              <span className="ml-5">Y축</span>
              <span className={`mx-auto font-extrabold text-2xl ${WarningData.vibration_y_VIBRATION?'text-[#8FE388]':'text-[#FFFF00]'}`}>{PredictData.vibration_y_VIBRATION_PREDICT}</span>
              <span className="mx-auto">{RangeMin.vibration_y_VIBRATION} ~ {RangeMax.vibration_y_VIBRATION}</span>
            </div>
            <div className={`flex flex-col justify-around w-full  h-full rounded-md ${ColorThema.Secondary2}`}>
              <span className="ml-5">Z축</span>
              <span className={`mx-auto font-extrabold text-2xl ${WarningData.vibration_z_VIBRATION?'text-[#8FE388]':'text-[#FFFF00]'}`}>{PredictData.vibration_z_VIBRATION_PREDICT}</span>
              <span className="mx-auto">{RangeMin.vibration_z_VIBRATION} ~ {RangeMax.vibration_z_VIBRATION}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
