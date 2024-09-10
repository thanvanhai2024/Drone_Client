import React, { useContext, useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import { SideDivTitle } from '../RightPanel/RightPanelCommonComponent'
import { SystemThemeContext } from '../../AppWrapper'
import { baseGCSPath } from '../../common/path'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'

interface DeliveryMission {
  location: string;
  count: number;
}

const TableContainer = styled.div`
    position: fixed;
    bottom: 5%;
    width: 10%;
    padding: 0.25em;

    @media (max-width: 2560px) {
        width: 8.3%;
    }

    @media (max-width: 1920px) {
        width: 11.2%;
    }
`
const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
`
const Th = styled.th`
    border: 1px solid #0E3B69;
    padding: 4.8px;
    background-color: #021964;
    text-align: center;
    color: white;
`
const Td = styled.td`
    border: 1px solid #0E3B69;
    padding: 8px;
    color: white;
    text-align: center;
`
const Tr = styled.tr`
    //background-color: white;
`
const DeliveryMissionTable: React.FC = () => {
  const { themeName } = useContext(SystemThemeContext)
  const { reload, toggleReload }: any = useContext(SignalRContext)
  const [missions, setMissions] = useState<DeliveryMission[]>([])

  const fetchAllMission = async () => {
    try {
      const res = await fetch(`${baseGCSPath}/api/mission-select-notcompleted`, {
        method: 'GET',
      })
      if (res.ok) {
        console.log('요청 성공!')
        const data = await res.json()
        const deliverySpotsCount: { [key: string]: number } = {}
        data.forEach((mission: any) => {
          const spot = mission.DELIVERY_SPOT
          if (deliverySpotsCount[spot]) {
            deliverySpotsCount[spot] += 1
          } else {
            deliverySpotsCount[spot] = 1
          }
        })

        const missionsArray: DeliveryMission[] = Object.keys(deliverySpotsCount).map((spot) => ({
          location: spot,
          count: deliverySpotsCount[spot],
        }))

        setMissions(missionsArray)
      } else {
        console.error('요청 실패')
      }
    } catch (e) {
      console.error('요청 중 오류 발생', e)
    }
  }

  useEffect(() => {
    fetchAllMission()
  }, [reload])

  return (
    <TableContainer >
      <div className={'flex'}>
        <SideDivTitle title='거점별 물품배달 임무 현황'/>
        <button className={'flex py-1 pl-1 items-top'} onClick={toggleReload}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
        </button>
      </div>
      <Table>
        <thead>
          <Tr>
            <Th >배달점</Th>
            <Th >임무수신(건)</Th>
          </Tr>
        </thead>
        <tbody>
          {missions.map((mission, index) => (
            <Tr key={index}>
              <Td>{mission.location}</Td>
              <Td>{mission.count}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  )
}

export default DeliveryMissionTable
