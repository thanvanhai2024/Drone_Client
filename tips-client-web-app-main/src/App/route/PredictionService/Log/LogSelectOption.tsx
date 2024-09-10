import React, { useCallback, useContext, useEffect, useState } from 'react'
import './Log.scss'
import { SystemThemeContext } from '../../AppWrapper'
import { toast } from 'react-toastify'
import { CollapsibleComponent } from '../components/CollapsibleComponent'


interface SelectData {
  [key: string]: number
}

interface GraphDataItem {
  SelectData: SelectData
}

interface LogChartGraphOptionProps {
  graphData: GraphDataItem[]
  // graphData : SensorData
  onSelectedCheckboxesChange: (newSelectedCheckboxes: any[]) => void
}

interface CheckBoxCellProps {
  label: string
  isChecked: boolean
  onChange: () => void
}

const LogSelectOption: React.FC<LogChartGraphOptionProps> = (props) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(['default value'])
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>(['attitudeRoll', 'attitudePitch', 'attitudeYaw'])
  const { themeName } = useContext(SystemThemeContext)

  useEffect(() => {
    props.onSelectedCheckboxesChange(selectedCheckboxes)
  }, [selectedCheckboxes, props])

  const MAX_CHECKBOXES = 5

  const handlePanelChange = (keys: string | string[]) => {
    setActiveKey(keys)
  }

  const handleCheckboxChange = (value: string) => {
    const updatedCheckboxes = selectedCheckboxes.includes(value)
      ? selectedCheckboxes.filter((checkbox) => checkbox !== value)
      : [...selectedCheckboxes, value]

    if (updatedCheckboxes.length > MAX_CHECKBOXES) {
      // message.error(`최대 ${MAX_CHECKBOXES}개까지만 선택할 수 있습니다.`)
      toast.error(`최대 ${MAX_CHECKBOXES}개까지만 선택할 수 있습니다.`)
    } else {
      setSelectedCheckboxes(updatedCheckboxes)
      console.log(`Checkbox with value ${value} is checked. Updated checkboxes: `, updatedCheckboxes)
      // props.onSelectedCheckboxesChange(updatedCheckboxes)
      logSelectedData(value)
    }
  }


  const generateCheckboxPanel = (groups: string[]) => {
    // console.log('check', groups)
    return (
      <>
        {groups.map((group, index) => (
          <CollapsibleComponent
            group={group}
            key={index}
            getCheckboxesForGroup={getCheckboxesForGroup}
            selectedCheckboxes={selectedCheckboxes}
            handleCheckboxChange={handleCheckboxChange}
            isCheckboxDisabled={isCheckboxDisabled}
          >
          </CollapsibleComponent>))
        }
      </>
    )
  }

  const getCheckboxesForGroup = useCallback((group: string) => {
    const firstGraphData = props.graphData[0]
    const allCheckboxes = firstGraphData ? Object.keys(firstGraphData.SelectData) : []
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
    if (group === 'SENSOR_OFFSETS') {
      return ['sensorOffsetsAccelCalX', 'sensorOffsetsAccelCalY', 'sensorOffsetsAccelCalZ', 'sensorOffsetsMagOfsX', 'sensorOffsetsMagOfsY']
    }
    if (group === 'POSITION_INT') {
      return ['globalPositionIntVx', 'globalPositionIntVy']
    }
    if (group === 'POSITION_NED') {
      return ['localPositionNedX', 'localPositionNedVx', 'localPositionNedVy']
    }
    if (group === 'CONTROLLER_OUTPUT') {
      return ['navControllerOutputNavBearing', 'navControllerOutputNavPitch']
    }
    if (group === 'SERVO_OUTPUT_RAW') {
      return ['servoOutputRawServo3Raw', 'servoOutputRawServo8Raw']
    }
    if (group === 'STATUS / PRESSURE') {
      return ['powerStatusVservo', 'batteryStatusVoltages1', 'scaledPressurePressAbs']
    }
    if (group === 'HUD') {
      return ['vfrHudAirspeed', 'vfrHudGroundspeed']
    }
    if (group === 'RC Channels') {
      return ['rcChannelsChancount', 'rcChannelsChan12Raw', 'rcChannelsChan13Raw', 'rcChannelsChan14Raw', 'rcChannelsChan15Raw', 'rcChannelsChan16Raw']
    }

    return allCheckboxes
  }, [props.graphData])



  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Selected Checkboxes:', selectedCheckboxes)
  }

  const isCheckboxDisabled = (value: string) => {
    return selectedCheckboxes.length === MAX_CHECKBOXES && !selectedCheckboxes.includes(value)
  }

  const logSelectedData = (selectedCheckbox: string) => {
    const selectedData = props.graphData.find((item) => item.SelectData[selectedCheckbox] !== undefined)

    if (selectedData) {
      console.log(`Data for ${selectedCheckbox}:`, selectedData.SelectData[selectedCheckbox])
    } else {
      console.log(`No data found for ${selectedCheckbox}`)
    }
  }

  const chartObj = {
    data: props.graphData
  }
  console.log('graphData', chartObj)
  const checkboxGroups = [
    'Attitude',
    'Acc',
    'Gyro',
    'Mag',
    'Vibration',
    'SENSOR_OFFSETS',
    'POSITION_INT',
    'POSITION_NED',
    'CONTROLLER_OUTPUT',
    'SERVO_OUTPUT_RAW',
    'STATUS / PRESSURE',
    'HUD',
    'RC Channels',
  ]
  return (
    <div className='log-chart-graph-option-wrapper w-full h-full'>
      <span className='log-chart-graph-header'>• 로그 선택</span>

      <div className='h-[80%] log-chart-graph-option-select wrapper-border-radius'>
        {/*{generateCheckboxPanel('기본')}*/}
        {generateCheckboxPanel(checkboxGroups)}
      </div>
    </div>
  )
}

export default LogSelectOption
