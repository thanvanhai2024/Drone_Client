import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { baseGCSPath } from '../../common/path'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import {
  DRONE_POWER_V_THRESHOLD,
  DRONE_TEMPERATURE_C_THRESHOLD,
  DRONE_POWER_V_HARD_THRESHOLD,
} from '../../common/Constants'
import { useSubscribe } from '../../common/useRxjs'

const DeliveryMissionHeader = [
  '배달 거점',
  '배달점',
  '배달 주소',
  '접수 시간',
  '배송품',
  '드론 아이디',
  '배송 상태',
  '임무 할당',
  '수동 배송',
  '수동 완료'
]

const DeliverySpot = ['유구천주차장', '산성시장공영주차장', '마곡사관광단지야외무대']

const Select = styled.select`
  background: white;
  color: black;
  font-weight: normal;
`

const Option = styled.option`
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 4px;
`

export const DeliveryMissionListModal = props => {
  const [deliveryMissionList, setDeliveryMissionList] = useState()
  const [requestType, setRequestType] = useState('notallocated') // 'all', 'notallocated', 'completed'

  // Thai: this is over complicate
  // const [reload, toogleReload] = useReducer(
  //   reload => !reload, true
  // )
  const [selectedHub, setSelectedHub] = useState('') // 선택된 배달 거점

  const onReload = () => {
    reloadData()
  }

  const handleRadioRequestType = reqType => {
    setRequestType(reqType)
  }

  const fetchAllDeliveryMissionList = async () => {
    try {
      const res = await fetch(`${baseGCSPath}/api/mission-select-all`, {
        method: 'GET',
      })
      if (res.ok) {
        // console.log('요청 성공')
        const data = await res.json()
        setDeliveryMissionList(data)
        // console.log(data)
      } else {
        console.error('요청 실패')
      }
    } catch (e) {
      console.error('요청 중 오류 발생', e)
    }
  }

  const fetchNotAllocatedDeliveryMissionList = async () => {
    try {
      const res = await fetch(`${baseGCSPath}/api/mission-select-notallocated`, {
        method: 'GET',
      })
      if (res.ok) {
        // console.log('요청 성공')
        const data = await res.json()
        setDeliveryMissionList(data)
        // console.log(data)
      } else {
        console.error('요청 실패')
      }
    } catch (e) {
      console.error('요청 중 오류 발생', e)
    }
  }

  const fetchCompletedDeliveryMissionList = async () => {
    try {
      const res = await fetch(`${baseGCSPath}/api/mission-select-notcompleted`, {
        method: 'GET',
      })
      if (res.ok) {
        // console.log('요청 성공')
        const data = await res.json()
        setDeliveryMissionList(data)
      } else {
        console.error('요청 실패')
      }
    } catch (e) {
      console.error('요청 중 오류 발생', e)
    }
  }

  const reloadData = useCallback(() => {
    if (requestType === 'all') {
      fetchAllDeliveryMissionList()
    }

    if (requestType === 'notallocated') {
      fetchNotAllocatedDeliveryMissionList()
    }

    if (requestType === 'notcompleted') {
      fetchCompletedDeliveryMissionList()
    }
  }, [requestType])

  useEffect(() => {
    reloadData()
  }, [reloadData])

  const filteredMissions = selectedHub
    ? deliveryMissionList?.filter(mission => mission.START_SPOT === selectedHub)
    : deliveryMissionList

  return (
    <div
      style={{ background: 'linear-gradient(163deg, #2146b1 8.32%, #132865 92.43%)' }}
      className={'modal w-[1152px] h-[550px] rounded-lg text-white'}>

      <div className={'flex flex-row'}>
        <div className={'flex text-3xl'}>
          <span className={'mt-3 ml-5'}>물품배송 임무 리스트</span>
        </div>

        <div className={'flex flex-row mt-auto ml-auto mr-20'}>
          <label className={'mx-5'}>
            배달 거점 선택:
            <Select onChange={e => setSelectedHub(e.target.value)} className={'ml-2'}>
              <Option value="">전체</Option>
              {DeliverySpot.map((spot, index) => (
                <Option key={index} value={spot}>
                  {spot}
                </Option>
              ))}
            </Select>
          </label>

          <label className={'mx-5'}>
            <input
              type={'radio'}
              name="options"
              value={'notallocated'}
              defaultChecked
              onChange={() => handleRadioRequestType('notallocated')}
              className={'mx-1'}
            />{' '}
            할당 예정 미션
          </label>
          <label className={'mx-5'}>
            <input
              type={'radio'}
              name="options"
              value={'notcompleted'}
              onChange={() => handleRadioRequestType('notcompleted')}
              className={'mx-1'}
            />{' '}
            미완료 미션
          </label>
          <label className={'mx-5'}>
            <input
              type={'radio'}
              name="options"
              value={'all'}
              onChange={() => handleRadioRequestType('all')}
              className={'mx-1'}
            />{' '}
            전체 미션
          </label>
        </div>
      </div>

      <hr className={' mx-4 my-3 border-white'} />

      <div className={'flex px-4 justify-center'}>
        <div className={'flex flex-col w-full h-[400px] bg-white text-black'}>
          <DeliveryMissionTable deliveryMissionList={filteredMissions} reloadData={onReload} />
        </div>
      </div>

      <hr className={'mx-4 my-3 border-white'} />

      <div className={'flex justify-end'}>
        <button
          className={
            'mr-2.5 py-1 px-1 rounded-sm border-[1px] border-black bg-white hover:bg-[#3064FE] font-semibold text-md text-black'
          }
          onClick={onReload}>
          새로고침
        </button>
        <button
          className={
            'mr-4 py-1 px-1 rounded-sm border-[1px] border-black bg-white hover:bg-[#3064FE] font-semibold text-md text-black'
          }
          onClick={props.toogleIsDeliveryMissionListModal}>
          닫기
        </button>
      </div>
    </div>
  )
}

