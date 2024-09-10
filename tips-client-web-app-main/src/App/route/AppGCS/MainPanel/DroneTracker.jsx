import React, { useContext, useRef, useReducer } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faArrowUpFromBracket, faCirclePlus, faCrosshairs, faTurnDown } from '@fortawesome/free-solid-svg-icons'
import { GCSPopover } from '../common/GCSPopover'
import { MissionContext, MissionState } from '../components/MissionContext'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { AltitudeChart } from '../RightPanel/RightPanelCommonComponent'
import MissionMenuComponents from '../common/MissionMenuComponents'
import { DeliveryMissionListModal } from './DeliveryMissionListModal'
import { SystemThemeContext } from '../../AppWrapper'
import { FlightModeUI, inMapData, TextInMap } from './FlightModeUI'
import { useSubscribe } from '../../common/useRxjs'

const DroneTrackerDiv = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const DroneTracker = ({
  DroneMapsCmp,
  VideoPlayer,
  mode,
  toggleSide,
  toggleLeftSide,
  displayMapsAsMain,
  toggleDisplayMapsAsMain,
}) => {
  return (
    <DroneTrackerDiv>
      {mode === 'flight' ? (
        <FlightModeUI
          toggleSide={toggleSide}
          toggleLeftSide={toggleLeftSide}
          displayMapsAsMain={displayMapsAsMain}
          toggleDisplayMapsAsMain={toggleDisplayMapsAsMain}
        />
      ) : (
        <MissionModeUI />
      )}
      <div className="w-full h-full">{displayMapsAsMain ? DroneMapsCmp : VideoPlayer}</div>
    </DroneTrackerDiv>
  )
}

const MissionModePlanButton = React.forwardRef(
  ({ icon, label, selected, disabled, onClick, themeName, ...props }, ref) => (
    <button
      ref={ref}
      className={`h-11 w-full border-none m-0 flex flex-col items-center p-2 ${
        selected ? (themeName === 'tft' ? 'bg-[#1F42A9] text-white' : 'bg-[#7575bf]') : ''
      } ${disabled ? 'opacity-50' : ''}`}
      onClick={e => {
        if (!disabled && onClick) {
          onClick(e)
        }
      }}
      {...props}>
      <FontAwesomeIcon className="text-lg" icon={icon} alt={label} />
      <label className="text-xs">{label}</label>
    </button>
  ),
)

