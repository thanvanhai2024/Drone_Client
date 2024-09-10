import React, { useContext, useEffect, useState } from 'react'
import './Prediction.scss'
import { SystemThemeContext } from '../../AppWrapper'
import { toast } from 'react-toastify'
import { CollapsibleComponentForPredict } from '../components/CollapsibleComponentForPredict'


interface SelectData {
  [key: string]: number;
}

//이게 최종
interface SelectData2 {
  [key: string]: SelectData;
}

interface GraphDataItem {
  SelectData: SelectData
}

interface LogChartGraphOptionProps {
  tableTransfer: (data: {
    DroneId: string,
    PredictTime: string,
    PredictData: string,
    SelectData: string,
    SensorData: string
  }[]) => void
  data: SelectData2[]
  graphData: GraphDataItem[]
  finalDataTransfer: (data: { [key: string]: any }) => void //SelectData2 대신 적음
  setSelectedLog: (setSelectedLog: string[]) => void
  transfer: any
}

const PredictResultSelectOption: React.FC<LogChartGraphOptionProps> = (props) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(['default value'])
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>(['attitudeRoll'])
  const { themeName } = useContext(SystemThemeContext)
  // const MAX_CHECKBOXES = 2

  const handleCheckboxChange = (value: string) => {
    setSelectedCheckboxes([value])
    logSelectedData(value)
    props.setSelectedLog([value])
    props.transfer(value)
    // transfer(value)

    // const updatedCheckboxes = selectedCheckboxes.includes(value)
    //   ? selectedCheckboxes.filter((checkbox) => checkbox !== value)
    //   : [...selectedCheckboxes, value]
    // if (updatedCheckboxes.length > MAX_CHECKBOXES) {
    //   // message.error(`최대 ${MAX_CHECKBOXES}개까지만 선택할 수 있습니다.`)
    //   toast.error(`최대 ${MAX_CHECKBOXES}개까지만 선택할 수 있습니다.`)
    // } else {
    //   setSelectedCheckboxes(updatedCheckboxes)
    //   console.log(`Checkbox with value ${value} is checked. Updated checkboxes: `, updatedCheckboxes)
    //   logSelectedData(value)
    // }
  }

  const transfer = (part: string) => {
    console.log('pred select option, parsing data : graph', part)

    //parsing graphData
    props.finalDataTransfer(props.data.map((obj: any) => {
      return {
        'PredictTime': obj['PredictTime'],
        'PredictData': obj['PredictData'][`${part}_PREDICT`],
        'SelectData': obj['SensorData'][`${part}`],
      }
    }))

    //parsing tableData
    props.tableTransfer(props.data.map((obj: any) => {
      console.log('table data inf predict select option', part)
      return {
        'DroneId': obj['DroneId'],
        'PredictTime': obj['PredictTime'],
        'PredictData': obj['PredictData'][`${part}_PREDICT`],
        'SelectData': obj['SensorData'][part],
        'SensorData': obj['SensorData']
      } //as PredictPageItem
    }))
  }

  const getCheckboxesForGroup = (group: string) => {
    const firstGraphData = props.graphData
    const allCheckboxes = firstGraphData ? Object.keys(firstGraphData) : []
    if (group === 'Attitude') {
      return ['attitudeRoll', 'attitudePitch', 'attitudeYaw']
    }
    if (group === 'Acc') {
      return ['rawImuXacc', 'rawImuYacc', 'rawImuZacc']
    }
    if (group === 'Gyro') {
      return ['rawImuXgyro', 'rawImuYgyro', 'rawImuZgyro']
    }
    if (group === 'Mag') {
      return ['rawImuXmag', 'rawImuYmag', 'rawImuZmag']
    }
    if (group === 'Vibration') {
      return ['vibrationVibrationX', 'vibrationVibrationY', 'vibrationVibrationZ']
    }
    // if (group === 'SENSOR_OFFSETS') {
    //   return ['sensorOffsetsAccelCalX', 'sensorOffsetsAccelCalY', 'sensorOffsetsAccelCalZ', 'sensorOffsetsMagOfsX', 'sensorOffsetsMagOfsY']
    // }
    // if (group === 'POSITION_INT') {
    //   return ['globalPositionIntVx', 'globalPositionIntVy']
    // }
    // if (group === 'POSITION_NED') {
    //   return ['localPositionNedX', 'localPositionNedVx', 'localPositionNedVy']
    // }
    // if (group === 'CONTROLLER_OUTPUT') {
    //   return ['navControllerOutputNavBearing', 'navControllerOutputNavPitch']
    // }
    // if (group === 'SERVO_OUTPUT_RAW') {
    //   return ['servoOutputRawServo3Raw', 'servoOutputRawServo8Raw']
    // }
    // if (group === 'STATUS / PRESSURE') {
    //   return ['powerStatusVservo', 'batteryStatusVoltages1', 'scaledPressurePressAbs']
    // }
    // if (group === 'HUD') {
    //   return ['vfrHudAirspeed', 'vfrHudGroundspeed']
    // }
    // if (group === 'RC Channels') {
    //   return ['rcChannelsChancount', 'rcChannelsChan12Raw', 'rcChannelsChan13Raw', 'rcChannelsChan14Raw', 'rcChannelsChan15Raw', 'rcChannelsChan16Raw']
    // }

    return allCheckboxes
  }

  const isCheckboxDisabled = (value: string) => {}

  const logSelectedData = (selectedCheckbox: string) => {
    const selectedData = props.graphData.find((item) => item.SelectData[selectedCheckbox] !== undefined)

    if (selectedData) {
      console.log(`Data for ${selectedCheckbox}:`, selectedData.SelectData[selectedCheckbox])
    } else {
      console.log(`No data found for ${selectedCheckbox}`)
    }
  }

  console.log('graphData', props.graphData)

  const className = `prediction-graph-option-wrapper w-full h-full ${themeName}`

  const checkboxGroups = [
    'Attitude',
    'Acc',
    'Gyro',
    'Mag',
    'Vibration',
    // 장애진단 서버에서 예측하지 않는 값들 주석 처리
    // 'SENSOR_OFFSETS',
    // 'POSITION_INT',
    // 'POSITION_NED',
    // 'CONTROLLER_OUTPUT',
    // 'SERVO_OUTPUT_RAW',
    // 'STATUS / PRESSURE',
    // 'HUD',
    // 'RC Channels',
  ]

  // console.log('data', props.data) //여기서 데이터가 다 넘오는 것까지 확인. 여기서 만든 데이터를 가지고 파싱해서 그래프, 테이블로 보내주어야함
  // //컴포넌트로 만드는 경우
  // const ButtonsComponent: React.FC<any> = () => {
  //   const transfer = (part: string) => {
  //     console.log('pred select option, parsing data : graph', part)
  //
  //     //parsing graphData
  //     props.finalDataTransfer(props.data.map((obj: any) => {
  //       return {
  //         'PredictTime': obj['PredictTime'],
  //         'PredictData': obj['PredictData'][`${part}_PREDICT`],
  //         'SelectData': obj['SensorData'][`${part}`],
  //       }
  //     }))
  //
  //     //parsing tableData
  //     props.tableTransfer(props.data.map((obj: any) => {
  //       console.log('table data inf predict select option', part)
  //       return {
  //         'DroneId': obj['DroneId'],
  //         'PredictTime': obj['PredictTime'],
  //         'PredictData': obj['PredictData'][`${part}_PREDICT`],
  //         'SelectData': obj['SensorData'][part],
  //         'SensorData': obj['SensorData']
  //       } //as PredictPageItem
  //     }))
  //   }

  //   return (
  //     <div className="button-container flex flex-row">
  //       {selectedCheckboxes.map((part: string, number: number) => {
  //         console.log('select check box', part)
  //         return (
  //           <button key={number} onClick={() => transfer(part)}>
  //             {part}
  //           </button>
  //         )
  //       })}
  //     </div>
  //   )
  // }

  return (
    <div className={className}>
      <span className='log-chart-graph-header'>• 로그 선택</span>

      {/*<div className='prediction-graph-option-select2 wrapper-border-radius p'>*/}
      {/*  <ButtonsComponent data={props.data} finalDataTransfer={props.finalDataTransfer}*/}
      {/*    tableDataTansfer={props.tableTransfer} selectedCheckboxes={selectedCheckboxes}/>*/}
      {/*</div>*/}

      <div className='log-chart-graph-option-select border border-[#1F42A9] wrapper-border-radius'>
        {checkboxGroups.map((group, index) => (
          <CollapsibleComponentForPredict
            group={group}
            key={index}
            getCheckboxesForGroup={getCheckboxesForGroup}
            selectedCheckboxes={selectedCheckboxes}
            handleCheckboxChange={handleCheckboxChange}
            isCheckboxDisabled={isCheckboxDisabled}
          >
          </CollapsibleComponentForPredict>))
        }

        {/*<Collapse accordion key="checkboxGroups" className=''>*/}
        {/*  {checkboxGroups.map((group, index) => (*/}
        {/*    <Panel key={index} header={group} className='collapse-panel-custom '>*/}
        {/*      <div className='log-chart-graph-option-select-space '>*/}
        {/*        {getCheckboxesForGroup(group).map((checkbox) => (*/}
        {/*          <label className='log-chart-graph-option-check-space' key={checkbox}>*/}
        {/*            <input*/}
        {/*              type='checkbox'*/}
        {/*              className='log-chart-graph-option-label-space '*/}
        {/*              checked={selectedCheckboxes.includes(checkbox)}*/}
        {/*              onChange={() => handleCheckboxChange(checkbox)}*/}
        {/*              disabled={isCheckboxDisabled(checkbox)}*/}
        {/*            />*/}
        {/*            {checkbox}*/}
        {/*          </label>*/}
        {/*        ))}*/}
        {/*      </div>*/}
        {/*    </Panel>*/}
        {/*  ))}*/}
        {/*</Collapse>*/}

      </div>
    </div>
  )
}

export default PredictResultSelectOption
