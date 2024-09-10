import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { MissionContext } from '../components/MissionContext'
import DroneGauge from './DroneGauge'
import { FlightModeButton, FlightModeButtons } from './DroneTrackerComponents'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightArrowLeft,
  faArrowsLeftRightToLine,
  faLocationCrosshairs,
  faMapLocationDot,
  faMicrochip,
} from '@fortawesome/free-solid-svg-icons'
import { GCSPopover } from '../common/GCSPopover'
import { DroneLogger } from './DroneLogger'
import { DroneControlBar } from './DroneControlBar'
import moment from 'moment/moment'
import styled from 'styled-components'
import { NormalButton } from './DroneTracker'
import { useSubscribe } from '../../common/useRxjs'

const DroneGaugeComponent = styled.div`
  position: absolute;
  right: 60px;
  bottom: 80px;
  z-index: 30;
`

const TextLine = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`

const TextTitle = styled.div`
  color: #64cff6;
  min-width: 130px;
  max-width: 130px;
`

const TextValue = styled.div`
  color: #64cff6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TextInMap = props => (
  <TextLine>
    <TextTitle>{props.title}</TextTitle>
    <TextValue>{props.value}</TextValue>
  </TextLine>
)

export const inMapData = droneState => {
  const startTimeM = droneState.StartTime && moment(droneState.StartTime)
  const completeTimeM = droneState.CompleteTime && moment(droneState.CompleteTime)
  const startTime = startTimeM ? startTimeM.format('HH:mm:ss') : '-'
  const completeTime = completeTimeM ? completeTimeM.format('HH:mm:ss') : '-'
  const duration = startTimeM ? (completeTimeM || moment()).diff(startTimeM, 'seconds') : 0
  const durationStr = moment.utc(duration * 1000).format('mm:ss')
  const droneSpeed = parseFloat(droneState.DroneRawState?.DR_SPEED || 0)
  const TotalDistance = droneState.TotalDistance ? droneState.TotalDistance : 0
  const avgSpeed = parseFloat(startTimeM ? droneState.ElapsedDistance / duration : 0)
  const elapsedDistance = droneState.ElapsedDistance ? droneState.ElapsedDistance.toFixed(2) : 0
  // const remainDistance = droneState.RemainDistance
  //   ? droneState.RemainDistance.toFixed(2)
  //   : 0
  const remainDistance = TotalDistance - elapsedDistance
  return [
    {
      name: '전체 이동거리',
      value: `${(TotalDistance / 1000).toFixed(3)} km`,
    },
    {
      name: '현재 비행거리',
      value: `${(elapsedDistance / 1000).toFixed(3)} km`,
    },
    {
      name: '잔여 비행거리',
      value: `${(remainDistance / 1000).toFixed(3)} km`,
    },
    {
      name: '현재 이동속도',
      value: `${droneSpeed.toFixed(3)} m/s`,
    },
    { name: '평균 이동속도', value: `${avgSpeed?.toFixed(3)} m/s` },
    {
      name: '이륙 시작시간',
      value: startTime,
    },
    {
      name: '비행 소요시간',
      value: durationStr,
    },
    { name: '비행 완료시간', value: completeTime },
  ]
}

