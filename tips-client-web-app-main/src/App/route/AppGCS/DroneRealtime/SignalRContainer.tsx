/**
 * @file SignalRContainer.jsx
 * @brief Front-end 와 server의 통신 관리 클래스.
 * @details SignalRContainer는 Frint-end 에서 server 쪽으로 데이터를 전달하는 부분과 Server에서 Front-end로 전송받는 코드.
 * @note hubConnectionObj.on은 server 쪽애서 데이터를 받는 함수이며,
 hubConnection.current.invoke은 Front_end에서 server로 데이터를 전달하는 함수 이다.
 * @date 2023-08-30
 * @version 1.0.0
 */
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { TypeOptions, toast } from 'react-toastify'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { Subject } from 'rxjs'
import { uniqBy } from 'lodash'
import { baseGCSPath } from '../../common/path'
const alertSound = require('../../../../resources/simple-notification.mp3').default

export type MissionItem = {
  frame: string
  param1: number
  param2: number
  param3: number
  param4: number
  param5: number
  param6: number
  param7: number
  type: string
  altitude: string
  relayNumber: string
  relayPWM: string
  servoNumber: string
  servoPWM: string
  latitude: number
  longitude: number
  speed: number
  command: number
  x: number
  y: number
  z: number
}

export type DroneState = any
const PROTOCOL_STATE = {
  INIT: 'init',
  ERROR: 'error',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
}

const MAV_CMD_MAPS: { [command: string]: string } = {
  MAV_CMD_NAV_TAKEOFF: 'TAKEOFF',
  MAV_CMD_NAV_WAYPOINT: 'WAYPOINT',
  MAV_CMD_NAV_RETURN_TO_LAUNCH: 'RETURN_TO_LAUNCH',
  MAV_CMD_DO_CHANGE_SPEED: 'MAV_CMD_DO_CHANGE_SPEED',
}

const basic_config = {
  type: 'success' as TypeOptions,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  closeOnClick: true,
}

const fail_config = {
  type: 'error' as TypeOptions,
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  closeOnClick: true,
  autoClose: false as false,
  hideProgressBar: true,
}

const delivery_cmd_type = {
  Arm: 'Arm',
  MissionStart: 'MissionStart',
  AutoMissionStart: 'AutoMissionStart',
  DoSetServoHigh: 'DoSetServoHigh',
  DoSetServoLow: 'DoSetServoLow',
  DoSetRelay: 'DoSetRelay',
}

export const SignalRContext = React.createContext({})

const fail_meg: React.FC<{
  message: string
  droneId: string
  handleRetryMissionMsg: (message: string, droneId: string) => void
}> = ({ message, droneId, handleRetryMissionMsg }) => (
  <div>
    <div style={{ color: 'red' }}>
      {message}
      <br /> {/* 한 줄 띄우기 */}
      {'  Drone_ID : '}
      {droneId}
    </div>
    <div>
      <button
        style={{ marginRight: '10px' }}
        onClick={() => {
          handleRetryMissionMsg(message, droneId)
        }}>
        Retry
      </button>
    </div>
  </div>
)

