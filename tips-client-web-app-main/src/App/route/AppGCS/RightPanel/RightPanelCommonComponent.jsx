import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { LineChart, Legend, XAxis, YAxis, Tooltip, Line, ResponsiveContainer } from 'recharts'
import bulletIcon from '../../../../resources/bullet.png'
import Theme from '../Themes'

const SidebarComponentDiv = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
        display: none; /* 스크롤바 숨김 */
    }
`

const SideDiv2 = styled.div`
    margin-top: 0.5em;
    background: ${Theme.SidebarBackground};
    display: flex;
    flex-direction: column;
    padding: 1em;
    flex-grow: 1;
`

const SideDiv4 = styled.div`
    background: ${Theme.SidebarBackground};
    padding: 1em;
    //flex-grow: 1;
`

const SideDivTitleComponentDiv = styled.div`
  color: ${Theme.TitleColor};
  font-size: 15px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const BulletIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 5px;
`

const SideDivTitle = props => (
  <SideDivTitleComponentDiv>
    <BulletIcon src={bulletIcon} alt="bullet" />
    {props.title}
  </SideDivTitleComponentDiv>
)

const TableRowHead = styled.th`
  background: ${Theme.TableRowHeader};
  width: 100px;
  text-align: center;
  color: ${Theme.TableHeadTextColor};
  font-weight: 500;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px;
`

const TableRowDataStyled = styled.td`
  background: ${Theme.TableRowData};
  border: 2px solid ${Theme.TableBorder};
  text-align: center;
  color: ${Theme.TableTextColor};
  height: 100%;
`

const TableRowData = props => (
  <TableRowDataStyled>
    <TableRowDataDiv title={props.children ? props.children : ''} children={props.children ? props.children : ''}/>
  </TableRowDataStyled>
)

const TableRowDataDiv = styled.div`
  width: 120px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const TableRow = styled.tr`
  border: 2px solid ${Theme.TableBorder};
  padding-top: 2px;
  padding-bottom: 2px;
`

const SidebarTableRow = props => {
  const { data } = props
  return (
    <TableRow>
      <TableRowHead className='table-drone-item'>{data[0].name}</TableRowHead>
      <TableRowData className='table-drone-item'>{data[0].value}</TableRowData>
      <TableRowHead className='table-drone-item'>{data[1] && data[1].name}</TableRowHead>
      <TableRowData className='table-drone-item'>{data[1] && data[1].value}</TableRowData>
    </TableRow>
  )
}