const DeliveryMissionTable = props => {
  const { selectedDroneStateObservable, handleSendDeliveryMission } = useContext(SignalRContext)
  const [ds] = useSubscribe(selectedDroneStateObservable)
  const droneState = ds?.droneState

  const [isAllocateModal, setIsAllocateModal] = useState(false)
  const [missionIndex, setMissionIndex] = useState(0)

  const currentTemperature = droneState?.DroneRawState.TEMPERATURE_C
  const currentPower = droneState?.DroneRawState.POWER_V

  const handleCompulsoryComplete = async (droneName, missionId) => {
    try {
      const data = {
        droneName: droneName,
        missionId: missionId,
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }

      const res = await fetch(`${baseGCSPath}/api/compulsory-mission-complete`, requestOptions)

      if (res.ok) {
        console.log('강제 완료 성공')
      } else {
        console.log('강제 완료 실패')
      }
    } catch (e) {
      console.log('강제 완료 중 오류 발생', e)
    }
  }

  const handleCompulsoryInMission = async (droneName, missionId) => {
    try {
      const data = {
        droneName: droneName,
        missionId: missionId,
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }

      const res = await fetch(`${baseGCSPath}/api/compulsory-in-mission`, requestOptions)

      if (res.ok) {
        console.log('강제 배송 성공')
      } else {
        console.log('강제 배송 실패')
      }
    } catch (e) {
      console.log('강제 배송 중 오류 발생', e)
    }
  }

  const handleAllocateMission = () => {
    handleSendDeliveryMission(
      props.deliveryMissionList[missionIndex].MISSION_ID,
      props.deliveryMissionList[missionIndex].WAY_POINTS,
    )
    setTimeout(() => {
      props.reloadData()
    }, '3000')
  }

  const AllocatedDrone = index => {
    setMissionIndex(index)

    if (currentTemperature >= DRONE_TEMPERATURE_C_THRESHOLD || currentPower <= DRONE_POWER_V_THRESHOLD) {
      toast.error(
        `임무 할당 거절 (전압: ${droneState.DroneRawState.POWER_V}V, 온도: ${droneState.DroneRawState.TEMPERATURE_C}°C)`,
      )
    } else if (currentPower <= DRONE_POWER_V_HARD_THRESHOLD) {
      setIsAllocateModal(true)
      console.log(isAllocateModal)
    } else {
      handleAllocateMission()
    }
  }

  const CompulsoryComplete = index => {
    let droneName
    if (props.deliveryMissionList[index].DRONE_ID === null) {
      droneName = 'Forced completion'
    } else {
      droneName = props.deliveryMissionList[index].DRONE_ID
    }
    const missionId = props.deliveryMissionList[index].MISSION_ID
    handleCompulsoryComplete(droneName, missionId)
    setTimeout(() => {
      props.reloadData()
    }, '2000')
  }

  const CompulsoryInMission = index => {
    let droneName
    if (props.deliveryMissionList[index].DRONE_ID === null) {
      droneName = 'Forced in mission'
    } else {
      droneName = props.deliveryMissionList[index].DRONE_ID
    }
    const missionId = props.deliveryMissionList[index].MISSION_ID
    handleCompulsoryInMission(droneName, missionId)
    setTimeout(() => {
      props.reloadData()
    }, '2000')
  }

  const formatDate = inputDate => {
    const date = new Date(inputDate)

    // Year, month, day extraction
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2) // Month is zero indexed
    const day = `0${date.getDate()}`.slice(-2)

    // Time extraction (hours and minutes)
    const hours = `0${date.getHours()}`.slice(-2)
    const minutes = `0${date.getMinutes()}`.slice(-2)

    // Formatted string
    return `${year}-${month}-${day} (${hours}:${minutes})`
  }

  return (
    <div className={'flex flex-col justify-start h-full overflow-scroll border border-black text-center'}>
      <table id="delivery-mission-table" className={'h-full w-full'}>
        <thead className={'flex flex-1'}>
          <tr className={'flex flex-row text-black font-bold'}>
            {DeliveryMissionHeader.map((e, i) => {
              return e === '배달 주소' ? (
                <th
                  className={'flex flex-col justify-center w-[210px] h-[30px] border-r border-b border-black '}
                  key={i}>
                  <span className={'flex flex-row justify-center'}>{e}</span>
                </th>
              ) : (
                <th
                  className={'flex flex-col justify-center w-[130px] h-[30px] border-r border-b border-black '}
                  key={i}>
                  <span className={'flex flex-row justify-center'}>{e}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className={'flex flex-col justify-around w-full'}>
          {props.deliveryMissionList?.map((item, index) => (
            <tr className={'flex flex-row border-black'} key={index}>
              <TableCell key={`START_SPOT${index}`} value={item.START_SPOT} />
              <TableCell key={`DELIVERY_SPOT${index}`} value={item.DELIVERY_SPOT} />
              <td
                className={'flex flex-row justify-center items-center h-[30px] w-[210px] border border-r font-normal'}>
                <span key={`DELIVERY_SPOT${index}`} className="flex flex-row justify-center w-full text-xs">
                  {item.ADDRESS}
                </span>
              </td>
              <TableCell key={`DATE_OF_RECEIPT${index}`} value={formatDate(item.DATE_OF_RECEIPT)} />
              <TableCell key={`DELIVERY_ITEM${index}`} value={item.DELIVERY_ITEM} />
              {/*<TableCell key={`ADDRESSEE${index}`} value={item.RECIPIENT}/>*/}
              <TableCell key={`DRONE_ID${index}`} value={item.DRONE_ID ?? '미할당'} />
              <TableCell key={`DELIVERY_RESULT${index}`} value={item.DELIVERY_RESULT === 0 ? '완료' : '미완료'} />
              {/* 임무 완료 */}
              <td
                className={'flex flex-row justify-center items-center h-[30px] w-[130px] border border-r font-normal'}>
                <span className="flex flex-row justify-center w-full text-xs">
                  <button
                    className={'px-2 py-0.5 rounded-2xl border bg-[#1d1d41] hover:bg-[#3064FE] text-white'}
                    onClick={() => AllocatedDrone(index)}>
                    Click
                  </button>
                </span>
              </td>
              {/* 강제 배송 */}
              <td
                className={'flex flex-row justify-center items-center h-[30px] w-[130px] border border-r font-normal'}>
                <span className="flex flex-row justify-center w-full text-xs">
                  <button
                    className={'px-2 py-0.5 rounded-2xl border bg-[#009900] hover:bg-[#f5c211] text-white'}
                    onClick={() => CompulsoryInMission(index)}>
                    InMission
                  </button>
                </span>
              </td>
              {/* 강제 완료 */}
              <td
                className={'flex flex-row justify-center items-center h-[30px] w-[130px] border border-r font-normal'}>
                <span className="flex flex-row justify-center w-full text-xs">
                  <button
                    className={'px-2 py-0.5 rounded-2xl border bg-[#c01c28] hover:bg-[#f5c211] text-white'}
                    onClick={() => CompulsoryComplete(index)}>
                    Complete
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAllocateModal ? (
        <AllocateModal
          currentPower={currentPower}
          setIsAllocateModal={setIsAllocateModal}
          handleAllocateMission={handleAllocateMission}
        />
      ) : null}
    </div>
  )
}

const TableCell = ({ value }) => (
  <td
    className={
      'flex flex-row justify-center items-center h-[30px] w-[130px] border border-r font-normal overflow-hidden'
    }>
    <span className="flex flex-row justify-center w-full text-xs">{value}</span>
  </td>
)

const AllocateModal = props => {
  const handleAllocatedMissionToDrone = () => {
    props.handleAllocateMission()
    props.setIsAllocateModal(false)
  }

  return (
    <>
      <div className={'modal absolute h-[230px] w-[300px] rounded-xl ml-[400px] mt-[50px] bg-blue-400 text-white'}>
        <div className={'flex flex-col justify-center items-center rounded-t-xl bg-blue-600'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12 mt-5">
            <path
              fillRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
          <div className={'flex flex-row items-center mt-5'}>
            <span>현재 전압이</span>
            <span className={'px-1 text-lg text-orange-400'}>{props.currentPower}V</span>
            <span>입니다.</span>
          </div>
          <span className={'mt-3 mb-6'}>임무를 할당하시겠습니까?</span>
        </div>
        <div className={'flex justify-center mt-3.5'}>
          <button
            className={'px-2 py-1 rounded-xl border hover:border-green-500 hover:bg-white hover:text-black'}
            onClick={() => handleAllocatedMissionToDrone()}>
            {' '}
            할 당{' '}
          </button>
          <button
            className={'ml-12 px-2 py-1 rounded-xl border hover:bg-orange-400 hover:border-orange-400 hover:text-black'}
            onClick={() => props.setIsAllocateModal(false)}>
            {' '}
            취 소{' '}
          </button>
        </div>
      </div>
    </>
  )
}