export const SignalRProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [selectedDroneId, setSelectedDroneId] = useState()
  const [selectedCount, setSelectedCount] = useState(0)
  const [centeringDroneId, setCenteringDroneId] = useState<string>()
  const [connectionStatus, setConnectionStatus] = useState<string>(PROTOCOL_STATE.INIT)
  const [droneDeliveryInfos, setDroneDeliveryInfos] = useState({})
  const [ParamInfo, setParamInfo] = useState({})
  const [mavMissions, setMavMissions] = useState<{ [droneId: string]: MissionItem[] }>({})
  const [mavParameters, setMavParameters] = useState<{ [droneId: string]: any[] }>({})
  const [mavParametersDownloadProgress, setMavParametersDownloadProgress] = useState({})
  const [gotoHereMode, setGotoHereMode] = useState(false)
  const [gotoherealtitude, setGotoHereAltitude] = useState(20)
  const [fixDroneMap, setFixDroneMap] = useState(false)
  const [rcOverride, setRcOverride] = useState(false)
  const [version, setVersion] = useState('')
  const [FlightSpeed, setFlightSpeed] = useState(0)
  const [FlightTakeoff, setFlightTakeoff] = useState(0)
  const [UpdateProfileInfo, setUpdateProfileInfo] = useState([])
  const [profiledetailInfo, setProFileDetailInfo] = useState([])
  const [Message, setMessage] = useState('')
  const [uploadMissions, SetUploadMission] = useState<{ [droneId: string]: MissionItem[] }>({})
  const [failedProgressEvent, setFailedProgressEvent] = useState<{ message: string; droneId: string }>()
  const [droneListChanged, setDroneListChanged] = useState('')

  const hubConnection = useRef<HubConnection>()

  const droneNameMap = useRef<{ [droneId: string]: string }>({})

  const [warningSkipList, setWarningSkipList] = useState<string[]>([])
  const [reload, toggleReload] = useReducer(reload => !reload, true)

  useEffect(() => {
    const hubConnectionObj = new HubConnectionBuilder()
      .withUrl(`${baseGCSPath}/web-hub`)
      .configureLogging(LogLevel.Information)
      .build()

    hubConnectionObj.on('ReceiveNotification', message => {
      if (message === '새로운 배송 미션이 도착했습니다!') {
        const audio = new Audio(alertSound)
        audio.play()
      }
      // else if (message === 'COMPONENT_ARM Accepted') {
      //   handleSendDroneMissionStart()
      // }
      toggleReload()
      toast.info(message)
    })

    hubConnection.current = hubConnectionObj
    hubConnectionObj
      .start()
      .then(async () => {
        console.log('Connection started!')
        setConnectionStatus(PROTOCOL_STATE.CONNECTED)
        const [, , appVersion] = await Promise.all([
          hubConnectionObj.invoke('GetDroneList'),
          hubConnectionObj.invoke('GetDroneDeliveryInfo'),
          hubConnectionObj.invoke('GetApplicationVersion'),
        ])
        setVersion(appVersion)
      })
      .catch(err => {
        console.log(`Error while establishing connection ${err}`)
        setConnectionStatus(PROTOCOL_STATE.ERROR)
      })
    return () => {
      hubConnectionObj.stop()
    }
  }, [])

  const selectedDroneStateObservable = useMemo(() => new Subject(), [])

  const baseDroneStatesObservable = useMemo(() => new Subject(), [])

  // this should fix the issue with old mission appear after upload
  const handleMissionChanged = useCallback((droneId: string, missionItems: MissionItem[]) => {
    console.log(missionItems)
    setMavMissions(old => {
      const updates = {
        [droneId]: cleanupRawMissionItems(missionItems, droneId),
      }
      return {
        ...old,
        ...updates,
      }
    })
  }, [])

  const success_meg = ({ message, droneId }: { message: string; droneId: string }) => (
    <div>
      <div style={{ color: 'grary' }}>
        {droneId}
        <br /> {/* 한 줄 띄우기 */}
        {message}
      </div>
    </div>
  )

  const handleDownloadMission = useCallback(
    (droneId: string) => {
      const targetDroneId = droneId || selectedDroneId
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current?.invoke('StartDownloadMavlinkMission', targetDroneId, 'MISSION')
      }
    },
    [connectionStatus, selectedDroneId],
  )

  const handleClearMavMission = useCallback(
    (droneId: string) => {
      const targetDroneId = droneId || selectedDroneId
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current!.invoke('SendClearAllMavMission', targetDroneId, 'MISSION')
      }
    },
    [connectionStatus, selectedDroneId],
  )

  const handleRetrySendMission = useCallback(
    (missionItems: MissionItem[], droneId: string) => {
      const updatedMissions = {
        ...uploadMissions,
        [droneId]: {
          ...(uploadMissions[droneId] || {}),
          ...missionItems,
        },
      }
      SetUploadMission(updatedMissions)

      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current
          ?.invoke(
            'SendMavlinkMission',
            droneId,
            missionItems.slice(1).map(item => ({
              command: MAV_CMD_MAPS[item.type],
              frame: item.frame,
              param1: item.param1 || 0,
              param2: item.param2 || 0,
              param3: item.param3 || 0,
              param4: item.param4 || 0,
              param5: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.latitude,
              param6: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.longitude,
              param7: item.altitude || 0,
              speed: item.speed,

              relayNumber: item.relayNumber,
              relayPWM: item.relayPWM,

              servoNumber: item.servoNumber,
              servoPWM: item.servoPWM,
            })),
            'MISSION',
          )
          .catch(res => {
            console.log(res)
          })
      }
    },
    [connectionStatus, uploadMissions],
  )

  const handleRetryMissionMsg = useCallback(
    (message: string, droneId: string) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        if (message === 'DownloadMissionItems_fail') {
          // handleDownloadMission(droneId)
        } else if (message === 'UploadMissionItems_fail') {
          let uploadmissionItem = Object.values(uploadMissions[droneId]).map(item => item)
          handleRetrySendMission(uploadmissionItem, droneId)
        } else if (message === 'ClearMissionItems_fail') {
          handleClearMavMission(droneId)
        }
      }
    },
    [connectionStatus, handleClearMavMission, handleRetrySendMission, uploadMissions],
  )

  const handleSetSelectedDroneId = useCallback((selectedDroneId: string) => {
    hubConnection.current?.invoke('SetSelectedDroneId', selectedDroneId)
  }, [])

  const handleLoadMavlinkParams = useCallback((selectedDroneId: string) => {
    hubConnection.current?.invoke('FetchDroneMavlinkParams', selectedDroneId)
  }, [])

  useEffect(() => {
    const hubConnectionObj = hubConnection.current
    if (!hubConnectionObj) {
      return
    }

    hubConnectionObj.on('NewDeliveryPlan', () => {
      toast('새로운 배달 요청 전송', { type: 'info' })
    })

    hubConnectionObj.on('CancelDeliveryPlan', () => {
      toast('Canceled', { type: 'info' })
    })

    hubConnectionObj.on('DroneMavMissionsChanged', handleMissionChanged)

    hubConnectionObj.on('DronesDeliveryFetched', (droneId, deliveryInfo) => {
      setDroneDeliveryInfos(old => ({
        ...old,
        [droneId]: deliveryInfo,
      }))
    })

    hubConnectionObj.on('SelectedDroneStateUpdate', (id, ds) => {
      setSelectedDroneId(id)
      selectedDroneStateObservable.next({ id, droneState: ds })
    })

    hubConnectionObj.on('DroneStateUpdate', (ds: DroneState[]) => {
      // console.log(DroneStateUpdate)
      if (ds.length > 0) {
        setSelectedDroneId(old => {
          if (!old) {
            const selectedDrone = ds[0]
            if (selectedDrone) {
              handleSetSelectedDroneId(selectedDrone.DroneId)
              return selectedDrone.DroneId
            }
          }
          return old
        })
      } else {
        setSelectedDroneId(undefined)
      }
      const droneStates = ds.reduce(
        (acc: { [droneId: string]: DroneState }, drone: DroneState) => ({
          ...acc,
          [drone.DroneId]: drone,
        }),
        {},
      )
      baseDroneStatesObservable.next(droneStates)
      setDroneListChanged(ds.map(i => i.DroneId).join('|'))
      droneNameMap.current = ds.reduce(
        (acc: { [droneId: string]: string }, drone: DroneState) => ({
          ...acc,
          [drone.DroneId]: drone?.DroneName,
        }),
        {},
      )
    })

    hubConnectionObj.on('MavCommandAckReceived', (droneId, mavAckData) => {
      console.log('commandACK', droneId, mavAckData)
    })

    hubConnectionObj.on('MavlinkParameterUpdated', (droneId, parameter) => {
      console.log('parameter fetched', droneId, parameter)
      setMavParameters(old => ({
        ...old,
        [droneId]: uniqBy([...(old[droneId] || []), parameter], i => i.Name),
      }))
    })
    hubConnectionObj.on('MavMissionAckReceived', (droneId, mavAckData) => {
      console.log('missionACK', droneId, mavAckData)
    })
    hubConnectionObj.on('MavlinkParametersFetched', (droneId, parameters) => {
      // console.log('parameters', droneId, parameters)
      setMavParameters(old => ({ ...old, [droneId]: parameters }))
    })
    hubConnectionObj.on('NewProgressEvent', (droneId, error) => {
      //console.log('여기봐~~!', error.Type, error.Total, '현재진행률 :', error.Current)
      if (error.Type === 'ParametersFetch') {
        setMavParametersDownloadProgress(old => ({ ...old, [droneId]: error.Current < error.Total - 1 ? error : null }))
      } else if (error.Type === 'UploadMissionItems_Success' && error.Current === error.Total) {
        toast(success_meg({ message: 'UploadMission_Success', droneId: droneNameMap.current[droneId] }), basic_config)
        console.log('allocate API')
      } else if (error.Type === 'DownloadMissionItems_Success' && error.Current === error.Total) {
        toast(
          success_meg({
            message: 'DownloadMission_Success',
            droneId: droneNameMap.current[droneId],
          }),
          basic_config,
        )
      } else if (error.Type === 'ClearMissionItems_Success' && error.Current === error.Total) {
        toast(success_meg({ message: 'Cleared Mission', droneId: droneNameMap.current[droneId] }), basic_config)
      } else if (error.Type === 'DownloadMissionItems_fail' && error.Current === error.Total) {
        setFailedProgressEvent({ message: error.Type, droneId: droneNameMap.current[droneId] })
      } else if (error.Type === 'UploadMissionItems_fail' && error.Current === error.Total) {
        setFailedProgressEvent({ message: error.Type, droneId: droneNameMap.current[droneId] })
      } else if (error.Type === 'Retry_UploadMissionItem_fail' && error.Current === error.Total) {
        setFailedProgressEvent({ message: error.Type, droneId: droneNameMap.current[droneId] })
      } else if (error.Type === 'ClearMissionItems_fail' && error.Current === error.Total) {
        setFailedProgressEvent({ message: error.Type, droneId: droneNameMap.current[droneId] })
      }
    })
    hubConnectionObj.on('GCSJoystickRcOverrideUpdated', updatedRcOverride => {
      setRcOverride(updatedRcOverride)
    })
    hubConnectionObj.on('DroneSpeedAltUpdate', (updateTakeoff, updateSpeed) => {
      setFlightTakeoff(updateTakeoff)
      setFlightSpeed(updateSpeed)
    })
    hubConnectionObj.on('UpdateProFileList', UpdateProfileInfo => {
      setUpdateProfileInfo(UpdateProfileInfo)
    })
    hubConnectionObj.on('SeletcedProFileDetail', ProfileDetailInfo => {
      setProFileDetailInfo(ProfileDetailInfo)
    })
    hubConnectionObj.on('ParamInfoUpdate', updateparaminfo => {
      setParamInfo(updateparaminfo)
    })

    return () => {
      console.log('Unsubscribe')
      ;[
        'NewDeliveryPlan',
        'CancelDeliveryPlan',
        'DroneMavMissionsChanged',
        'DronesDeliveryFetched',
        'DroneStateUpdate',
        'SelectedDroneStateUpdate',
        'MavCommandAckReceived',
        'MavMissionAckReceived',
        'MavlinkParametersFetched',
        'NewProgressEvent',
        'GCSJoystickRcOverrideUpdated',
        'DroneSpeedAltUpdate',
        'UpdateProFileList',
        'SeletcedProFileDetail',
        'ParamInfoUpdate',
      ].forEach(handler => {
        hubConnectionObj.off(handler)
      })
    }
  }, [baseDroneStatesObservable, selectedDroneStateObservable, handleMissionChanged, handleSetSelectedDroneId])

  useEffect(() => {
    if (failedProgressEvent) {
      toast(fail_meg({ ...failedProgressEvent, handleRetryMissionMsg }), fail_config)
    }
  }, [failedProgressEvent, handleRetryMissionMsg])

  useEffect(() => {
    if (connectionStatus !== PROTOCOL_STATE.CONNECTED) return
    if (droneListChanged) {
      const droneIds = droneListChanged.split('|')
      droneIds.forEach(droneId => {
        if (!mavParameters[droneId]) {
          hubConnection.current?.invoke('GetDroneParams', droneId)
        }
      })
    }
  }, [droneListChanged, mavParameters, connectionStatus])

  useEffect(() => {
    if (connectionStatus !== PROTOCOL_STATE.CONNECTED) return
    if (droneListChanged) {
      const droneIds = droneListChanged.split('|')
      droneIds.forEach(async droneId => {
        if (!mavMissions[droneId]) {
          console.log('fetching new mission:' + droneId)
          const mission = await hubConnection.current?.invoke('GetDroneMission', droneId)
          if (mission && mission.length) {
            handleMissionChanged(droneId, mission)
          }
        }
      })
    }
  }, [droneListChanged, mavMissions, handleMissionChanged, connectionStatus])

  const handleUpdateCenterDrone = useCallback((centerDroneId: string) => {
    setSelectedCount(old => old + 1)
    setCenteringDroneId(centerDroneId)
  }, [])

  const handleUpdateWaypoints = useCallback((droneId: string, changes: any[]) => {
    hubConnection.current?.invoke('UpdateDroneDeliveryWaypoints', droneId, changes)
  }, [])

  const handleSendStartSignal = useCallback(() => {
    hubConnection.current?.invoke('SendStartSignal', selectedDroneId)
  }, [selectedDroneId])

  const handleSendCameraDirectionalCommand = useCallback(
    (direction: string) => {
      hubConnection.current?.invoke('SendDroneCameraDirectionalButtonCommand', selectedDroneId, direction)
    },
    [selectedDroneId],
  )

  const handleSubmitWaypoints = useCallback(() => {
    hubConnection.current?.invoke('SubmitWaypoints', selectedDroneId)
  }, [selectedDroneId])

  const handleSendCalibrateCommand = useCallback(() => {
    hubConnection.current?.invoke('SendCamOneClickCommand', selectedDroneId, 'Calibration')
  }, [selectedDroneId])

  const handleSendZoomCommand = useCallback(
    (cmd: number) => {
      hubConnection.current?.invoke('SendDroneCameraZoomCommand', selectedDroneId, cmd)
    },
    [selectedDroneId],
  )

  const handleSendFocusCommand = useCallback(
    (command: number) => {
      hubConnection.current?.invoke('SendDroneFocusCommand', selectedDroneId, command)
    },
    [selectedDroneId],
  )

  const handleSendTrackingCommand = useCallback(
    (x: number, y: number, width: number, length: number) => {
      hubConnection.current?.invoke('SendDroneTrackingCommand', selectedDroneId, true, x, y, width, length)
    },
    [selectedDroneId],
  )

  const handleSendTrackingStopCommand = useCallback(() => {
    hubConnection.current?.invoke('SendDroneTrackingCommand', selectedDroneId, false, 0, 0, 0, 0)
  }, [selectedDroneId])

  const handleSendCamOneClickCommand = useCallback(
    (type: string) => {
      hubConnection.current?.invoke('SendCamOneClickCommand', selectedDroneId, type === 'mid' ? 'Mid' : 'LookDown')
    },
    [selectedDroneId],
  )

  const handleSendDroneFlightCommand = useCallback(
    (type: string) => {
      hubConnection.current?.invoke('SendDroneFlightCommand', type, selectedDroneId)
    },
    [selectedDroneId],
  )

  const handleSendDroneFlightSpeedAlt = useCallback((type: string, value: number) => {
    hubConnection.current?.invoke('SendDroneFlightSpeedAlt', type, value)
  }, [])

  const handleUpdateDroneFlightSpeedAlt = useCallback(() => {
    hubConnection.current?.invoke('UpdateFlightSpeedAlt')
  }, [])

  // const handleSendDeliveryAllocatedToOMS = useCallback(
  //   async (selectedDroneId, selectedDroneName, selectedMissionId) => {
  //     try {
  //       const data = {
  //         droneId: selectedDroneId,
  //         droneName: selectedDroneName,
  //         MissionId: selectedMissionId,
  //       }
  //
  //       const requestOptions = {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(data),
  //       }
  //
  //       const res = await fetch(`${baseGCSPath}/api/delivery-mission-allocated`, requestOptions)
  //
  //       if (res.ok) {
  //         console.log('할당 요청 성공')
  //       } else {
  //         console.error('할당 요청 실패')
  //       }
  //     } catch (e) {
  //       console.error('할당 중 오류 발생', e)
  //     }
  //   },
  //   [],
  // )

  /**
   * @ingroup HS001_F
   * @fn const handleAddNewProfileConnection
   * 새로운 Profile 생성 시 Name을 전달해주는 변수
   * @brief HENG_SW_001
   * @details Profile 생성
   * @note  Client --> Server
   */
  const handleAddNewProfileConnection = useCallback((profilename: string) => {
    hubConnection.current?.invoke('MakeDroneProfile', profilename)
  }, [])

  const handleUpdateProfileInfo = useCallback(() => {
    hubConnection.current?.invoke('ProFileInfoUpdate')
  }, [])

  const handleRemoveProfileSend = useCallback((removename: string) => {
    hubConnection.current?.invoke('RemoveProFile', removename)
  }, [])

  const handleRequstProfileInfo = useCallback((selectedprofilename: string) => {
    hubConnection.current?.invoke('ProFileDetailInfo', selectedprofilename)
  }, [])

  const handleEditProFileInfo = useCallback((profilename: string, info: any) => {
    hubConnection.current?.invoke('EditProFileInfo', profilename, info)
  }, [])

  /**
   * @ingroup HS002_F
   * @fn const handleSendDroneChangeFlightModeCommand
   * 무인기의 Flight Mode 변경을 위한 함수 (변경할 Mode 전달 )
   * @brief HENG_SW_002
   * @details Flight Mode를 변경하기 위해 사용자가 선택한 Flight Mode를 서버로 전송하는 부분
   * @note  Client --> Server
   */
  const handleSendDroneChangeFlightModeCommand = useCallback(
    (flightMode: number) => {
      hubConnection.current?.invoke('SendDroneChangeFlightModeCommand', flightMode, selectedDroneId)
    },
    [selectedDroneId],
  )

  const handleUpdateMavlinkParam = useCallback((selectedDroneId: string, paramName: string, paramValue: any) => {
    console.log(selectedDroneId, paramName, paramValue)
    hubConnection.current?.invoke('UpdateMavlinkParam', selectedDroneId, paramName, paramValue)
  }, [])

  const handleUpdateDroneSelectedId = useCallback(
    (selectedDroneId: string) => {
      console.log('handle select drone', selectedDroneId)
      //setSelectedDroneId(selectedDroneId)
      handleSetSelectedDroneId(selectedDroneId)
    },
    [handleSetSelectedDroneId],
  )

  const handleSendCameraSidChange = useCallback((selectedDroneId: string) => {
    hubConnection.current?.invoke('sendCameraSIDChange', selectedDroneId)
  }, [])

  const handleSendCameraFollowCommand = useCallback(
    (follow: boolean) => {
      hubConnection.current?.invoke('SendCameraFollowCommand', selectedDroneId, follow)
    },
    [selectedDroneId],
  )

  const handleStartRecordVideo = useCallback((selectedDroneId: string) => {
    hubConnection.current?.invoke('StartRecordVideo', selectedDroneId)
  }, [])

  const handleStopRecordVideo = useCallback((selectedDroneId: string) => {
    hubConnection.current?.invoke('StopRecordVideo', selectedDroneId)
  }, [])

  const handleSendCameraRecordCommand = useCallback(
    (cmd: string) => {
      hubConnection.current?.invoke('SendCameraRecordCommand', selectedDroneId, cmd)
    },
    [selectedDroneId],
  )

  const handleSendCameraSnapshotCommand = useCallback(() => {
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      hubConnection.current?.invoke('SendCamOneClickCommand', selectedDroneId, 'Snapshot')
    }
  }, [connectionStatus, selectedDroneId])

  const handleAddNewDroneConnection = useCallback(
    (connectionProtocol: string, droneAddress: string) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current?.invoke('AddDroneConnection', connectionProtocol, droneAddress, 'MAVLINK')
      }
    },
    [connectionStatus],
  )

  const handleStartProfileConnection = useCallback((profilename: string) => {
    hubConnection.current?.invoke('StartProfileConnection', profilename)
  }, [])

  const handleGetSerialPorts = useCallback(() => {
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      return hubConnection.current?.invoke('GetSerialPorts')
    }
  }, [connectionStatus])

  const handleGetProFileList = useCallback(() => {
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      return hubConnection.current?.invoke('GetProFileList')
    }
  }, [connectionStatus])

  const handleEditNewDroneConnection = useCallback(
    (
      droneId: string,
      cameraType: string,
      cameraControlAddress: string,
      cameraAddress: string,
      camera2Address: string,
      cameraIframe: string,
      cameraMasking: string,
    ) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current
          ?.invoke(
            'EditDroneConnection',
            droneId,
            cameraType,
            cameraControlAddress,
            cameraAddress,
            camera2Address,
            cameraIframe,
            cameraMasking,
          )
          .catch(error => console.log(error))
      }
    },
    [connectionStatus],
  )

  const handleClearDroneSeverityLog = useCallback(
    (droneId: string) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current?.invoke('ClearDroneSeverityLog', droneId)
      }
    },
    [connectionStatus],
  )

  const handleDisconnectDroneConnection = useCallback(
    (droneId: string) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current?.invoke('DisconnectDroneConnection', droneId)
      }
    },
    [connectionStatus],
  )

  const handleSendDeliveryMission = useCallback(
    (missionId: string, deliveryMissionItems: MissionItem[]) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current
          ?.invoke(
            'SendMavlinkMission',
            selectedDroneId,
            deliveryMissionItems.slice(1).map(item => ({
              command: item.command,
              frame: item.frame,
              param1: item.param1 || 0,
              param2: item.param2 || 0,
              param3: item.param3 || 0,
              param4: item.param4 || 0,
              param5: item.param5,
              param6: item.param6,
              param7: item.param7,
              speed: item.speed,

              relayNumber: item.relayNumber,
              relayPWM: item.relayPWM,

              servoNumber: item.servoNumber,
              servoPWM: item.servoPWM,
            })),
            'MISSION',
            missionId,
          )
          .catch(res => {
            console.log(res)
          })
        console.log(`UpdateDeliveryMission: allocate ${missionId} to ${selectedDroneId}`)
      }
    },
    [connectionStatus, selectedDroneId],
  )

  const handleSendMission = useCallback(
    (missionItems: MissionItem[]) => {
      if (selectedDroneId) {
        const updatedMissions = {
          ...uploadMissions,
          [selectedDroneId]: {
            ...(uploadMissions[selectedDroneId] || {}),
            ...missionItems,
          },
        }
        SetUploadMission(updatedMissions)

        if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
          hubConnection.current
            ?.invoke(
              'SendMavlinkMission',
              selectedDroneId,
              missionItems.slice(1).map(item => ({
                command: MAV_CMD_MAPS[item.type],
                frame: item.frame,
                param1: item.param1 || 0,
                param2: item.param2 || 0,
                param3: item.param3 || 0,
                param4: item.param4 || 0,
                param5: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.latitude,
                param6: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.longitude,
                param7: item.altitude || 0,
                speed: item.speed,
                relayNumber: item.relayNumber,
                relayPWM: item.relayPWM,

                servoNumber: item.servoNumber,
                servoPWM: item.servoPWM,
              })),
              'MISSION',
              'NONE',
            )
            .catch(res => {
              console.log(res)
            })
        }
      }
    },
    [connectionStatus, selectedDroneId, uploadMissions],
  )

  const handleGetMavMissionItemsElevations = useCallback(
    async (missionItems: MissionItem[]) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        return await hubConnection.current?.invoke(
          'GetDroneElevations',
          missionItems.slice(1).map(item => ({
            command: MAV_CMD_MAPS[item.type],
            param1: 0,
            param2: 0,
            param3: 0,
            param4: 0,
            param5: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.latitude,
            param6: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.longitude,
            param7: item.altitude || 0,
          })),
        )
      }
    },
    [connectionStatus],
  )

  const handleSaveWaypoints = useCallback(
    async (missionItems: MissionItem[]) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        const elevations = await hubConnection.current?.invoke(
          'SaveMavlinkMission',
          selectedDroneId,
          missionItems.slice(1).map(item => ({
            command: MAV_CMD_MAPS[item.type],
            param1: 0,
            param2: 0,
            param3: 0,
            param4: 0,
            param5: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.latitude,
            param6: item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? 0 : item.longitude,
            param7: item.altitude || 0,
          })),
        )
        return elevations
      }
    },
    [connectionStatus, selectedDroneId],
  )

  const handleSendManualControl = useCallback(
    (directional: string, targetComponent: number) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current?.invoke('SendMavManualControl', directional, targetComponent, selectedDroneId)
      }
    },
    [connectionStatus, selectedDroneId],
  )

  const handleSendGotoHere = useCallback(
    (lat: number, lng: number, alt: number) => {
      if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
        hubConnection.current?.invoke('SendGoToHereCommand', lat, lng, alt, selectedDroneId)
      }
    },
    [connectionStatus, selectedDroneId],
  )

  // const handleSendDroneMissionStart = useCallback(() => {
  //   if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
  //     hubConnection.current.invoke('SendDroneMissionStart')
  //   }
  // }, [connectionStatus])

  const handleGetDroneSavedVideos = useCallback(async () => {
    return await hubConnection.current?.invoke('GetDroneSavedVideos', selectedDroneId)
  }, [selectedDroneId])

  const handleUpdateDronelogMsg = useCallback((selectedDroneId: string, message: string, severity: string) => {
    hubConnection.current?.invoke('UpdateDroneLogMsg', selectedDroneId, message, severity)
  }, [])

  /*
   * Regarding Warning Alarm Modal Feature
   */
  const handleDroneManualControl = useCallback((droneId: string) => {
    hubConnection.current?.invoke('sendDroneManualControl', droneId)
  }, [])

  const handleManualBtn = useCallback(
    (droneId: string) => {
      setWarningSkipList(old => [...old, droneId])
      handleUpdateDroneSelectedId(droneId)
      handleDroneManualControl(droneId)
    },
    [handleDroneManualControl, handleUpdateDroneSelectedId],
  )

  const handleDroneAutoControl = useCallback((droneId: string) => {
    hubConnection.current?.invoke('sendDroneAutoControl', droneId)
  }, [])

  const handleAutoBtn = useCallback(
    (droneId: string) => {
      setWarningSkipList(old => [...old, droneId])
      handleUpdateDroneSelectedId(droneId)
      handleDroneAutoControl(droneId)
    },
    [handleDroneAutoControl, handleUpdateDroneSelectedId],
  )

  const handleIgnoreBtn = useCallback((droneId: string) => {
    setWarningSkipList(old => [...old, droneId])
  }, [])

  const handleAutoMissionStart = useCallback(() => {
    console.log('자동 배송 시작 요청')
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      // hubConnection.current.invoke('SendAutoMissionStart')
      hubConnection.current?.invoke('SendMavCommand', delivery_cmd_type.AutoMissionStart, selectedDroneId)
    }
  }, [connectionStatus, selectedDroneId])

  const handleSendDroneMissionStart = useCallback(() => {
    console.log('배송 시작 요청')
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      // hubConnection.current.invoke('SendDroneMissionStart')
      hubConnection.current?.invoke('SendMavCommand', delivery_cmd_type.MissionStart, selectedDroneId)
    }
  }, [connectionStatus, selectedDroneId])

  const handleDoSetServoHigh = useCallback(() => {
    console.log('배송함 수동 열림 요청')
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      // hubConnection.current?.invoke('SendDoSetServoHigh')
      hubConnection.current?.invoke('SendMavCommand', delivery_cmd_type.DoSetServoHigh, selectedDroneId)
    }
  }, [connectionStatus, selectedDroneId])

  const handleDoSetServoLow = useCallback(() => {
    console.log('배송함 수동 닫힘 요청')
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      // hubConnection.current?.invoke('SendDoSetServoLow')
      hubConnection.current?.invoke('SendMavCommand', delivery_cmd_type.DoSetServoLow, selectedDroneId)
    }
  }, [connectionStatus, selectedDroneId])

  const handleDoSetRelay = useCallback(() => {
    console.log('배송함 릴레이 요청')
    if (connectionStatus === PROTOCOL_STATE.CONNECTED) {
      hubConnection.current?.invoke('SendMavCommand', delivery_cmd_type.DoSetRelay, selectedDroneId)
    }
  }, [connectionStatus, selectedDroneId])

  return (
    <SignalRContext.Provider
      value={{
        version,
        selectedDroneStateObservable,
        handleGetDroneSavedVideos,
        handleUpdateDroneSelectedId,
        handleUpdateCenterDrone,
        handleUpdateWaypoints,
        handleSendStartSignal,
        handleSendCameraDirectionalCommand,
        handleSubmitWaypoints,
        handleSendCalibrateCommand,
        handleSendZoomCommand,
        handleSendFocusCommand,
        handleSendTrackingCommand,
        handleSendTrackingStopCommand,
        handleSendCamOneClickCommand,
        handleSendDroneFlightCommand,
        handleSendDroneChangeFlightModeCommand,
        handleSendDroneFlightSpeedAlt,
        handleUpdateDroneFlightSpeedAlt,
        handleUpdateProfileInfo,
        handleRemoveProfileSend,
        handleRequstProfileInfo,
        handleEditProFileInfo,
        handleAddNewProfileConnection,
        handleSendCameraSidChange,
        handleSendCameraFollowCommand,
        handleSendCameraSnapshotCommand,
        handleSendCameraRecordCommand,
        handleSetSelectedDroneId,
        handleLoadMavlinkParams,
        handleUpdateMavlinkParam,
        handleAddNewDroneConnection,
        handleEditNewDroneConnection,
        handleClearDroneSeverityLog,
        handleDisconnectDroneConnection,
        handleSendMission,
        handleDownloadMission,
        handleGetSerialPorts,
        handleStartProfileConnection,
        handleGetProFileList,
        handleGetMavMissionItemsElevations,
        handleSaveWaypoints,
        handleSendManualControl,
        handleSendGotoHere,
        handleClearMavMission,
        handleStartRecordVideo,
        handleStopRecordVideo,
        handleUpdateDronelogMsg,
        gotoHereMode,
        setGotoHereMode,
        gotoherealtitude,
        setGotoHereAltitude,
        fixDroneMap,
        setFixDroneMap,
        mavMissions,
        connectionStatus,
        baseDroneStatesObservable,
        droneDeliveryInfos,
        setSelectedDroneId,
        selectedDroneId,
        selectedCount,
        centeringDroneId,
        mavParameters,
        mavParametersDownloadProgress,
        rcOverride,
        setFlightSpeed,
        setFlightTakeoff,
        FlightSpeed,
        FlightTakeoff,
        UpdateProfileInfo,
        setUpdateProfileInfo,
        profiledetailInfo,
        setProFileDetailInfo,
        ParamInfo,
        setParamInfo,
        Message,
        setMessage,
        handleRetryMissionMsg,
        uploadMissions,
        SetUploadMission,
        warningSkipList,
        setWarningSkipList,
        handleDroneManualControl,
        handleManualBtn,
        handleAutoBtn,
        handleIgnoreBtn,
        handleSendDroneMissionStart,
        handleSendDeliveryMission,
        handleDoSetServoHigh,
        handleDoSetServoLow,
        handleDoSetRelay,
        handleAutoMissionStart,
        reload,
        toggleReload,
        droneListChanged,
      }}>
      {children}
    </SignalRContext.Provider>
  )
}

function cleanupRawMissionItems(missionItems: MissionItem[], droneId: string) {
  const rawItems = missionItems || []
  if (rawItems.length) {
    // merge if item[1] is TAKEOFF and item[0] is WAYPOINT
    if (rawItems[0].command === 16 && rawItems[1].command === 22) {
      return [
        {
          ...rawItems[1],
          command: 22,
          droneId: droneId,
          x: rawItems[0].x,
          y: rawItems[0].y,
          z: rawItems[1].z,
        },
        //...rawItems.slice(2), //23.04.24 기존 missionItems 임
        ...rawItems.slice(2).map(item => ({ ...item, droneId: droneId })),
      ]
    }
  }
  //return rawItems //23.04.24 기존 return Value
  return rawItems.map(item => ({ ...item, droneId: droneId })) //droneId를 map함수를 통해 각각의 배열에 추가함
}
