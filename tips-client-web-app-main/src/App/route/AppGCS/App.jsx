/**
 * @file AppGCSJ.jsx
 * @brief AppWrapper를 정의
 * @details AppGCSJ 컴포넌트는 앱의 주요 로직 및 레이아웃을 다루며, SingmalRProvider, WaypointsContextProvider , DroneCameraContainer 와 함께 다른
 * 컴포넌트 트리의 상위 수준에서 컨텍스트 제공 및 다은 컴포넌트와의 상호 작용을 처리, App의 주요 로직 및 레이아웃을 다루는 역할로  SignalR 허브(Hub)로 작동하며, 클라이언트와의 실시간 통신을 관리합니다.
 * 여러 개의 필드가 정의되어 있으며, 드론 상태, 통신 연결, 데이터베이스 관리 등을 관리하는 클레스.
 * @date 2023-08-31
 * @version 1.0.0
 */

import React, { useState, useContext, useMemo } from 'react'
import { SidebarComponent, SidebarWrapper } from './LeftPanel/SidebarComponent'
import { DroneMaps } from './MainPanel/DroneMaps'
import DroneTracker from './MainPanel/DroneTracker'
import RightPanel from './RightPanel/RightPanel'
import { RightPanelMission } from './RightPanel/RightPanelMission'
import { RightPanelVideo } from './RightPanel/RightPanelVideo'
import { HeaderMenuItems } from './Header'
import { SignalRContext } from './DroneRealtime/SignalRContainer'
import { DroneCameraContext } from './DroneCameraContainer'
import { WaypointsContext } from './WaypointsContext'
import { MissionContextProvider } from './components/MissionContext'
import { faPaperPlane, faRoute } from '@fortawesome/free-solid-svg-icons'
import { SystemThemeContext } from '../AppWrapper'
import { VideoPlayerIframe } from './components/VideoPlayerIframe'
import { ControlButton } from './components/DroneControlButtonsPanel'
import { useSubscribe } from '../common/useRxjs'