export const FlightModeUI = ({ toggleSide, toggleLeftSide, toggleDisplayMapsAsMain }) => {
  const {
    selectedDroneId,
    droneDeliveryInfos,
    sendCameraDirectionalCommand,
    sendCameraZoomCommand,
    setGotoHereMode,
    gotoHereMode,
    handleUpdateDronelogMsg,
    handleSendDroneMissionStart,
    handleSendDroneChangeFlightModeCommand,
    handleSendDroneFlightCommand,
    handleDoSetServoHigh,
    handleDoSetServoLow,
    handleAutoMissionStart,
    selectedDroneStateObservable,
  } = useContext(SignalRContext)

  const [droneState] = useSubscribe(selectedDroneStateObservable)

  const { gotoHereLocation } = useContext(MissionContext)

  const guidedFlightMode = droneState?.droneState?.DroneRawState?.FLIGHT_MODE === 4

  const [isDoubleCheck, setIsDoubleCheck] = useState(false)
  const [doubleCheckMsg, setDoubleCheckMsg] = useState()
  const [doubleCheckFunc, setDoubleCheckFunc] = useState()

  const autoMissionStartBtn = () => {
    handleSendDroneChangeFlightModeCommand(4) // change mode to guided

    setTimeout(() => {
      handleAutoMissionStart()
    }, 1000) // 2초(2000ms) 후에 실행
  }

  const handleDoubleCheck = (msg, func) => {
    setDoubleCheckMsg(msg)
    setDoubleCheckFunc(func)
    setIsDoubleCheck(true)
  }

  const doubleCheck = () => {
    doubleCheckFunc()
    setIsDoubleCheck(false)
  }

  const DoubleCheckModal = useCallback(() => {
    return (
      <>
        <div className={'absolute top-80 left-44 flex flex-col justify-center items-center h-[100px] w-[300px] z-50 rounded-xl bg-blue-600'}>

          <div className={'flex flex-col justify-center items-center h-[60%] w-full'}>
            <span className={'flex text-lg'}>{doubleCheckMsg} 요청을 보냅니다.</span>
          </div>

          <div className={'flex justify-center items-center h-[40%] w-full bg-blue-400 rounded-b-xl'}>
            <button className={'flex justify-center w-[50px] mr-2 px-1 py-0.5 rounded-xl border hover:text-blue-600 hover:border-blue-600'} onClick={doubleCheck}>
              확인
            </button>
            <button className={'flex justify-center w-[50px] ml-2 px-1 py-0.5 rounded-xl border hover:text-red-500 hover:border-red-500'} onClick={() => setIsDoubleCheck(false)}>
              취소
            </button>
          </div>

        </div>
      </>
    )
  }, [doubleCheckFunc])

  return (
    <>
      <DroneGaugeComponent>
        <DroneGauge droneState={(droneState?.droneState || {}).DroneRawState}/>
      </DroneGaugeComponent>
      <FlightModeButtons/>

      <div
        className="absolute bg-black opacity-70 rounded-lg shadown right-[60px] top-[50px] z-10 flex flex-col w-[250px] p-2 text-lg">
        {inMapData(droneState?.droneState || {}, droneDeliveryInfos[selectedDroneId] || {}).map(line => (
          <TextInMap key={line.name} title={line.name} value={line.value} />
        ))}
      </div>
      <div className="absolute top-[60px] right-[10px] z-20 flex flex-col space-y-2">
        <button
          className="w-[40px] h-[40px] border-none bg-white text-black faArrowsLeftRightToLine"
          onClick={toggleSide}>
          <FontAwesomeIcon className="text-lg" icon={faArrowsLeftRightToLine} alt="expanse" />
        </button>

        <button
          className="w-[40px] h-[40px] border-none bg-white text-black faArrowRightArrowLeft"
          onClick={toggleDisplayMapsAsMain}>
          <FontAwesomeIcon className="text-lg" icon={faArrowRightArrowLeft} alt="expanse" />
        </button>
      </div>

      <DroneSensor />

      <div className="absolute top-[100px] left-[10px] z-20 flex flex-col space-y-2">
        <button className="w-[40px] h-[40px] border-none bg-white text-black" onClick={toggleLeftSide}>
          <FontAwesomeIcon className="text-lg" icon={faArrowsLeftRightToLine} alt="expanse" />
        </button>
        <GCSPopover
          className="z-30"
          content={<GotoHereAltitudeInputContent guidedFlightMode={guidedFlightMode} />}
          open={gotoHereMode && gotoHereLocation}>
          <button
            className={'w-[40px] h-[40px] border-none bg-white text-black'}
            onClick={() => {
              if (guidedFlightMode) {
                setGotoHereMode(old => !old)
              } else {
                let message = 'GoToHere is fail. Please Check FlightMode'
                handleUpdateDronelogMsg(selectedDroneId, message, 3)
              }
            }}>
            <FontAwesomeIcon className={`text-lg ${gotoHereMode ? 'text-yellow-400' : ''}`} icon={faMapLocationDot} />
          </button>
        </GCSPopover>

        <DroneLogger />

        <FixDroneCenter />

        <FlightModeButton onClick={() => handleDoubleCheck('Mission Start', () => autoMissionStartBtn)}> Mission Start </FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('Resume', () => (() => handleSendDroneChangeFlightModeCommand(3)))}> Resume </FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('Brake', () => (() => handleSendDroneChangeFlightModeCommand(17)))}>Brake</FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('RTL', () => (() => handleSendDroneChangeFlightModeCommand(6)))}>RTL</FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('Smart-RTL', () => (() => handleSendDroneChangeFlightModeCommand(21)))}>Smart-RTL</FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('Land', () => (() => handleSendDroneChangeFlightModeCommand(9)))}>Land</FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('Servo-High', () => (() => handleDoSetServoHigh()))}>Servo-High</FlightModeButton>
        <FlightModeButton onClick={() => handleDoubleCheck('Servo-Low', () => (() => handleDoSetServoLow()))}>Servo-Low</FlightModeButton>
      </div>

      <DroneControlBar
        sendCameraDirectionalCommand={sendCameraDirectionalCommand}
        sendCameraZoomCommand={sendCameraZoomCommand}
      />

      {isDoubleCheck === true
        ? <DoubleCheckModal/>
        : null
      }
    </>
  )
}

