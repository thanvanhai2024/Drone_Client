import React, { useState, useContext, useEffect, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowsToCircle, faUsersViewfinder,
} from '@fortawesome/free-solid-svg-icons'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { DroneCameraContext } from '../DroneCameraContainer'
import newStyles from './TSDroneTrackerComponents.module.css'
import {
  FaCameraRotate,
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
  FaCaretUp,
  FaEllipsis,
  FaVideo
} from 'react-icons/fa6'
import { FaCamera, FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { SystemThemeContext } from '../../AppWrapper'

export const ControlButtonsPanel = ({ droneState, onVideoSwap }) => {
  const { DroneRawState } = droneState || {}
  const droneAvailable = droneState && droneState.IsOnline
  const [isRecording, setIsRecording] = useState(false)
  const [following, setFollowing] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const {
    handleSendCameraDirectionalCommand,
    handleSendCalibrateCommand,
    handleSendZoomCommand,
    handleSendFocusCommand,
    handleSendCamOneClickCommand,
    handleSendCameraSnapshotCommand,
    handleStartRecordVideo,
    handleStopRecordVideo,
    handleSendCameraFollowCommand,
    handleSendTrackingStopCommand,
    handleSendCameraSidChange,

  } = useContext(SignalRContext)

  const { onTrackSelected, setOnTrackSelected } = useContext(DroneCameraContext)
  const { themeName } = useContext(SystemThemeContext)
  const intervalTime = 100 //호출 시간 ms
  const intervalRef = useRef(null)

  const [queue, setQueue] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    return () => StopCameraPressBnt() // when App is unmounted we should stop counter
  }, [])

  const SetRecordStatus = useCallback((Isrecord) => {
    if (Isrecord !== undefined && isRecording !== Isrecord) {
      setIsRecording(Isrecord)
      console.log('camerarecord change' + Isrecord)
    }
  }, [isRecording])

  useEffect(() => {
    SetRecordStatus(droneState?.Isrecord)
  }, [SetRecordStatus, droneState?.Isrecord])

  const StopCameraPressBnt = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function StartCameraPressBnt(bnt) {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      handleSendCameraDirectionalCommand(bnt)
      console.log(bnt)
    }, intervalTime)
  }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // console.log(droneState?.WarningData?.WarningCount)
  //     const isNormal = droneState?.WarningData?.WarningCount < 10
  //     setQueue(prevQueue => [...prevQueue, isNormal ? '정상' : '비정상'])
  //     setCount(prevCount => prevCount + 1)
  //     if (count !== 0 && count % 12 === 0) {
  //       setQueue([])
  //       setCount(0)
  //     }
  //   }, 1000)
  //
  //   return () => clearInterval(interval) // 컴포넌트 언마운트 시 clearInterval
  //
  // }, [count]) // count 가 변경될 때마다 useEffect 재실행

  return <div className={themeName}>
    <div className="w-full col-span-3 flex justify-between flex-1 ">
      <div className="flex-1 float-right m-auto text-[#AEABD8]">
        <button className="hover:text-white svg-drone-status"
          onClick={() => {
            onVideoSwap()
            handleSendCameraSidChange()
          }}>
          <FaCameraRotate/>
        </button>
      </div>
      <div
        className={newStyles.title + 'flex-1 m-auto border border-[#6359E9] rounded shadow text-sm text-[#6359E9] py-1 px-2 btn-drone-status'}
      >
        카메라 제어
      </div>
      <div className="flex flex-row-reverse text-[#AEABD8] space-x-4 space-x-reverse flex-1">
        <button
          className="hover:text-white svg-drone-status"

          onClick={() => {
            if (isRecording) {
              handleStopRecordVideo()
            } else {
              handleStartRecordVideo()
            }
            setIsRecording(old => !old)
          }}>
          <FaVideo color={isRecording ? 'red' : undefined}/>
        </button>

        <button className="gcs-camera-btn hover:text-white svg-drone-status"
          onClick={() => handleSendCameraSnapshotCommand()}>
          <FaCamera/>
        </button>

        <button
          className="border border-gray-400 rounded shadow text-sm py-1 px-2 hover:text-white hover:border-white btn-drone-status"
          onClick={() => {
            handleSendCameraFollowCommand(!following)
            setFollowing(old => !old)
          }}>
          Follow
        </button>

        <button className="hover:text-white svg-drone-status">
          <FaEllipsis/>
        </button>
      </div>
    </div>
    <div className={'grid grid-cols-3 mt-5 mb-3'}>
      <div
        className="flex flex-row space-x-4 space-x flex-1 space-between text-[#AEABD8] justify-center items-center">
        <div className="justify-center items-center translate-y-3.5">
          <button
            onClick={() => {
              if (!isTracking) {
                setOnTrackSelected(old => !old)
              } else {
                handleSendTrackingStopCommand()
                setOnTrackSelected(old => !old)
              }
              setIsTracking(old => !old)
            }}>
            <FontAwesomeIcon className={isTracking ? 'text-yellow-600' : 'text-[#AEABD8]'}
              style={themeName === 'tft' ? {
                color: '#3064fe',
                border: '1px solid var(--line-line2, #1F42A9)',
                padding: '18px'
              } : {}} icon={faArrowsToCircle}/>
          </button>
        </div>
        <div className="flex flex-col items-center h-full ">
          <div className="border border-gray-400 rounded shadow text-xs mb-1 py-1 px-2 btn-drone-status">Zoom</div>
          <div className="flex flex-col justify-between h-full">
            <button className="hover:text-white icon-drone-status"
              onMouseDown={() => handleSendZoomCommand('In')}
              onMouseUp={() => handleSendZoomCommand('Stop')}>
              <FaPlusCircle/>
            </button>
            <button
              className="hover:text-white icon-drone-status"
              onMouseDown={() => handleSendZoomCommand('Out')}
              onMouseUp={() => handleSendZoomCommand('Stop')}>
              <FaMinusCircle/>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto">
        <div className={`flex flex-col justify-center items-center ${newStyles.circle_out_camera2}`}>
          <div className={`flex flex-row justify-center items-center ${newStyles.controllerCol}`}>
            <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_u}`}>
              <button
                className={newStyles.btn_top}
                onMouseDown={() => StartCameraPressBnt('up')}
                onMouseUp={StopCameraPressBnt}
                onClick={() => handleSendCameraDirectionalCommand('stop')}
                onMouseLeave={StopCameraPressBnt}>
                <FaCaretUp className={'text-xl text-gray-400 hover:text-white'}/>
              </button>
            </div>
            <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_d}`}>
              <button
                className={newStyles.btn_bottom}
                onMouseDown={() => StartCameraPressBnt('down')}
                onMouseUp={StopCameraPressBnt}
                onClick={() => handleSendCameraDirectionalCommand('stop')}
                onMouseLeave={StopCameraPressBnt}>
                <FaCaretDown className={'text-xl text-gray-400 hover:text-white'}/>
              </button>
            </div>
          </div>
          <div className={newStyles.controllerRow}>
            <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_l}`}>
              <button
                className={newStyles.btn_left}
                onMouseDown={() => StartCameraPressBnt('left')}
                onMouseUp={StopCameraPressBnt}
                onClick={() => handleSendCameraDirectionalCommand('stop')}
                onMouseLeave={StopCameraPressBnt}>
                <FaCaretLeft className={'text-xl text-gray-400 hover:text-white'}/>
              </button>
            </div>
            <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_r}`}>
              <button
                className={newStyles.btn_right + ' ' + newStyles.cc_02}
                onMouseDown={() => StartCameraPressBnt('right')}
                onMouseUp={StopCameraPressBnt}
                onClick={() => handleSendCameraDirectionalCommand('stop')}
                onMouseLeave={StopCameraPressBnt}>
                <FaCaretRight className={'text-xl text-gray-400 hover:text-white'}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-row-reverse space-x-4 space-x-reverse flex-1 text-[#AEABD8] justify-center items-center">
        <div className="justify-center items-center translate-y-3.5">
          <button
            className="hover:text-white svg-drone-status"
            onClick={() => handleSendFocusCommand('Focus')}>
            <FontAwesomeIcon style={{
              color: '#3064fe',
              border: '1px solid var(--line-line2, #1F42A9)',
              padding: '18px'
            }} icon={faUsersViewfinder}/>
          </button>
        </div>

        <div className="flex flex-col justify-center items-center h-full">
          <div className="border border-gray-400 rounded shadow text-xs mb-1 py-1 px-2 btn-drone-status">Focus</div>

          <div className="flex flex-col justify-between h-full">
            <button
              className="hover:text-white icon-drone-status"
              onMouseDown={() => handleSendFocusCommand('FocusUp')}
              onMouseUp={() => handleSendFocusCommand('FocusStop')}>
              <FaPlusCircle/>
            </button>
            <button
              className="hover:text-white icon-drone-status"
              onMouseDown={() => handleSendFocusCommand('FocusDown')}
              onMouseUp={() => handleSendFocusCommand('FocusStop')}>
              <FaMinusCircle/>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center items-center">
      <div>
        <ControlButton onClick={() => handleSendCamOneClickCommand('mid')}>Mid</ControlButton>
        <ControlButton onClick={() => handleSendCamOneClickCommand('down')}>Down</ControlButton>
        <ControlButton onClick={() => handleSendCalibrateCommand()}>Calibration</ControlButton>
      </div>
    </div>
    {/*<div className={'flex justify-center items-end'}>*/}
    {/*  <div className={`flex items-center mt-1 p-0.5 w-[95%] h-7 border-2 rounded-lg overflow-hidden ${themeName === 'tft' ? 'border-[#17317F]' : 'border-[#4B4B99] '}`}>*/}
    {/*    <div className={'flex h-7 items-center mx-2'}>장애 진단 예측</div>*/}
    {/*    <div className="flex overflow-hidden">*/}
    {/*      {queue.map((status, index) => (*/}
    {/*        <div*/}
    {/*          key={index}*/}
    {/*          className={`flex ml-1 w-6 h-4 ${status === '정상' ? 'bg-green-600' : 'bg-red-600'}`}*/}
    {/*        />*/}
    {/*      ))}*/}
    {/*    </div>*/}
    {/*  </div>*/}
    {/*</div>*/}

  </div>
}

export const ControlButton = ({ children, className, ...props }) => (
  <button
    className={`mb-1 ml-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow text-sm ${className} btn-drone-status`}
    {...props}>
    {children}
  </button>
)
export const SubButtom = ({ children, className, ...props }) => (
  <button
    className={`relative  left-[10px] bg-gray-300 hover:bg-gray-400 text-black font-semibold py-0.5 px-0.5 border border-gray-400 rounded shadow text-xm ${className}`}
    {...props}>
    {children}
  </button>
)