const AppGCSJ = () => {
  const [enableSide, setEnableSide] = useState(true)
  const [enableLeftSide, setEnableLeftSide] = useState(true)
  const [displayMapsAsMain, setDisplayMapsAsMain] = useState(true)
  const [isThermal, setIsThermal] = useState(false)
  const [mode, setMode] = useState('flight')
  const [isShowMasking, setIsShowMasking] = useState(false)

  const {
    droneDeliveryInfos,
    selectedDroneId,
    status,
    setSelectedId,
    updateWaypoints,
    sendStartSignal,
    submitWaypoints,
    handleSendTrackingCommand,
    rcOverride,
    baseDroneStatesObservable,
    selectedDroneStateObservable,
  } = useContext(SignalRContext)

  const [droneStates] = useSubscribe(baseDroneStatesObservable, {})
  const [droneStateAndId] = useSubscribe(selectedDroneStateObservable)
  const droneState = droneStateAndId?.droneState

  const { onTrackSelected, setOnTrackSelected } = useContext(DroneCameraContext)

  const { waypointIndexToClusterMaps, setSelectedWPCluster } = useContext(WaypointsContext)
  const { themeName } = useContext(SystemThemeContext)

  const handleToggleSide = () => {
    setEnableSide(old => !old)
  }
  const handleToggleLeftSide = () => {
    setEnableLeftSide(old => !old)
  }
  const handleSidebarWPClicked = waypointIndexToClusterMaps => index => {
    setSelectedWPCluster(waypointIndexToClusterMaps[selectedDroneId][index])
  }

  const disabled1Panel = (enableSide ? 1 : 0) + (enableLeftSide ? 1 : 0) === 1
  const disabled2Panel = (enableSide ? 1 : 0) + (enableLeftSide ? 1 : 0) === 0

  const DroneMapsCmp = useMemo(() => <DroneMaps />, [])

  const droneName = useMemo(() => droneState?.DroneName, [droneState])
  const videoUrl1 = useMemo(() => droneState?.CameraURL1, [droneState])
  const videoUrl2 = useMemo(() => droneState?.CameraURL2, [droneState])

  const videoIframe = useMemo(() => droneState?.CameraIframe, [droneState])
  const videoMasking = useMemo(() => droneState?.CameraMasking, [droneState])

  const VideoPlayer = useMemo(
    test => {
      console.log('VideoPlayer')
      console.log(test)
      const handleTracking = disabled => coordinates => {
        if (
          Math.abs(coordinates.endX - coordinates.x) > 20 &&
          Math.abs(coordinates.endY - coordinates.y) > 20 &&
          onTrackSelected &&
          !disabled
        ) {
          handleSendTrackingCommand(
            (Math.min(coordinates.x, coordinates.endX) / coordinates.width) * 8191,
            (Math.min(coordinates.y, coordinates.endY) / coordinates.height) * 8191,
            (Math.abs(coordinates.endX - coordinates.x) / coordinates.width) * 8191,
            (Math.abs(coordinates.endY - coordinates.y) / coordinates.width) * 8191,
          )
          setOnTrackSelected(true)
        } else {
          setIsThermal(old => !old)
        }
      }
      if (videoUrl1 || videoUrl2) {
        return (
          <>
            {videoUrl1 && <VideoPlayerIframe stream={videoUrl1} />}
            {videoUrl2 && <VideoPlayerIframe stream={videoUrl2} />}
          </>
        )
      } else {
        if (droneName && droneName !== '') {
          let path = 'http://221.148.11.152:3043/stream.html?src=' + droneName

          return (
            <div className={'flex flex-col h-full w-full'}>
              <div className={'flex-center'}>
                <ControlButton onClick={() => setIsShowMasking(false)}>원본 스트림</ControlButton>
                <ControlButton onClick={() => setIsShowMasking(true)}>마스킹 스트림</ControlButton>
              </div>
              {!isShowMasking && <VideoPlayerIframe stream={path} />}
              {isShowMasking && videoMasking && <VideoPlayerIframe stream={videoMasking} />}
            </div>
          )
        }
      }
    },
    [
      videoUrl1,
      videoUrl2,
      videoMasking,
      droneName,
      onTrackSelected,
      handleSendTrackingCommand,
      setOnTrackSelected,
      isShowMasking,
    ],
  )

  return (
    <MissionContextProvider>
      <div className={`h-full w-full use-bootstrap ${themeName}`}>
        <div
          className={`grid ${
            mode === 'flight'
              ? 'grid-cols-[230px_1fr_500px]'
              : mode === 'mission'
                ? 'grid-cols-[230px_1fr_250px]'
                : 'grid-cols-[230px_1fr_500px]'
          } grid-flow-col  h-full w-full gap-3`}>
          <div className={`col-span-1 ${enableLeftSide ? '' : 'hidden'}`}>
            <SidebarWrapper className="innerContainer rounded-2xl bg-[#1D1D41] background-drone-monitor-page">
              <HeaderMenuItems
                mode={mode}
                setMode={setMode}
                items={[
                  { mode: 'flight', icon: faPaperPlane },
                  { mode: 'mission', icon: faRoute },
                  // { mode: 'video', icon: faVideo },
                ]}
                themeName={themeName}
              />
              <SidebarComponent
                droneStates={droneStates}
                droneDeliveryInfo={droneDeliveryInfos[selectedDroneId]}
                setSelectedDrone={setSelectedId}
                selectedDroneId={selectedDroneId}
                handleSidebarWPClicked={handleSidebarWPClicked(waypointIndexToClusterMaps)}
              />
            </SidebarWrapper>
          </div>
          <div className={`${disabled2Panel ? 'col-span-3' : disabled1Panel ? 'col-span-2' : 'col-span-1'} flex-1`}>
            <DroneTracker
              toggleSide={handleToggleSide}
              toggleLeftSide={handleToggleLeftSide}
              displayMapsAsMain={displayMapsAsMain}
              toggleDisplayMapsAsMain={() => setDisplayMapsAsMain(old => !old)}
              mode={mode}
              DroneMapsCmp={DroneMapsCmp}
              VideoPlayer={VideoPlayer}
            />
          </div>
          <div className={`col-span-1 overflow-hidden ${enableSide ? '' : 'hidden'}`}>
            {mode === 'flight' ? (
              <RightPanel
                droneState={droneState}
                droneDeliveryInfo={droneDeliveryInfos[selectedDroneId]}
                sendStartSignal={sendStartSignal}
                submitWaypoints={submitWaypoints}
                droneStates={droneStates}
                droneDeliveryInfos={droneDeliveryInfos}
                status={status}
                toggleSide={handleToggleSide}
                toggleLeftSide={handleToggleLeftSide}
                selectedDroneId={selectedDroneId}
                updateWaypoints={updateWaypoints}
                displayMapsAsMain={displayMapsAsMain}
                DroneMapsCmp={DroneMapsCmp}
                VideoPlayer={VideoPlayer}
                onVideoSwap={() => setIsThermal(old => !old)}
                rcOverride={rcOverride}
              />
            ) : null}
            {mode === 'mission' ? <RightPanelMission /> : null}
            {mode === 'video' ? <RightPanelVideo /> : null}
          </div>
        </div>
      </div>
    </MissionContextProvider>
  )
}

export default AppGCSJ
