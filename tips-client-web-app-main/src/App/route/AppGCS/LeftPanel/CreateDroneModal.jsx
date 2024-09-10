/**
 * @file CreateDroneModal.jsx
 * @brief CreateOrUpdateDroneModal 정의
 * @details
 * 새로운 무인기를 연결하기 위한 정보를 입력 받는 UI
 * 연결된 무인기의 연결정보를 수정하는 UI
 * Profile을 생성하는 UI
 * Profile의 정보를 Server에서 받아 표시하는 코드
 * @date 2023-09-08
 * @version 1.0.0
 */
import { Dialog } from '@headlessui/react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'

import { GCSSelect } from '../common/GCSSelect'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GCSButton } from '../common/GCSButton'
import GCSInput from '../common/GCSInput'
import { GCSModal } from '../common/GCSModal'

import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

export const NewDroneModal = ({
  onAddNewDrone, editingDroneId, droneInput, setDroneInput, onProfilesInfo, setProfilesInfo,
  onStartProfile, onRemoveProfile, onEditProfile, ...props
}) => {
  const [serialPorts, setSerialPorts] = useState([])
  const {
    handleGetSerialPorts, handleRequstProfileInfo, profiledetailInfo
  } = useContext(SignalRContext)
  const [value, setValue] = useState('1')
  const [ProfileValue, setProfileValue] = useState('')
  const [profiles, setprofiles] = useState([])
  const [detailInfo, setDetailInfo] = useState({})

  /**
   * @ingroup HS001_F
   * @brief HENG_SW_001
   * @details 무인기 profile을 생성
   * Server에서 저장된 Profile의 정보를 받아 표시하는 UI
   * @note 현재 Profile을 생성 기능은 현재 연결된 무인기의 정보를 저장시키는 방식으로 무인기가 연결이 되지 않으면 생성되지 않는다.
   * Profile 수정 기능은 기존에 저장된 Profile을 불러와 수정하는 기능으로 무인기를 추가하는 기능은 없다.
   */
  const SelectProfileInfo = () => {
    return (
      <div style={{ color: 'black' }}>
        <span>Drone Count: {detailInfo?.count}</span>
        {/*<div>BoxBoxBoxBoxBox</div>*/}
        <Box
          minWidth={385}
          height={300}
          sx={{
            overflowY: 'scroll',
            border: '1px solid black',
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none',
            '&::-webkit-scrollbar': {
              width: '0.1em', height: '0.1em',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {
            Object.keys(detailInfo).map((key) => {
              if (key !== 'count') {
                const droneDetail = detailInfo[key]
                return (
                  <Box
                    width={350}
                    height={'auto'}
                    component="fieldset"
                    key={key}
                    sx={{ padding: '4px', margin: 'auto', p: 2, border: '1px solid gray' }}
                  >
                    <legend style={{ fontSize: '14px', fontWeight: 'bold' }}>Drone {key}</legend>
                    <div className="flex relative -left-2 -top-3 text-sm" style={{ width: '100%', height: '100%' }}>
                    Protocol:
                      {droneDetail && (<GCSSelect
                        className="flex-1 relative left-1 -top-2 h-8 w-20 mb-0 p-1 text-base"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={droneDetail.ConnectionProtocol}
                        options={[{
                          value: 'TCP', label: 'TCP',
                        }, {
                          value: 'UDP', label: 'UDP',
                        }, {
                          value: 'UDPIC', label: 'UDPIC',
                        }, {
                          value: 'SERIAL', label: 'SERIAL',
                        },]}
                        onChange={(v) => handleInputChange(key, 'ConnectionProtocol', v.target.value)}
                      />)}
                    </div>

                    {droneDetail.ConnectionProtocol === 'SERIAL' ? (<div className="flex relative -left-2 -top-5 max-h-9">
                      <label className="text-sm">Port:</label>
                      <GCSSelect
                        className="flex-1 relative -top-2 left-7 h-8 w-20 mb-0 py-0 p-1"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={droneDetail.serialPort || ''}
                        options={[{ value: undefined, label: ' ' }, ...serialPorts.map(port => ({
                          value: port, label: port
                        })),]}
                        onChange={(v) => handleInputChange(key, 'serialPort', v.target.value)}
                      />
                      <label className=" text-sm relative left-10">baudrate:</label>
                      <GCSSelect
                        className=" relative -top-2 left-12 h-8 w-20 mb-0 py-0 px-1"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={droneDetail.baudrate || 57600}
                        options={[...[75, 150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400].map(rate => ({
                          value: rate, label: rate,
                        })),]}
                        onChange={(v) => handleInputChange(key, 'baudrate', v.target.value)}
                      />
                    </div>) : (<div className="flex relative -left-2 -top-5">
                      <label className="text-sm">Address:</label>
                      <input
                        value={droneDetail.localAddress || ''}
                        type="text"
                        style={{ fontSize: '12px' }}
                        className={`form-control flex-1 relative -top-2 left-1
 p-1 w-5/12 max-w-xs input  block text-gray-700 bg-white bg-clip-padding
 border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none 
 `}
                        onChange={(v) => handleInputChange(key, 'localAddress', v.target.value)}
                      />
                    </div>)}
                    <div className="flex relative -left-2 -top-3">
                      <label className="text-sm">Drone Role:</label>
                      <GCSSelect
                        className="flex-auto relative -top-2 left-2 h-8 w-40 mb-0 p-1"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={detailInfo[key]?.role || ''}
                        options={[{
                          value: '', label: 'Nomal',
                        }, {
                          value: 'Rec', label: '감시 정찰',
                        }, {
                          value: 'fire', label: '화재 진압',
                        }, {
                          value: 'supply', label: '보급 지원',
                        },]}
                        onChange={(v) => handleInputChange(key, 'role', v.target.value)}
                      />
                    </div>

                    <div className="flex relative -left-2 -top-5 max-h-9">
                      <label className="text-sm">Team:</label>
                      <GCSSelect
                        className="flex-1 relative -top-2 left-2 h-8 w-20 mb-0 p-1"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={droneDetail.TeamName || ''}
                        options={[{
                          value: undefined, label: 'None'
                        }, {
                          value: 'Team 1', label: 'Team1'
                        }, {
                          value: 'Team 2', label: 'Team2'
                        }, {
                          value: 'Team 3', label: 'Team3'
                        }
                        //...serialPorts.map(port => ({ value: port, label: port })),
                        ]}
                        onChange={(v) => handleInputChange(key, 'TeamName', v.target.value)}
                      />
                      <label className=" text-sm relative left-10">Teamleder:</label>
                      <GCSSelect
                        className=" relative -top-2 left-12 h-8 w-20 mb-0 py-0 px-1"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={droneDetail.TeamLeader || ''}
                        options={[{
                          value: undefined, label: 'None'
                        }, {
                          value: '1', label: 'Leader'
                        }, {
                          value: '2', label: '팀원'
                        },]}
                        onChange={(v) => handleInputChange(key, 'TeamLeder', v.target.value)}
                      />
                    </div>

                    <div className="flex relative -left-2 -top-3">
                      <label className="text-sm">CameraType:</label>
                      <GCSSelect
                        className="flex-auto relative -top-2 left-2 h-8 w-40 mb-0 p-1"
                        style={{ marginLeft: '1px', fontSize: '10px' }}
                        value={detailInfo[key]?.cameraprotocol || ''}
                        options={[{
                          value: 'Cam1', label: '30X Camera',
                        }, {
                          value: 'Cam2', label: '10X Camera',
                        },]}
                        onChange={(v) => handleInputChange(key, 'cameraprotocol', v.target.value)}
                      />
                    </div>


                    <div className="flex relative -left-2 -top-5">
                      <label className="text-sm">Camera Control IP:</label>
                      <input
                        value={detailInfo[key]?.cameraIP || ''}
                        type="text"
                        style={{ fontSize: '12px' }}
                        className={`form-control flex-1 relative  -top-2 left-1 p-1  w-5/12 max-w-xs input  block text-gray-700
 bg-white bg-clip-padding border border-solid border-gray-300
 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none 
 `}
                        onChange={(v) => handleInputChange(key, 'cameraIP', v.target.value)}
                      />
                    </div>

                    <div className="flex relative -left-2 -top-3">
                      <label className="text-sm">Camera URL1:</label>
                      <input
                        value={detailInfo[key]?.cameraURL1 || ''}
                        type="text"
                        style={{ fontSize: '12px' }}
                        className={'form-control flex-1 relative  -top-2 left-1 p-1  w-5/12 max-w-xs input  block text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'}
                        onChange={(v) => handleInputChange(key, 'cameraURL1', v.target.value)}
                      />
                    </div>

                    <div className="flex relative -left-2 -top-2">
                      <label className="text-sm">Camera URL2:</label>
                      <input
                        value={detailInfo[key]?.cameraURL2 || ''}
                        type="text"
                        style={{ fontSize: '12px' }}
                        className={`form-control flex-1
 relative -top-1 left-1 p-1  w-5/12 max-w-xs input  block text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition
 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none 
 `}
                        onChange={(v) => handleInputChange(key, 'cameraURL2', v.target.value)}
                      />
                    </div>
                  </Box>)
              } else
                return <div></div>
            })}
        </Box>
      </div>)
  }

  useEffect(() => {
    console.log(detailInfo)
  }, [setDetailInfo, detailInfo])

  const handleInputChange = useCallback((key, field, tagetvalue) => {
    setDetailInfo((old) => {
      let updatedDetailInfo = { ...old }

      if (tagetvalue === 'SERIAL' && !updatedDetailInfo[key]?.serialPort) {
        updatedDetailInfo[key] = {
          ...updatedDetailInfo[key], serialPort: '', baudrate: '',
        }
      }
      if (tagetvalue === 'UDP' || tagetvalue === 'TCP' || tagetvalue === 'UDPCI') {
        delete updatedDetailInfo[key]?.serialPort
        delete updatedDetailInfo[key]?.baudrate
      }

      if (!updatedDetailInfo[key]) {
        updatedDetailInfo[key] = {}
      }

      updatedDetailInfo[key][field] = tagetvalue

      return updatedDetailInfo
    })
  }, [setDetailInfo])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleProname = (e) => {
    console.log('SetProfileValue 값이 변경됨 : ', e.target.value)
    setProfileValue(e.target.value)
    handleRequstProfileInfo(e.target.value)

  }

  function RemoveProfile(rename) {
    setprofiles(profiles.filter(value => value !== rename))
    setProfileValue('')
  }

  useEffect(() => {
    function fetchprofiledetailinfo() {
      const res = profiledetailInfo
      if (res) {
        return setDetailInfo(res)
      } else {
        return setDetailInfo([])
      }
    }

    //console.log(detailInfo)
    fetchprofiledetailinfo()
  }, [profiledetailInfo])


  useEffect(() => {
    async function fetchSerialPort() {
      if (props.open) {
        const res = await handleGetSerialPorts()
        if (res) {
          return setSerialPorts(res)
        }
      }
    }

    fetchSerialPort()
  }, [handleGetSerialPorts, props.open])

  useEffect(() => {
    function fetchprofileInfo() {
      if (props.open) {
        const pros = onProfilesInfo
        if (pros) {
          return setprofiles(pros)
        }
      }
    }

    fetchprofileInfo()
  }, [onProfilesInfo, props.open,])

  /**
   * @ingroup HS001_F
   * @brief HENG_SW_001
   * @details 새로운 무인기 연결 UI
   * 새롭게 연결될 무인기의 연결정보를 입력하는 UI
   * @note Add new Link 버튼을 클릭 시 팝업되는 UI이다.
   */
  return (

    <GCSModal {...props}>
      <div className="bg-white p-2">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="New Link" value="1"/>
                <Tab label="ProFile" value="2"/>
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box minWidth={385}>
                <Dialog.Title>
                  <h3 className="font-bold text-lg flex justify-center text-black">Add new Drone Connection</h3>
                </Dialog.Title>
                <GCSSelect
                  label="Protocol"
                  value={droneInput.connectionLink}
                  options={[{
                    value: undefined, label: 'CommunicationLink',
                  }, {
                    value: 'TCP', label: 'TCP',
                  }, {
                    value: 'UDP', label: 'UDP',
                  }, {
                    value: 'UDPCI', label: 'UDPCI',
                  },

                  {
                    value: 'SERIAL', label: 'SERIAL',
                  },]}
                  onChange={v => setDroneInput(old => ({ ...old, connectionLink: v.target.value }))}
                />
                {droneInput.connectionLink === 'SERIAL' ? (<>
                  <GCSSelect
                    value={droneInput.serialPort}
                    options={[{
                      value: undefined, label: 'Select Serial Port'
                    }, ...serialPorts.map(port => ({ value: port, label: port })),]}
                    onChange={v => setDroneInput(old => ({ ...old, serialPort: v.target.value }))}></GCSSelect>
                  <GCSSelect
                    className="select w-full max-w-xs"
                    value={droneInput.baudrate}
                    options={[{
                      value: undefined, label: 'Select Baudrate'
                    }, ...[75, 150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200, 230400].map(rate => ({
                      value: rate, label: rate,
                    })),]}
                    onChange={v => setDroneInput(old => ({ ...old, baudrate: v.target.value }))}></GCSSelect>
                </>) : (<GCSInput
                  value={droneInput.address}
                  onChange={v => setDroneInput(old => ({ ...old, address: v.target.value }))}
                  type="text"
                  label="Address"
                  className="input w-full max-w-xs"
                />)}
                <div className="modal-action flex flex-row-reverse">
                  <GCSButton
                    htmlFor="my-modal"
                    type="dark"
                    onClick={() => {
                      onAddNewDrone(droneInput)
                      setDroneInput({})
                    }}>
                    Add
                  </GCSButton>
                </div>
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box width={385} height={detailInfo ? 'auto' : 180} marginBottom={3}>
                <Dialog.Title>
                  <h3 className="font-bold text-lg text-black mb-2">Select ProFile</h3>
                </Dialog.Title>
                <GCSSelect
                  value={ProfileValue}
                  options={[{
                    value: undefined, label: 'Select ProFile'
                  }, ...profiles.map(profiles => ({ value: profiles, label: profiles })),]}
                  onChange={handleProname}
                ></GCSSelect>

                <div>
                  <SelectProfileInfo />
                </div>
              </Box>
              <div className="modal-action flex flex-row-reverse">
                <GCSButton
                  htmlFor="my-modal"
                  type="dark"
                  onClick={() => {
                    onStartProfile(ProfileValue)
                  }}>
                  Start
                </GCSButton>
                <GCSButton
                  className="relative right-[25px]"
                  htmlFor="my-modal"
                  type="dark"
                  onClick={() => {
                    onEditProfile(ProfileValue, detailInfo)
                  }}>
                  save
                </GCSButton>
                <GCSButton
                  className="relative right-[128px]"
                  htmlFor="my-modal"
                  type="danger"
                  onClick={() => {
                    onRemoveProfile(ProfileValue)
                    RemoveProfile(ProfileValue)
                  }}>
                  Delete
                </GCSButton>

              </div>

            </TabPanel>
          </TabContext>
        </Box>
      </div>
    </GCSModal>)
}

/**
 * @ingroup HS001_F
 * @brief HENG_SW_001
 * @details Make Profile의 UI 이다.
 * 저장될 Profile의 이름을 입력받아 Server에 전달하는 기능이 있다.
 * @note Add new Link 버튼을 클릭 시 팝업되는 UI이다.
 */

