import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush, Legend, Label, Text } from 'recharts'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { buildError } from '../common/ErrorMessage'
import { useTranslation } from 'react-i18next'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../AppWrapper'
import SvgVector from '../../../resources/tft/VectorLong.svg'

interface ChartFlightProps {
  currentMonth: string;
}

interface AxisProps {
  labelValue: string;
  dataKey: string;
}

interface DataPoint {
  FlightTimeHour: number;
  date: string;
}

// const XAxisComponent: React.FC<AxisProps> = ({ labelValue, dataKey }) => (
//   <XAxis
//     dataKey={dataKey}
//     label={{
//       offset: -5,
//       value: labelValue,
//       angle: 0,
//       position: 'insideBottom',
//       style: { textAnchor: 'middle' }
//     }}
//     tickLine={true}
//     tick={{ fontSize: 12 }}
//   />
//
//
// )
//
// const YAxisComponent: React.FC<AxisProps> = ({ labelValue, dataKey }) => (
//   <YAxis
//     padding={{ top: 0 }}
//     dataKey={dataKey}
//     label={{ offset: 10, value: labelValue, angle: 0, position: 'top' }}
//     tickLine={true}
//   />
// )


const ChartFlightTime: React.FC<ChartFlightProps> = (props) => {
  const [droneData, setDroneData] = useState<DataPoint[]>([])
  const { t } = useTranslation()
  const { themeName } = useContext(SystemThemeContext)

  const maxFlightTimeHour = Math.max(...droneData.map(item => item.FlightTimeHour))

  const getData = useCallback(() => {
    console.log('ChartFlightTime')
    let requestData = { 'date': props.currentMonth }
    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/get_drone_flight_time/`, { params: requestData })
      .then((response) => {
        setDroneData(response.data)
      })
      .catch(error => {
        buildError(error)
      })
  }, [props.currentMonth])

  useEffect(() => {
    getData()
  }, [getData])

  const brush_endIndex = () => {
    let endIndex = droneData.length
    if (endIndex > 6) {
      endIndex = 8
    }
    return endIndex
  }

  return (
    <>
      <div className='flex justify-between dashboard-event-header'>
        <div className='dashboard-header-text'>비행시간</div>
      </div>
      <img className="vector-dashboard vector-page" alt="vector" src={SvgVector} />
      <div className="dashboard-chart-time">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={droneData} margin={{ top: 30, right: 30, bottom: 35 }} barSize={20}>
            <XAxis dataKey="date">
              <Label value="날짜" offset={0} position="insideBottom" />
            </XAxis>
            <YAxis dataKey="FlightTimeHour" domain={[0, Math.floor(maxFlightTimeHour + 1)]} ticks={Array.from({ length: maxFlightTimeHour }, (_, i) => i+1)}>
              <Label value="시간" offset={0} position="bottom" />
            </YAxis>
            <Tooltip cursor={{ fillOpacity: 0.2 }} />
            <Bar dataKey="FlightTimeHour" fill={themeName === 'tips' ? '#6359E9' : '#3064FE'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default ChartFlightTime
