import React, { useState, useMemo, useEffect, useCallback, useRef, useContext } from 'react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { mavFrameList, mavFrameListInt } from '../RightPanel/RightPanelCommonComponent'
import { useSubscribe } from '../../common/useRxjs'

export const MissionContext = React.createContext({})

export const MissionState = {
  TAKEOFF: 'TAKEOFF',
  WAYPOINT: 'WAYPOINT',
}

export const DEFAULT_ALTITUDE = 20

export const MissionContextProvider = ({ children }) => {
  const [subMode, setSubMode] = useState('flight')
  const [dronesMissionItems, setDronesMissionItems] = useState({})
  const [addingWaypointMode, setAddingWaypointMode] = useState(false)
  const [dragwaypointMode, setDragWaypointMode] = useState(false)
  const [ggWaypointss, setGgWaypointss] = useState()
  const [gotoHereLocation, setGotoHereLocation] = useState()
  const [drawingPolygon, setDrawingPolygon] = useState(false) //그리기 상태 확인

  const map = useRef()
  const maps = useRef()
  const lastUpdateTime = useRef()

  const {
    selectedDroneId,
    mavMissions,
    handleGetMavMissionItemsElevations,
    selectedDroneStateObservable,
    gotoHereMode,
  } = useContext(SignalRContext)

  const [droneStateWithId] = useSubscribe(selectedDroneStateObservable)
  const droneState = droneStateWithId?.droneState

  const missionItems = useMemo(() => dronesMissionItems[selectedDroneId] || [], [dronesMissionItems, selectedDroneId])
  const AllmissionItems = useMemo(() => dronesMissionItems || [], [dronesMissionItems])

  const handleLoadMission = useCallback(
    newMission => {
      setDronesMissionItems(old => ({ ...old, [selectedDroneId]: newMission }))
    },
    [selectedDroneId],
  )

  useEffect(() => {
    // console.log(missionItems)
    // console.log('AllmissionItems')
    // console.log(AllmissionItems)
    const handle = async () => {
      const res = await handleGetMavMissionItemsElevations(missionItems)
      setGgWaypointss(res)
      lastUpdateTime.current = Date.now()
    }
    handle()
  }, [missionItems, dronesMissionItems, lastUpdateTime, handleGetMavMissionItemsElevations, AllmissionItems])

  useEffect(() => {
    console.log(' Mode : ', subMode)
  }, [subMode])

  useEffect(() => {
    setDronesMissionItems(old => {
      if (old[selectedDroneId]) {
        return old
      }
      return {
        ...old,
        [selectedDroneId]: [
          {
            droneId: selectedDroneId,
            type: 'START',
            altitude: DEFAULT_ALTITUDE,
          },
        ],
      }
    })
  }, [selectedDroneId])

  useEffect(() => {
    setDronesMissionItems(old =>
      Object.fromEntries(
        Object.keys(mavMissions).map(droneId => {
          const missionItems = old[droneId]
          const updatedMissionItems = mavMissions[droneId]
          // console.log(updatedMissionItems)
          if (updatedMissionItems !== undefined && (selectedDroneId === droneId || missionItems === undefined)) {
            return [
              droneId,
              [
                {
                  type: 'START',
                  droneId: droneId,
                },
                ...updatedMissionItems.reduce((prev, mavMissionItem) => {
                  if (MAV_NAV_COMMANDS.findIndex(cmd => cmd.code === mavMissionItem.command) !== -1) {
                    return [
                      ...prev,
                      {
                        droneId: mavMissionItem.droneId,
                        type: MAV_COMMAND_DICT[mavMissionItem.command].name,
                        param1: mavMissionItem.param1,
                        param2: mavMissionItem.param2,
                        param3: mavMissionItem.param3,
                        param4: mavMissionItem.param4,
                        param5: mavMissionItem.param5,
                        frame: mavFrameListInt[mavMissionItem.frame],
                        latitude: mavMissionItem.x / 10000000,
                        longitude: mavMissionItem.y / 10000000,
                        altitude: mavMissionItem.z,
                      },
                    ]
                  }
                  if (prev.length > 0) {
                    return [
                      ...prev.slice(0, -1),
                      {
                        ...prev[prev.length - 1],
                        ...(mavMissionItem.command === MAV_COMMAND_CODE_DICT['MAV_CMD_DO_CHANGE_SPEED'].code
                          ? {
                              speed: mavMissionItem.param2,
                            }
                          : {}),
                        ...(mavMissionItem.command === MAV_COMMAND_CODE_DICT['MAV_CMD_DO_SET_RELAY'].code
                          ? {
                              relayNumber: mavMissionItem.param1,
                              relayPWM: mavMissionItem.param2,
                            }
                          : {}),
                        ...(mavMissionItem.command === MAV_COMMAND_CODE_DICT['MAV_CMD_DO_SET_SERVO'].code
                          ? {
                              servoNumber: mavMissionItem.param1,
                              servoPWM: mavMissionItem.param2,
                            }
                          : {}),
                      },
                    ]
                  }

                  return prev
                }, []),
              ],
            ]
          }
          return [droneId, missionItems]
        }),
      ),
    )
  }, [mavMissions, selectedDroneId])

  const createNewMission = useCallback(
    droneId => {
      setDronesMissionItems(old => ({
        ...old,
        [droneId || selectedDroneId]: [
          {
            droneId: droneId || selectedDroneId,
            type: 'START',
            altitude: DEFAULT_ALTITUDE,
          },
        ],
      }))
    },
    [selectedDroneId],
  )

  const currentState = useMemo(() => {
    if (missionItems.length === 1) {
      return MissionState.TAKEOFF
    } else if (missionItems.length >= 2) {
      return MissionState.WAYPOINT
    }
  }, [missionItems])

  const addWaypoint = useCallback(
    (item, droneId) => {
      const id = droneId || selectedDroneId
      if ((currentState === MissionState.WAYPOINT || currentState === MissionState.TAKEOFF) && subMode === 'mission') {
        setDronesMissionItems(old => {
          // if (old[id].length === 2 && old[id][1].latitude === undefined) { //Take off 기능 수정 전에 사용하던 구문
          //   // adding first waypoint => change it to takeoff
          //   old[id][1].latitude = item.latitude
          //   old[id][1].longitude = item.longitude
          //   return old
          // }
          return {
            ...old,
            [id]: [
              ...(old[id] || []),
              {
                ...item,
                droneId: id,
                altitude: item?.altitude || DEFAULT_ALTITUDE,
                frame: mavFrameList.MAV_FRAME_GLOBAL_RELATIVE_ALT,
              },
            ],
          }
        })
      }
    },
    [currentState, selectedDroneId, subMode],
  )

  const addReturnPoint = useCallback(
    droneId => {
      const id = droneId || selectedDroneId
      const isReturnPointExists = missionItems.some(item => item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH')
      if (currentState === MissionState.WAYPOINT || currentState === MissionState.TAKEOFF) {
        if (!isReturnPointExists) {
          setDronesMissionItems(old => {
            const updatedReturnPointExists = (old[id] || []).some(item => item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH')
            return updatedReturnPointExists === false
              ? {
                  ...old,
                  [id]: [
                    ...(old[id] || []),
                    {
                      droneId: id,
                      type: 'MAV_CMD_NAV_RETURN_TO_LAUNCH',
                      frame: mavFrameList.MAV_FRAME_GLOBAL_RELATIVE_ALT,
                      latitude: old[id].find(item => item.type === 'TAKEOFF')?.latitude,
                      longitude: old[id].find(item => item.type === 'TAKEOFF')?.longitude,
                    },
                  ],
                }
              : old
          })
        }
      }
    },
    [currentState, selectedDroneId, missionItems],
  )
  const dragWaypoint = useCallback(
    (item, droneId) => {
      const id = droneId || selectedDroneId
      console.log(subMode)
      if (
        (currentState === MissionState.WAYPOINT || currentState === MissionState.TAKEOFF) &&
        (subMode === 'mission' || gotoHereMode)
      ) {
        //const sel_wp = getWaypointCoordinates(+item.index)
        //if(sel_wp.latitude === item.org_lat && sel_wp.longitude === item.org_lng ){
        setDronesMissionItems(old => ({
          ...old,
          [id]: (old[id] || []).map((waypoint, i) =>
            i === item.index
              ? {
                  ...waypoint,
                  latitude: item.latitude,
                  longitude: item.longitude,
                }
              : waypoint,
          ),
        }))
      }
    },
    [selectedDroneId, currentState, subMode, gotoHereMode],
  )

  const removeWaypoint = useCallback(
    (index, droneId) => {
      const id = droneId || selectedDroneId
      setDronesMissionItems(old => ({
        ...old,
        [id]: (old[id] || []).filter((_, i) => i !== index),
      }))
    },
    [selectedDroneId],
  )
  const removeallWaypoint = useCallback(
    droneId => {
      const id = droneId || selectedDroneId
      setDronesMissionItems(old => ({
        ...old,
        [id]: [],
      }))
    },
    [selectedDroneId],
  )
  const removeDroneMission = useCallback(
    droneId => {
      setDronesMissionItems(old => {
        const newMissionItem = { ...old }
        delete newMissionItem[droneId]
        return newMissionItem
      })
    },
    [setDronesMissionItems],
  )

  const addTakeoff = useCallback(
    droneId => {
      addWaypoint({
        droneId: droneId || selectedDroneId,
        type: 'MAV_CMD_NAV_TAKEOFF',
        frame: mavFrameList.MAV_FRAME_GLOBAL_RELATIVE_ALT,
        //latitude: droneState[droneId || selectedDroneId]?.DroneRawState?.DR_LAT || map.current.getCenter().lat(),
        //longitude: droneState[droneId || selectedDroneId]?.DroneRawState?.DR_LON || map.current.getCenter().lng(),
        latitude:
          selectedDroneId === !'undefined'
            ? droneState[selectedDroneId]?.DroneRawState?.DR_LAT
            : map.current.getCenter().lat(),
        longitude:
          selectedDroneId === !'undefined'
            ? droneState[selectedDroneId]?.DroneRawState?.DR_LON
            : map.current.getCenter().lng(),
        altitude: DEFAULT_ALTITUDE,
      })
    },
    [addWaypoint, droneState, selectedDroneId],
  )

  const updateWaypoint = useCallback(
    (index, waypoint) => {
      setDronesMissionItems(old => {
        if (index === 0) {
          // mission start
          const allWPAltitude = waypoint.altitude
          return {
            ...old,
            [selectedDroneId]: old[selectedDroneId].map(wp => ({
              ...wp,
              altitude: allWPAltitude,
              frame: mavFrameList.MAV_FRAME_GLOBAL_RELATIVE_ALT,
            })),
          }
        }
        return {
          ...old,
          [selectedDroneId]: old[selectedDroneId].map((wp, i) => {
            if (i === index) {
              return waypoint
            } else {
              return wp
            }
          }),
        }
      })
    },
    [selectedDroneId],
  )

  const downloadMission = useCallback(() => {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(missionItems)))
    element.setAttribute('download', 'mission.json')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }, [missionItems])

  const setMapsCenterOn = useCallback(
    option => {
      if (option === 'vehicle') {
        if (droneState?.DroneRawState?.DR_LAT && droneState?.DroneRawState?.DR_LON) {
          map.current.setCenter({
            lat: droneState?.DroneRawState?.DR_LAT,
            lng: droneState?.DroneRawState?.DR_LON,
          })
        }
      } else if (option === 'mission') {
        const bounds = new maps.current.LatLngBounds()
        missionItems.forEach(missionItem => {
          if (missionItem.latitude && missionItem.longitude) {
            bounds.extend(new maps.current.LatLng(missionItem.latitude, missionItem.longitude))
          }
        })
        map.current.fitBounds(bounds)
      } else if (option === 'launch') {
        if (missionItems.length > 1) {
          map.current.setCenter({
            lat: missionItems[1].latitude,
            lng: missionItems[1].longitude,
          })
        }
      }
    },
    [missionItems, droneState?.DroneRawState],
  )

  return (
    <MissionContext.Provider
      value={{
        missionItems,
        AllmissionItems,
        ggWaypointss,
        subMode,
        setSubMode,
        currentState,
        addTakeoff,
        addWaypoint,
        updateWaypoint,
        removeWaypoint,
        removeallWaypoint,
        removeDroneMission,
        dragWaypoint,
        addingWaypointMode,
        addReturnPoint,
        createNewMission,
        setAddingWaypointMode,
        dragwaypointMode,
        setDragWaypointMode,
        downloadMission,
        setMapsCenterOn,
        gotoHereLocation,
        setGotoHereLocation,
        handleLoadMission,
        drawingPolygon,
        setDrawingPolygon,
        setMap: (mapRef, mapsRef) => {
          map.current = mapRef
          maps.current = mapsRef
        },
      }}>
      {children}
    </MissionContext.Provider>
  )
}

const MAV_CMD_MISSION_COMMANDS = [
  {
    name: 'MAV_CMD_NAV_WAYPOINT',
    code: 16,
    description: 'Navigate to waypoint',
  },
  {
    name: 'MAV_CMD_NAV_LOITER_UNLIM',
    code: 17,
    description: 'Loiter around this waypoint an unlimited amount of time',
  },
  {
    name: 'MAV_CMD_NAV_LOITER_TURNS',
    code: 18,
    description: 'Loiter around this waypoint for X turns',
  },
  {
    name: 'MAV_CMD_NAV_LOITER_TIME',
    code: 19,
    description: 'Loiter around this waypoint for X seconds',
  },
  {
    name: 'MAV_CMD_NAV_RETURN_TO_LAUNCH',
    code: 20,
    description: 'Return to launch location',
  },
  {
    name: 'MAV_CMD_NAV_LAND',
    code: 21,
    description: 'Land at location',
  },
  {
    name: 'MAV_CMD_NAV_TAKEOFF',
    code: 22,
    description: 'Takeoff from ground / hand',
  },
  {
    name: 'MAV_CMD_NAV_SPLINE_WAYPOINT',
    code: 82,
    description: 'Navigate to waypoint using spline path',
  },
  {
    name: 'MAV_CMD_NAV_VTOL_TAKEOFF',
    code: 84,
    description: 'Takeoff from ground / hand and transition to fixed wing',
  },
  {
    name: 'MAV_CMD_NAV_VTOL_LAND',
    code: 85,
    description: 'Land using VTOL mode',
  },
  {
    name: 'MAV_CMD_CONDITION_DELAY',
    code: 112,
    description: 'Delay mission state machine',
  },
  {
    name: 'MAV_CMD_CONDITION_CHANGE_ALT',
    code: 113,
    description: 'Ascend/descend to target altitude',
  },
  {
    name: 'MAV_CMD_CONDITION_DISTANCE',
    code: 114,
    description: 'Delay mission state machine until within desired distance of next NAV point',
  },
  {
    name: 'MAV_CMD_CONDITION_YAW',
    code: 115,
    description: 'Reach a certain target angle',
  },
  {
    name: 'MAV_CMD_DO_SET_MODE',
    code: 176,
    description: 'Set system mode',
  },
  {
    name: 'MAV_CMD_DO_JUMP',
    code: 177,
    description: 'Jump to the specified command in the mission list',
  },
  {
    name: 'MAV_CMD_DO_CHANGE_SPEED',
    code: 178,
    description: 'Change speed and/or throttle set points',
  },
  {
    name: 'MAV_CMD_DO_SET_HOME',
    code: 179,
    description: 'Changes the home location',
  },
  {
    name: 'MAV_CMD_DO_SET_PARAMETER',
    code: 180,
    description: 'Set a system parameter',
  },
  {
    name: 'MAV_CMD_DO_SET_RELAY',
    code: 181,
    description: 'Set a relay to a condition',
  },
  {
    name: 'MAV_CMD_DO_REPEAT_RELAY',
    code: 182,
    description: 'Cycle a relay on and off for a desired number of cycles',
  },
  {
    name: 'MAV_CMD_DO_SET_SERVO',
    code: 183,
    description: 'Set a servo to a desired PWM value',
  },
  {
    name: 'MAV_CMD_DO_REPEAT_SERVO',
    code: 184,
    description: 'Cycle a between its min and max PWM for a desired number of cycles',
  },
  {
    name: 'MAV_CMD_DO_LAND_START',
    code: 189,
    description: 'Mission command to perform a landing',
  },
  {
    name: 'MAV_CMD_DO_SET_ROI',
    code: 201,
    description: 'Sets the region of interest for cameras',
  },
  {
    name: 'MAV_CMD_DO_MOUNT_CONTROL',
    code: 205,
    description: 'Control onboard camera mounting',
  },
  {
    name: 'MAV_CMD_DO_SET_CAM_TRIGG_DIST',
    code: 206,
    description: 'Set camera trigger distance',
  },
]

const MAV_COMMAND_DICT = Object.fromEntries(MAV_CMD_MISSION_COMMANDS.map(i => [i.code, i]))
const MAV_COMMAND_CODE_DICT = Object.fromEntries(MAV_CMD_MISSION_COMMANDS.map(i => [i.name, i]))
const MAV_NAV_COMMANDS = MAV_CMD_MISSION_COMMANDS.filter(i => i.name.startsWith('MAV_CMD_NAV'))
const MAV_DO_COMMANDS = MAV_CMD_MISSION_COMMANDS.filter(i => i.name.startsWith('MAV_CMD_DO'))
