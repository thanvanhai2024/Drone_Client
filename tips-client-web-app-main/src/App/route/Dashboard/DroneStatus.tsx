import React, { useContext, useState, useEffect } from 'react'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../AppWrapper'
import SvgVector from '../../../resources/tft/VectorShort.svg'

interface NumberOfEventProps {
  currentMonth: string;
}

export const DroneStatus: React.FC<NumberOfEventProps> = (props) => {
  const { themeName, setThemeName } = useContext(SystemThemeContext)
  const [eventData, setEventData] = useState<any>({})
  const { t } = useTranslation()

  useEffect(() => {
    let requestData = { 'date': props.currentMonth }
    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/drone_status/`, {
      params: requestData,
    }).then((response) => {
      setEventData(response.data)
    }).catch(error => {
      setEventData({ 'number_of_flight': '-', 'flight_time': '-', 'TotalDistance': '-' })
      console.log('Error occurred while fetching drone status:', error)
    })
  }, [props.currentMonth])

  if (themeName === 'tips') {
    return (
      <div className="">
        <div className='flex items-center justify-between'>
          <div className='dashboard-header-text'>{t('Dashboard.DroneStatus')}</div>
          <ExternalLink className='place-items-efnd status-icon'/>
        </div>

        <div className="grid grid-cols-2">
          <div className="dashboard-drone-status-text">
            <p className="dashboard-drone-status-text-unit">{t('Dashboard.DroneStatus.NumberOfFlights')} </p>
          </div>
          <div className="dashboard-drone-status-text">
            <p className="dashboard-drone-status-number">{eventData.number_of_flight}</p>
            <p className="dashboard-drone-status-text-unit">{t('Dashboard.DroneStatus.NumberOfFlights.Sortie')}</p>
          </div>
          <div className="dashboard-drone-status-text">
            <p className="dashboard-drone-status-text-unit">{t('Dashboard.DroneStatus.FlightTime')}</p>
          </div>
          <div className="dashboard-drone-status-text">
            <p className="dashboard-drone-status-number">{eventData.flight_time}</p>
          </div>
          <div className="dashboard-drone-status-text">
            <p className="dashboard-drone-status-text-unit">{t('Dashboard.DroneStatus.FlightDistance')} </p>
          </div>
          <div className="dashboard-drone-status-text">
            <p className="dashboard-drone-status-number">{eventData.TotalDistance}</p>
            <p className="dashboard-drone-status-text-unit">km</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <div className='dashboard-header-text'>{t('Dashboard.DroneStatus')}</div>
        <ExternalLink className='place-items-efnd'/>
      </div>
      <img className="vector-dashboard vector-page" alt="vector" src={SvgVector}/>
      <div className="dashboard-drone-status-frame-parent h-full flex items-center flex-col">
        <div className="flex-center">
          <div className="dashboard-drone-status-frame flex-center">
            <div className="dashboard-drone-status-text-left">{t('Dashboard.DroneStatus.NumberOfFlights')} </div>
          </div>
          <div className="dashboard-drone-status-frame-wrapper flex-center">
            <div className="dashboard-drone-status-frame-parent2 flex-center flex-row gap 1">
              <b className="dashboard-drone-status-number-distance  ">{eventData.number_of_flight}</b>
              <div className="dashboard-drone-status-text-unit-km">소티</div>
            </div>
          </div>
        </div>
        <div className="flex-center">
          <div className="dashboard-drone-status-frame flex-center">
            <div className="dashboard-drone-status-text-left">{t('Dashboard.DroneStatus.FlightTime')}</div>
          </div>
          <div className="dashboard-drone-status-frame-wrapper flex-center">
            <b className="dashboard-drone-status-number-distance ">{eventData.flight_time}</b>
          </div>
        </div>
        <div className="flex-center">
          <div className="dashboard-drone-status-frame flex-center">
            <div className="dashboard-drone-status-text-left">{t('Dashboard.DroneStatus.FlightDistance')}</div>
          </div>
          <div className="dashboard-drone-status-frame-wrapper flex-center">
            <div className="dashboard-drone-status-frame-parent2 flex-center flex-row gap-1">
              <b className="dashboard-drone-status-number-distance ">{eventData.TotalDistance}</b>
              <div className="dashboard-drone-status-text-unit-km">km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DroneStatus
