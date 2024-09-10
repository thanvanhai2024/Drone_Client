import React, { useContext, useMemo, useState } from 'react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { SystemThemeContext } from '../../AppWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCaretDown, faSquareCaretUp } from '@fortawesome/free-solid-svg-icons'
import { DroneDirectionalControlBar, FlightCommandButton } from './DroneTrackerComponents'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import { MEDIA_SERVICE_URL } from '../../common/path'
import { toast } from 'react-toastify'
import { buildError } from '../../common/ErrorMessage'
import { useSubscribe } from '../../common/useRxjs'

export const DroneControlBar = () => {
  const [show, setShow] = useState(false)
  const { baseDroneStatesObservable, selectedDroneId, handleSendDroneFlightCommand, handleSendDroneMissionStart, handleSendDroneArmingMotor }: any =
    useContext(SignalRContext)
  const { themeName } = useContext(SystemThemeContext)

  const [droneStates] = useSubscribe(baseDroneStatesObservable, {})

  const videoUrl1 = useMemo(() => droneStates[selectedDroneId]?.CameraURL1, [droneStates, selectedDroneId])

  return (
    <div className={`absolute bottom-0 left-1/2 flex space-x-4 z-30 -translate-x-1/2 w-[615px] ${themeName}`}>
      {show ? (
        <>
          <div className="flex flex-col space-y-4 w-[100px]">
            <FlightCommandButton
              onClick={() => {
                handleSendDroneArmingMotor()
              }}>
              Arm
            </FlightCommandButton>
            <FlightCommandButton onClick={() => handleSendDroneFlightCommand('takeOff')}>Take Off</FlightCommandButton>
            <FlightCommandButton onClick={handleSendDroneMissionStart}>Mission Start</FlightCommandButton>
          </div>
          <DroneDirectionalControlBar />

          <div className="flex flex-col space-y-4 w-[100px]">
            <FlightCommandButton onClick={() => handleSendDroneFlightCommand('disArm')}>Dis-Arm</FlightCommandButton>
            <FlightCommandButton onClick={() => handleSendDroneFlightCommand('land')}>Land</FlightCommandButton>
          </div>
        </>
      ) : null}
      <button
        className="absolute bottom-1 text-white text-xl left-1/2 transform -translate-x-full m-0"
        onClick={() => {
          setShow(old => !old)
        }}>
        <FontAwesomeIcon icon={show ? faSquareCaretDown : faSquareCaretUp} />
      </button>
    </div>
  )
}
