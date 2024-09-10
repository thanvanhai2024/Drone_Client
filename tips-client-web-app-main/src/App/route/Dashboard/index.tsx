import React, { useContext, useState } from 'react'
import ChartFlightTime from './ChartFlightTime'
import ChartEvent from './ChartEvent'
import NumberOfEvent from './NumberOfEvent'
import DroneStatus from './DroneStatus'

import './Dashboard.scss'
import './DashboardTFT.scss'
import './DashboardTIPS.scss'


import PieChart from './ChartPieFlightRate'
import { format, startOfToday } from 'date-fns'
import { FlightCal } from './FlightCal'
import HeatMapGoogle from './HeatMapGoogle'
import HeatMapTFT from './HeatMapTFT'
// import HeatMapTFT from './HeatMapTFTHD'
import { SystemThemeContext } from '../AppWrapper'
import HeatMapTIPS from './HeatMapTIPS'

const Corner = () => {
  const { themeName } = useContext(SystemThemeContext)
  return (
    <>
      {
        themeName === 'tft' && <>
          <div className={'absolute cornerTopTop'}/>
          <div className={'absolute cornerTopLeft'}/>
          <div className={'absolute cornerBottomBottom'}/>
          <div className={'absolute cornerBottomRight'}/>
        </>
      }
    </>
  )
}

const Dashboard = () => {
  let today = startOfToday()
  let [currentMonth, setCurrentMonth] = useState(format(today, 'yyyy-MM'))
  const { themeName } = useContext(SystemThemeContext)

  return (
    <div className={`dashboard-grid-wrapper gap-3 ${themeName}`}>
      <div className='dashboard-item dashboard-drone-status relative'>
        <Corner/>
        <DroneStatus currentMonth={currentMonth}/>
      </div>
      <div className='dashboard-item dashboard-number-event relative'>
        <Corner/>
        <NumberOfEvent currentMonth={currentMonth}/>
      </div>
      <div className='dashboard-item dashboard-flight-time relative'>
        <Corner/>
        <ChartFlightTime currentMonth={currentMonth}/>
      </div>
      <div className='dashboard-item dashboard-event relative'>
        <Corner/>
        <ChartEvent currentMonth={currentMonth}/>
      </div>
      <div className='dashboard-item dashboard-flight-calendar h-50 relative'>
        <Corner/>
        <FlightCal currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}/>
      </div>
      <div className='dashboard-item dashboard-flight-rate relative'>
        <Corner/>
        <PieChart currentMonth={currentMonth}/>
      </div>
      <div className='dashboard-item dashboard-heat-map component-background no-radius relative'>
        <Corner/>
        {
          themeName === 'tft' ?
            <HeatMapGoogle currentMonth={currentMonth}/> :
            // <HeatMapTFT currentMonth={currentMonth}/> :
            <HeatMapTIPS currentMonth={currentMonth}/>
        }

      </div>
    </div>
  )
}


export default Dashboard
