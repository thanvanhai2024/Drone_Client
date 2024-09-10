import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { MissionContext } from '../components/MissionContext'
import { NewDroneModal } from './CreateDroneModal'
import { ControlButton, SubButtom } from '../components/DroneControlButtonsPanel'
import { MavlinkParametersModal } from '../components/MavlinkParametersModal'
import { GCSMenu } from '../common/GCSMenu'
import { SideDivTitle } from '../RightPanel/RightPanelCommonComponent'
import { GCSLoadingBar } from '../common/GCSLoadingBar'
import sidebarDrone from '../../../../resources/sidebardrone.png'
import DeliveryMissionTable from './SideTable'
import { EditDroneModal } from './EditDroneModal'
import { NewProfileModal } from './NewProfileModal'
import { useSubscribe } from '../../common/useRxjs'

export const SidebarWrapper = styled.div`
  background: #1d1d41;
  padding: 1em;
  height: 100%;
`

const DroneItem = styled.div`
  //padding: 1em;
  color: #fff;
  height: 50px;
  width: 200px;
  border-radius: 3px;
  border-color: #8c89b4;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  ${props =>
    props.active &&
    css`
      background: #6359e9;
    `};
`

const WaypointItem = styled.div`
  color: #fff;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const FLIGHT_MODE_TO_STR = {
  0: 'Stabilize',
  3: 'Auto',
  5: 'Loiter',
  6: 'RTL',
  9: 'LAND',
  16: 'PosH',
  2: 'AltH',
  17: 'Brake',
  4: 'Guided',
}

export const SidebarComponent = ({ handleSidebarWPClicked }) => {
  const [showModal, setShowModal] = useState(false)
  const [showMakeP, setShowMakeP] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDroneId, setEditingDroneId] = useState()
  const [showParameters, setShowParameters] = useState(false)
  const [droneInput, setDroneInput] = useState({})
  const [proName, setProName] = useState('')

  const { removeDroneMission } = useContext(MissionContext)

  const {
    mavParametersDownloadProgress,
    droneDeliveryInfos,
    handleUpdateDroneSelectedId,
    handleUpdateCenterDrone,
    selectedDroneId,
    handleAddNewDroneConnection,
    handleEditNewDroneConnection,
    handleStartProfileConnection,
    handleDisconnectDroneConnection,
    handleAddNewProfileConnection,
    handleUpdateProfileInfo,
    UpdateProfileInfo,
    setUpdateProfileInfo,
    handleRemoveProfileSend,
    ParamInfo,
    handleRequstProfileInfo,
    handleEditProFileInfo,
    baseDroneStatesObservable,
    selectedDroneStateObservable,
  } = useContext(SignalRContext)

  const [droneStates] = useSubscribe(baseDroneStatesObservable, {})
  const [droneStateWithId] = useSubscribe(selectedDroneStateObservable)
  // console.log(droneStates)
  // console.log('run here',selectedDroneId)
  const droneDeliveryInfo = useMemo(
    () => (selectedDroneId && droneDeliveryInfos[selectedDroneId]) || {},
    [droneDeliveryInfos, selectedDroneId],
  )
  const droneState = droneStateWithId?.droneState
  const [Isbool, setIsbool] = useState(false)

  useEffect(() => {
    if (!Isbool) {
      handleUpdateCenterDrone(selectedDroneId)
    }
  }, [Isbool, handleUpdateCenterDrone, selectedDroneId])

  useEffect(() => {
    if (droneState?.cameraAddress1 || droneState?.cameraAddress2 || droneState?.CameraControlAddress) {
      setDroneInput({
        cameraAddress1: droneState?.cameraAddress1,
        cameraAddress2: droneState?.cameraAddress1,
        cameraControlAddress: droneState?.CameraControlAddress,
      })
    }
  }, [droneState?.cameraAddress1, droneState?.cameraAddress2, droneState?.CameraControlAddress])

  const handleAddNewDrone = useCallback(
    drone => {
      if (drone.connectionLink === 'SERIAL') {
        handleAddNewDroneConnection(drone.connectionLink, drone.serialPort + ':' + drone.baudrate)
      } else {
        handleAddNewDroneConnection(drone.connectionLink, drone.address)
      }
      setShowModal(false)
    },
    [handleAddNewDroneConnection],
  )

  const handleEditDrone = useCallback(
    input => {
      handleEditNewDroneConnection(
        editingDroneId,
        input.cameraType || 'Cam1',
        input.cameraControlAddress,
        input.cameraAddress1,
        input.cameraAddress2,
        input.cameraIframe,
        input.cameraMasking,
      )
      setShowEditModal(false)
    },
    [handleEditNewDroneConnection, editingDroneId],
  )

  const handleStartProfile = useCallback(
    profilename => {
      handleStartProfileConnection(profilename)
      setShowModal(false)
    },
    [handleStartProfileConnection],
  )

  const handleRemoveProfile = useCallback(
    removename => {
      if (removename !== '') {
        handleRemoveProfileSend(removename)
      }
    },
    [handleRemoveProfileSend],
  )

  const handleAddNewwProFile = useCallback(
    pname => {
      handleAddNewProfileConnection(pname)
      setShowMakeP(false)
    },
    [handleAddNewProfileConnection],
  )

  const handleEditProFile = useCallback(
    (profilename, info) => {
      handleEditProFileInfo(profilename, info)
    },
    [handleEditProFileInfo],
  )

  const handleDisconnectDrone = useCallback(() => {
    handleDisconnectDroneConnection(editingDroneId)
    removeDroneMission(editingDroneId)
    setShowEditModal(false)
  }, [handleDisconnectDroneConnection, editingDroneId, removeDroneMission])

  return (
    <div>
      <ControlButton
        onClick={() => {
          setShowModal(true)
          handleUpdateProfileInfo()
        }}
        className="mb-3">
        Add new Link
      </ControlButton>
      <div className="flex">
        <SideDivTitle title="등록 드론" />
        <SubButtom onClick={() => setShowMakeP(true)} className="mb-3">
          Make Profile
        </SubButtom>
      </div>

      <div className="mb-[10px]">
        {Object.keys(droneStates)
          .filter(droneId => droneStates[droneId].IsOnline)
          .map((droneId, index) => (
            <div key={index} className="flex flex-col mb-1">
              <DroneItem
                style={
                  droneId === selectedDroneId
                    ? { background: 'linear-gradient(163deg, #3064FE 8.32%, #122767 92.43%)' }
                    : {}
                }
                key={droneId}
                onClick={() => {
                  handleUpdateDroneSelectedId(droneId)
                }}
                active={(selectedDroneId === droneId).toString()}>
                <div className={'flex'}>
                  <div className={'flex items-center mr-1'}>
                    <img src={sidebarDrone} style={{ width: '50px' }} alt={'sidebarDrone'} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-md mr-2 text-orange-400 w-[80px] overflow-hidden">
                        {droneStates[droneId]?.DroneName}
                      </span>
                      <StatusDot
                        severity={droneStates[droneId]?.DroneRawState?.MAV_SYS_STATUS}
                        isOnline={droneStates[droneId].IsOnline}
                      />
                      <div className="flex items-center">
                        <GCSMenu
                          className="z-30 relative"
                          items={[
                            {
                              label: 'Edit Connection',
                              onClick: e => {
                                e.stopPropagation()
                                setShowEditModal(true)
                                setEditingDroneId(droneId)
                              },
                            },
                            {
                              label: 'Parameters',
                              onClick: e => {
                                e.stopPropagation()
                                setShowParameters(true)
                              },
                            },
                          ]}>
                          <div
                            className="right-[3px] w-7 h-6"
                            onMouseEnter={() => {
                              setIsbool(old => !old)
                            }}
                            onMouseLeave={() => {
                              setIsbool(false)
                            }}>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-5">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                />
                              </svg>
                            </div>
                          </div>
                        </GCSMenu>
                      </div>
                      {/*<span className="text-yellow-200 text-lg">*/}
                      {/*  {droneStates[droneId]?.DroneRawState?.POWER_V}v*/}
                      {/*</span>{' '}*/}
                    </div>
                    {FLIGHT_MODE_TO_STR[droneStates[droneId]?.DroneRawState?.FLIGHT_MODE]}{' '}
                  </div>
                </div>
              </DroneItem>

              {mavParametersDownloadProgress[droneId] &&
              mavParametersDownloadProgress[droneId].Current < mavParametersDownloadProgress[droneId].Total - 1 ? (
                <GCSLoadingBar
                  isThin
                  percentage={
                    (mavParametersDownloadProgress[droneId].Current / mavParametersDownloadProgress[droneId].Total) *
                    100
                  }
                />
              ) : null}
            </div>
          ))}
      </div>

      <SideDivTitle title="Waypoints" />

      <div>
        {(droneDeliveryInfo.Waypoints || []).map((waypoint, i) => (
          <WaypointItem key={i} onClick={() => handleSidebarWPClicked(i)}>
            <div>{`${waypoint.WP_S2D_NO}번 고도`}</div>
            <div>{waypoint.WP_S2D_ALT}</div>
          </WaypointItem>
        ))}
      </div>
      <DeliveryMissionTable />
      {showModal && (
        <NewDroneModal
          droneInput={droneInput}
          setDroneInput={setDroneInput}
          open={showModal}
          onClose={() => {
            setShowModal(false)
            handleRequstProfileInfo('')
          }}
          onAddNewDrone={handleAddNewDrone}
          onProfilesInfo={UpdateProfileInfo}
          setProfilesInfo={setUpdateProfileInfo}
          onStartProfile={handleStartProfile}
          onRemoveProfile={handleRemoveProfile}
          onEditProfile={handleEditProFile}
        />
      )}
      {showEditModal && (
        <EditDroneModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onDisconnectionDrone={handleDisconnectDrone}
          onEditDrone={handleEditDrone}
          droneState={droneState}
        />
      )}
      {showParameters && (
        <MavlinkParametersModal
          open={showParameters}
          ParamInfo={ParamInfo}
          onClose={() => setShowParameters(false)}
          droneId={selectedDroneId}
        />
      )}
      {showMakeP && (
        <NewProfileModal
          proName={proName}
          setProName={setProName}
          open={showMakeP}
          onClose={() => setShowMakeP(false)}
          onAddNewProfile={handleAddNewwProFile}
        />
      )}
    </div>
  )
}

const StatusDot = ({ severity, isOnline }) => {
  const getStatusDotColor = () => {
    if (!isOnline || severity < 4) {
      return 'bg-red-600'
    } else if (severity === 5) {
      return 'bg-yellow-600'
    } else {
      return 'bg-green-600'
    }
  }
  return <div className={`rounded-full m-2 w-3 h-3 ${getStatusDotColor()}`} />
}