const MissionModeUI = () => {
  const fileRef = useRef()
  const centerRef = useRef()
  const {
    currentState,
    addTakeoff,
    addingWaypointMode,
    addReturnPoint,
    setAddingWaypointMode,
    missionItems,
    ggWaypointss,
    setDragWaypointMode,
  } = useContext(MissionContext)

  const { selectedDroneStateObservable } = useContext(SignalRContext)
  const [ds] = useSubscribe(selectedDroneStateObservable)
  const droneState = ds?.droneState
  const { themeName } = useContext(SystemThemeContext)

  const [isDeliveryMissionListModal, toogleIsDeliveryMissionListModal] = useReducer(
    isDeliveryMissionListModal => !isDeliveryMissionListModal,
    false,
  )

  return (
    <>
      <MissionMenuComponents topOffset={100} zIndex={20} label="Plan">
        <GCSPopover
          className="z-30 relative"
          content={<FileMenuContent toogleIsDeliveryMissionListModal={toogleIsDeliveryMissionListModal} />}>
          <MissionModePlanButton
            onClick={() => {
              setAddingWaypointMode(false)
              setDragWaypointMode(false)
            }}
            ref={fileRef}
            icon={faFile}
            label="File"
          />
        </GCSPopover>
        <MissionModePlanButton
          icon={faArrowUpFromBracket}
          label="Takeoff"
          disabled={currentState !== MissionState.TAKEOFF}
          onClick={() => {
            addTakeoff()
            setAddingWaypointMode(old => !old)
          }}
        />
        <MissionModePlanButton
          icon={faCirclePlus}
          label="Waypoint"
          themeName={themeName}
          selected={addingWaypointMode}
          disabled={currentState !== MissionState.WAYPOINT}
          onClick={() => {
            setAddingWaypointMode(old => !old)
            setDragWaypointMode(old => !old)
          }}
        />
        <MissionModePlanButton
          icon={faTurnDown}
          label="Return"
          disabled={currentState !== MissionState.WAYPOINT}
          onClick={() => {
            addReturnPoint()
            setAddingWaypointMode(false)
            setDragWaypointMode(false)
          }}
        />
        <GCSPopover className="z-30" content={<CenterMenuContent />}>
          <MissionModePlanButton
            onClick={() => {
              setAddingWaypointMode(false)
              setDragWaypointMode(false)
            }}
            ref={centerRef}
            icon={faCrosshairs}
            label="Center"
          />
        </GCSPopover>
      </MissionMenuComponents>

      <div className="absolute bg-black opacity-70 rounded-lg shadown right-[60px] top-[30px] z-10 flex flex-col w-[250px] p-2 text-lg">
        {inMapData(droneState || {}).map(line => (
          <TextInMap key={line.name} title={line.name} value={line.value} />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 z-20 w-[calc(100%-64px)] py-2 pl-2 opacity-70">
        {/*<div className="bg-sidebar-bg rounded-lg w-full">*/}
        <div className="bg-black rounded-lg w-full ml-1">
          <AltitudeChart missionItems={missionItems} ggWaypointss={ggWaypointss} />
        </div>
      </div>
      <div className="absolute top-[10%] left-[6%] z-20 py-2 pl-2">
        {isDeliveryMissionListModal && (
          <DeliveryMissionListModal toogleIsDeliveryMissionListModal={toogleIsDeliveryMissionListModal} />
        )}
      </div>
    </>
  )
}

const CenterMenuContent = () => {
  const { setMapsCenterOn } = useContext(MissionContext)
  const { themeName } = useContext(SystemThemeContext)

  return (
    <div className="absolute flex flex-col items-center p-2 space-y-2 bottom-[-30px] left-[60px] bg-white rounded">
      <NormalButton className="w-full" themeName={themeName} onClick={() => setMapsCenterOn('mission')}>
        Mission
      </NormalButton>
      <NormalButton className="w-full" themeName={themeName} onClick={() => setMapsCenterOn('launch')}>
        Launch
      </NormalButton>
      <NormalButton className="w-full" themeName={themeName} onClick={() => setMapsCenterOn('vehicle')}>
        Vehicle
      </NormalButton>
    </div>
  )
}

const FileMenuContent = props => {
  const { createNewMission, missionItems, downloadMission, handleLoadMission, removeallWaypoint } =
    useContext(MissionContext)
  const { handleSendMission, handleDownloadMission, handleSaveMission, handleClearMavMission } =
    useContext(SignalRContext)
  const filePickerRef = useRef()
  const { themeName } = useContext(SystemThemeContext)

  return (
    <div className="rounded-lg bg-white p-2 absolute left-12 top-[-4em]">
      <div className="mb-2">
        <div>Create New Mission</div>
        <div className="border-t-[1px] border-gray-400 border-solid h-[1px] pb-1" />
        <NormalButton themeName={themeName} onClick={() => createNewMission()}>
          New
        </NormalButton>
      </div>
      <div className="mb-2">
        <div>Storage</div>
        <div className="border-t-[1px] border-gray-400 border-solid h-[1px] pb-1" />
        <div className="flex space-x-2">
          <NormalButton themeName={themeName} onClick={() => filePickerRef.current.click()}>
            Open...
          </NormalButton>
          <input
            type="file"
            ref={filePickerRef}
            onChange={async e => {
              const content = await e.target.files[0].text()
              const missions = JSON.parse(content)
              handleLoadMission(missions)
            }}
            style={{ display: 'none' }}
          />
          <NormalButton
            themeName={themeName}
            onClick={() => {
              handleSaveMission()
            }}>
            Save
          </NormalButton>

          <NormalButton
            themeName={themeName}
            onClick={() => {
              downloadMission()
            }}>
            Save As
          </NormalButton>
        </div>
      </div>
      <div className="mb-2">
        <div>Vehicle</div>
        <div className="border-t-[1px] border-gray-400 border-solid h-[1px] pb-1" />
        <div className="flex space-x-2">
          <NormalButton
            themeName={themeName}
            onClick={() => {
              handleSendMission(missionItems)
            }}>
            Upload
          </NormalButton>
          <NormalButton themeName={themeName} onClick={() => handleDownloadMission()}>
            Download
          </NormalButton>
          <NormalButton
            themeName={themeName}
            onClick={() => {
              handleClearMavMission()
              removeallWaypoint()
            }}>
            Clear
          </NormalButton>
        </div>
      </div>
      <div className="mb-2">
        <div>Delivery Mission List</div>
        <div className="border-t-[1px] border-gray-400 border-solid h-[1px] pb-1" />
        <div className="flex space-x-2">
          <NormalButton themeName={themeName} onClick={props.toogleIsDeliveryMissionListModal}>
            Select
          </NormalButton>
        </div>
      </div>
    </div>
  )
}

export const NormalButton = ({ children, disabled, className, themeName, ...props }) => {
  return (
    <button
      className={`${themeName === 'tft' ? 'hover:bg-[#1F42A9] hover:text-white' : 'hover:bg-[#7575bf]'} bg-white text-black font-semibold text-xs py-1 px-1 border-[1px] rounded-sm border-black ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}>
      {children}
    </button>
  )
}

export default DroneTracker
