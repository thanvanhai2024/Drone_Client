import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { buildError } from '../common/ErrorMessage'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../AppWrapper'
import SvgVector from '../../../resources/tft/VectorLong.svg'


const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: any
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor= "middle" dominantBaseline="middle" style={{ fontSize : 20 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}
// textAnchor={x > cx ? 'start' : 'end'}

interface PieChartProps {
  currentMonth: string
}

interface ColorItem {
  name: string
  color: string
}

const ChartPieFlightRate: React.FC<PieChartProps> = (props) => {

  const COLORS = [
    { 'name': 'GJ_Q02_01', 'color': '#6359E9' },
    { 'name': 'GJ_Q02_02', 'color': '#64CFF6' },
    { 'name': 'GJ_Q02_03', 'color': '#8FE388' },
    { 'name': 'GJ_Q02_04', 'color': '#FFB119' },
    { 'name': 'GJ_Q02_05', 'color': '#FB2047' },
    { 'name': 'GJ_Q02_06', 'color': '#36F097' },
    { 'name': 'GJ_Q02_07', 'color': '#4682B4' },
  ]

  const TFTCOLORS = [
    { 'name': 'GJ_Q02_01', 'color': '#3064FE' },
    { 'name': 'GJ_Q02_02', 'color': '#3DFFDC' },
    { 'name': 'GJ_Q02_03', 'color': '#995CFC' },
    { 'name': 'GJ_Q02_04', 'color': '#FFB119' },
    { 'name': 'GJ_Q02_05', 'color': '#FB2047' },
    { 'name': 'GJ_Q02_06', 'color': '#36F097' },
    { 'name': 'GJ_Q02_07', 'color': '#4682B4' },
  ]

  const { themeName } = useContext(SystemThemeContext)
  const droneColors = themeName === 'tips' ? COLORS : TFTCOLORS
  const [droneData, setDroneData] = useState<any[]>([])
  
  const getdata = useCallback(() => {
    const requestData = { 'date': props.currentMonth }
    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/get_drone_flight_rate/`, { params: requestData })
      .then(response => {
        setDroneData(response.data)
      })
      .catch(error => {
        buildError(error)
      })
  }, [props.currentMonth])
  
  useEffect(() => {
    getdata()
  }, [props.currentMonth, getdata])
  
  const sumCount = droneData.reduce((acc, datainfo) => acc + datainfo['FlightTimeMs'], 0)
  
  const lastdata = droneData.map((datainfo: any) => ({
    name: datainfo['_id'],
    value: calculatePercentage(datainfo['FlightTimeMs'], sumCount)
  }))
  
  function calculatePercentage(part: number, whole: number) {
    return Math.round((part / whole) * 100)
  }

  const sortedLastData = lastdata.sort((a, b) => a.name.localeCompare(b.name))

  const updatedCOLORS: ColorItem[] = sortedLastData.map((drone, index) => ({
    name: drone.name,
    color: droneColors[index].color
  }))
  
  return (
    <>
      <div className={`flex justify-between ${themeName}`}>
        <div className='dashboard-header-text'>비행 비율</div>
      </div>
      {themeName === 'tft' && <img className="vector-dashboard vector-page" alt="vector" src={SvgVector} />}
      <div className="dashboard-pie-chart">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={lastdata}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={50}
              outerRadius={120}
              dataKey="value"
            >
              {lastdata.map((entry, index) => {
                const droneId = entry.name
                const color = updatedCOLORS.find(color => color.name === droneId)?.color
                return <Cell key={index} fill={color} />
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div>
          <div className="dashboard-pie-chart-dronecolor-bar">
            {sortedLastData.map((entry, index) => {
              const droneId = entry.name
              const droneColor = updatedCOLORS.find(color => color.name === droneId)?.color
              if (droneColor) {
                const colorClass = `drone-color ${themeName === 'tft' ? 'tft' : ''} drone${droneId}`
                const style = {
                  // backgroundColor: droneColor.color,
                  backgroundColor: droneColor,
                  width: '12px',
                  height: '12px',
                }
                return (
                  <div className="flex-center" key={index}>
                    <div className={colorClass} style={style}></div>
                    <div className="mr-5">{droneId}</div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChartPieFlightRate
