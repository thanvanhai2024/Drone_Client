import React, { useCallback, useContext, useEffect, useState } from 'react'

import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../AppWrapper'
import SvgVector from '../../../resources/tft/VectorShort.svg'
import ProgressBar from '../../../resources/tft/ProgressBar.png'


interface NumberOfEventProps {
  currentMonth: string
}

export const NumberOfEvent:React.FC<NumberOfEventProps> = (props) =>{
  const { themeName, setThemeName } = useContext(SystemThemeContext)

  const [eventData, setEventData] = useState<any>({}) //<any> 없는 것 차
  const { t } = useTranslation()

  const getdata = useCallback(() => {

    let requestData = { 'date': props.currentMonth }

    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/number_of_event/`,{
      params: requestData,
    })
      .then((response) => {
        setEventData(response.data)
      })
      .catch(error => {
        // buildError(error)
        setEventData({ 'totalEventCount': '-', 'totalWarningCount': '-' })

      })
  }, [props.currentMonth])

  useEffect(() => {
    getdata()
  }, [props.currentMonth, getdata])

  if (themeName === 'tips') {
    return (
      <div className=''>
        <div className='flex justify-between'>
          <div className='dashboard-header-text'>{t('Dashboard.Event')}</div>
          <ExternalLink className='place-items-efnd'/>
        </div>
        <div className='dashboard-number-event-contain-text'>
          <div className='dashboard-number-event-event-num'>{eventData.totalWarningCount?.toLocaleString() || 0}</div>
          <div className='dashboard-number-event-text'>{t('Dashboard.Event.Times')}</div>
        </div>
        <div className='dashboard-number-event-contain-text'>
          <div className='dashboard-number-event-text'>{t('Dashboard.Event.NumberOfLogs')}</div>
          <div className='dashboard-number-event-event-num'>{eventData.totalEventCount?.toLocaleString() || 0}</div>
          <div className='dashboard-number-event-text'> {t('Dashboard.Event.Times')}</div>
        </div>
      </div>
    )
  }
  return (
    <div className=''>
      <div className='flex justify-between dashboard-event-header'>
        <div className='dashboard-header-text'>{t('Dashboard.Event')}</div>
        <ExternalLink className='place-items-efnd'/>
      </div>
      <img className="vector-dashboard vector-page" alt="vector" src={SvgVector}/>
      <div className="flex-center flex-col">
        <div className="">
          <img className="vector-dashboard-drone-event-progress" alt="vector" src={ProgressBar}/>
        </div>
        <div className="dash-warning-wrapper">
          <span className="">{eventData.totalWarningCount?.toLocaleString() || 0} </span>
          <span className="dash-warning-text">{t('Dashboard.Event.Times')}</span>
        </div>
        <div className="dash-count-wrapper flex-center mt-[10px]">
          <div className="dash-count-text-wrapper ">
            <div className="">{t('Dashboard.Event.NumberOfLogs')}</div>
            <b className="dash-count-text-num">{eventData.totalEventCount?.toLocaleString() || 0}</b>
            <div className="dash-count-text-weight">{t('Dashboard.Event.Times')}</div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default NumberOfEvent
