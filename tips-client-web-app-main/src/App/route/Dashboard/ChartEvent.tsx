import React, { useState, useCallback, useEffect, useContext } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts'
import { useTranslation } from 'react-i18next'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { buildError } from '../common/ErrorMessage'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../AppWrapper'
import SvgVector from '../../../resources/tft/VectorLong.svg'

interface DroneColors {
  [key: string]: string;
}

interface DroneDataPoint {
  [key: string]: number
  date: number
}


const COLORS: DroneColors = {
  'GJ_Q02_01': '#6359E9',
  'GJ_Q02_02': '#64CFF6',
  'GJ_Q02_03': '#8FE388',
  'GJ_Q02_04': '#FFB119',
  'GJ_Q02_05': '#FB2047',
  'GJ_Q02_06': '#36F097',
  'GJ_Q02_07': '#4682B4'
}
const TFT_COLORS: DroneColors = {
  'GJ_Q02_01': '#3064FE',
  'GJ_Q02_02': '#3DFFDC',
  'GJ_Q02_03': '#995CFC',
  'GJ_Q02_04': '#FFB119',
  'GJ_Q02_05': '#FB2047',
  'GJ_Q02_06': '#36F097',
  'GJ_Q02_07': '#4682B4'
}

interface CharEventProps {
  currentMonth: string
}

export const ChartEvent: React.FC<CharEventProps> = (props) => {
  const [droneData, setDroneData] = useState<DroneDataPoint[]>([])
  // console.log('checking data in event section', droneData)
  const getData = useCallback(() => {
    let requestData = { 'date': props.currentMonth }
    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/EventPerDrone/`,
      {
        params: requestData,
      })
      .then((response) => {
        setDroneData(response.data)
      })
      .catch(error => {
        buildError(error)
      })
  }, [props.currentMonth])
  
  useEffect(() => {
    getData()
  }, [props.currentMonth])
  
  const { t } = useTranslation()
  const { themeName, setThemeName } = useContext(SystemThemeContext)
  const droneColors = themeName === 'tips' ? COLORS : TFT_COLORS
  const activeDrones = [...new Set(droneData.flatMap(item => Object.keys(item)).filter(key => key !== 'date'))]
    .sort((a, b) => a.localeCompare(b))

  const colorValues = Object.values(droneColors)
  const colorObjects = activeDrones.map((drone, index) => ({
    [drone]: colorValues[index]
  }))

  const updatedCOLORS = colorObjects.reduce((acc, obj) => {
    return { ...acc, ...obj }
  }, {})

  const maxLogValue: number = Math.max(
    ...droneData.flatMap(item =>
      Object.values(item).filter(
        value => typeof value === 'number' && value !== item.date
      )
    )
  )

  const ceilingToNearestPlace = (value: number): number => {
    // 자릿수 계산
    const power = Math.floor(Math.log10(value))
    const place = Math.pow(10, power)

    // 자릿수에 따라 올림
    return Math.ceil(value / place) * place
  }

  const maxValue :number =ceilingToNearestPlace(maxLogValue)
  
  const XAxisComponent = ({ dataKey } : any) => (
    <XAxis dataKey={dataKey} axisLine={{ stroke: '#AEABD8' }} tick={{ fill: '#AEABD8', fontSize: 10, fontWeight: 500 }} tickLine={{ stroke: '#AEABD8' }}/>
  )
  
  const YAxisComponent = ({ labelValue } : any) => (
    <YAxis padding={{ top: 5 }} tick={{ fill: '#AEABD8', fontSize: 10, fontWeight: 500 }} tickLine={{ stroke: '#AEABD8' }} axisLine={{ stroke: '#AEABD8' }} label={{
      offset: -10,
      value: labelValue,
      angle: 0,
      position: 'insideTopRight',
      fill: '#AEABD8',
      fontSize: 12,
      fontWeight: 500
    }}/>
  )
  
  return (
    <>
      <div className='dashboard-header-text'>{t('Dashboard.Breakdown')}</div>
      {
        themeName === 'tft' &&
        <img className="vector-dashboard vector-page" alt="vector" src={SvgVector}/>
      }
      <div className={'dashboard-chart-event'}>
        <div className="dashboard-chart-event-dronecolor-bar">
          {
            activeDrones.map((droneId, index) => {
              const color = updatedCOLORS[droneId] || '#fff' // Default color
              const colorClass = `drone-color ${themeName === 'tft' ? 'tft' : ''} drone${index + 1}`
              const style = {
                backgroundColor: color,
                width: '12px',
                height: '12px',
              }
              return (
                <div className="flex-center" key={index}>
                  <div key={index} className={colorClass} style={style}></div>
                  <div className="mr-5">{droneId}</div>
                </div>
              )
            })
          }
        </div>
        <ResponsiveContainer className='dash-chart-event'>
          <BarChart data={droneData} margin={{ top: 10, right: 30, bottom: 35, }} barSize={20}>
            {/*<XAxisComponent dataKey="date" />*/}
            {/*<YAxisComponent labelValue={t('Dashboard.Breakdown.Times')} />*/}
            <XAxis dataKey="date">
              <Label value="날짜" offset={0} position="insideBottom" />
            </XAxis>
            {/*<Text textAnchor='start'></Text>*/}
            <YAxis dataKey="FlightTimeHour" domain={[0, maxValue]} >
              {/*<YAxis dataKey="FlightTimeHour" >*/}
              <Label value="건" offset={0} position="bottom" />
            </YAxis>
            <Tooltip cursor={{ fillOpacity: 0.2 }}/>
            {activeDrones.map((droneId, index) => (
              <Bar key={index} dataKey={droneId} fill={updatedCOLORS[droneId]}/>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default ChartEvent