const FixDroneCenter = () => {
  const { fixDroneMap, setFixDroneMap } = useContext(SignalRContext)

  return (
    <>
      <button
        className="w-[40px] h-[40px] border-none bg-white faLocationCrosshairs"
        onClick={() => {
          setFixDroneMap(old => !old)
        }}>
        <FontAwesomeIcon
          className="text-lg"
          icon={faLocationCrosshairs}
          fade={fixDroneMap}
          style={{ color: fixDroneMap ? 'red' : 'black' }}
        />
      </button>
    </>
  )
}

const DroneSensor = () => {
  const { selectedDroneStateObservable } = useContext(SignalRContext)
  const [droneStateWithId] = useSubscribe(selectedDroneStateObservable)
  const droneState = droneStateWithId?.droneState

  return (
    <GCSPopover
      className="absolute top-[10px] left-[180px] z-30 "
      content={
        <div className="w-[350px] bg-white overflow-y-auto p-2 min-h-[200px] relative top-1 text-black">
          {(droneState?.DroneRawState?.SENSOR_STATUSES || []).map((sensor, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {sensor.Name}({sensor.Enabled ? 'ON' : 'OFF'})
              </span>
              {/*<span>{sensor.Health ? '정상' : '비정상'}</span>*/}
              <span className={sensor.Health ? 'text-green-500' : 'text-red-500'}>
                {sensor.Health ? '정상' : '비정상'}
              </span>
            </div>
          ))}
        </div>
      }>
      <button className="w-[40px] h-[40px] border-none bg-white text-black">
        <FontAwesomeIcon icon={faMicrochip} className="text-lg" />
      </button>
    </GCSPopover>
  )
}

const GotoHereAltitudeInputContent = ({ guidedFlightMode }) => {
  const {
    handleSendGotoHere,
    selectedDroneId,
    setGotoHereMode,
    gotoherealtitude,
    setGotoHereAltitude,
    handleUpdateDronelogMsg,
  } = useContext(SignalRContext)
  const { gotoHereLocation } = useContext(MissionContext)

  useEffect(() => {
    console.log(gotoherealtitude)
  }, [gotoherealtitude])

  const handlesetaltitude = useCallback(
    e => {
      setGotoHereAltitude(e.target.value)
    },
    [setGotoHereAltitude],
  )

  return (
    <div className="flex flex-col p-2 space-y-2 w-32 absolute left-12 top-[3em] rounded bg-white text-black">
      <input
        className="w-full rounded border-solid border-gray-400 border-[1px] h-8"
        placeholder="Altitude"
        value={gotoherealtitude}
        onChange={e => handlesetaltitude(e)}
      />
      <NormalButton
        onClick={() => {
          if (!gotoHereLocation) {
            let message = 'GoToHere is fail. Please check GoToHere Location'
            handleUpdateDronelogMsg(selectedDroneId, message, 3)
          } else if (!gotoherealtitude) {
            let message = 'GoToHere is fail. Please check GoToHere Altitude'
            handleUpdateDronelogMsg(selectedDroneId, message, 3)
          } else if (!guidedFlightMode) {
            let message = 'GoToHere is fail. Please change to "Guided" mode'
            handleUpdateDronelogMsg(selectedDroneId, message, 3)
          } else {
            handleSendGotoHere(gotoHereLocation.lat, gotoHereLocation.lng, gotoherealtitude)
            setGotoHereMode(false)
          }
        }}>
        Go To
      </NormalButton>
    </div>
  )
}