const SidebarTable = props => {
  const { data } = props
  const rowNumber = Math.ceil(data.length / 2)
  return (
    <div className="flex flex-center table-drone-info">
      <table>
        <tbody>
          {[...Array(rowNumber).keys()].map(index => {
            return (
              <SidebarTableRow
                key={index}
                data={[data[index], data[index + rowNumber]]}
                isFirst={index === 0}
                isLast={index === rowNumber - 1}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const AltitudeChart = ({ missionItems, ggWaypointss, realtimeDrone }) => {
  const [series, setSeries] = useState([])

  useEffect(() => {
    const sortedWaypoints = missionItems.slice(1).sort((a, b) => a.seq - b.seq)
    const ggWaypointssFlat = ggWaypointss?.length
      ? ggWaypointss
        .map((ggWaypoints, wpNumber) =>
          ggWaypoints.map((node, index) => ({
            value: node.Elevation,
            index: index + (wpNumber === 0 ? 0 : ggWaypointss.slice(0, wpNumber).reduce((p, v) => p + v.length, 0)),
          })),
        )
        .flat()
      : []
    if (sortedWaypoints.length) {

      const value = [
        {
          name: '지형고도',
          data: ggWaypointssFlat,
          color: '#FF1053',
        },
        {
          name: '이동고도',
          data: sortedWaypoints.map((waypoint, wpNumber) => {
            //temporary measure
            // const i =
            //   wpNumber === 0 ? 0 : ggWaypointss?.length
            //     ? ggWaypointss.slice(0, wpNumber).reduce((p, v) => p + v.length, 0) - 1
            //     : wpNumber
            const i = wpNumber
            return {
              value:
                waypoint.frame === mavFrameList['MAV_FRAME_GLOBAL_RELATIVE_ALT_INT'] ||
                waypoint.frame === mavFrameList['MAV_FRAME_GLOBAL_RELATIVE_ALT']
                  ? waypoint.altitude + (ggWaypointssFlat[i]?.value || 0)
                  : waypoint.altitude,
              index: i,
            }
          }),
          color: '#8FE388',
        },
        {
          name: '드론고도',
          data:
            realtimeDrone &&
            realtimeDrone.map(node => ({
              value: node.Location.m_dHeight,
              index: node.Progress,
            })),
          color: '#64CFF6',
        },
      ]
      setSeries(value)
      console.log('ggWaypointss', ggWaypointss)
      console.log('ggWaypointssFlat', ggWaypointssFlat)
      console.log('value',value)
      console.log('sortedWaypoints', sortedWaypoints)
    }
  }, [missionItems, realtimeDrone, ggWaypointss])

  return (
    <ResponsiveContainer width="90%" height={180}>
      <LineChart margin={{ top: 20, right: 0, left: 100, bottom: 10 }}>
        {/* temporary measure */}
        {/*<XAxis dataKey="index" type="number" domain={[0, 'dataMax']} allowDuplicatedCategory={false}/>*/}
        <XAxis dataKey="index" type="number" domain={[0, 'dataMax']} allowDuplicatedCategory={false} interval={1} tick={{ interval: 1 }} />
        <YAxis dataKey="value"/>
        <Tooltip/>
        {series.map(s => (
          <Line data={s.data} dataKey="value" key={s.name} name={s.name} stroke={s.color} isAnimationActive={false}/>
        ))}
        <Legend wrapperStyle={{ color: '#fff' }}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

export const mavFrameList = {
  MAV_FRAME_GLOBAL: 'GLOBAL',
  MAV_FRAME_LOCAL_NED: 'LOCAL_NED',
  MAV_FRAME_MISSION: 'MISSION',
  MAV_FRAME_GLOBAL_RELATIVE_ALT: 'GLOBAL_RELATIVE_ALT',
  MAV_FRAME_LOCAL_ENU: 'LOCAL_ENU',
  MAV_FRAME_GLOBAL_INT: 'GLOBAL_INT',
  MAV_FRAME_GLOBAL_RELATIVE_ALT_INT: 'GLOBAL_RELATIVE_ALT_INT',
  MAV_FRAME_LOCAL_OFFSET_NED: 'LOCAL_OFFSET_NED',
  MAV_FRAME_BODY_NED: 'BODY_NED',
  MAV_FRAME_BODY_OFFSET_NED: 'BODY_OFFSET_NED',
  MAV_FRAME_GLOBAL_TERRAIN_ALT: 'GLOBAL_TERRAIN_ALT',
  MAV_FRAME_GLOBAL_TERRAIN_ALT_INT: 'GLOBAL_TERRAIN_ALT_INT',
  MAV_FRAME_BODY_FRD: 'BODY_FRD',
}

export const mavFrameListInt = {
  0: 'GLOBAL',
  1: 'LOCAL_NED',
  2: 'MISSION',
  3: 'GLOBAL_RELATIVE_ALT',
  4: 'LOCAL_ENU',
  5: 'GLOBAL_INT',
  6: 'GLOBAL_RELATIVE_ALT_INT',
  7: 'LOCAL_OFFSET_NED',
  10: 'GLOBAL_TERRAIN_ALT',
  11: 'GLOBAL_TERRAIN_ALT_INT',
  12: 'BODY_FRD',
}

export {
  SideDiv2,
  SideDiv4,
  SidebarComponentDiv,
  SidebarTable,
  SideDivTitle,
  AltitudeChart,
}
