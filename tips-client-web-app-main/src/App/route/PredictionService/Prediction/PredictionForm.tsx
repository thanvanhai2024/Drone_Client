import React, { useCallback, useContext, useEffect, useState } from 'react'
import './Prediction.scss'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import { BREAKDOWN_SERVICE_URL } from '../../common/path'
import icon from '../../../../resources/tft/icon.svg'
import { SystemThemeContext } from '../../AppWrapper'
import { AxiosRequestConfig } from 'axios'

interface PredictionFormProps {
  optionTransfer: (data: { SelectData: number }[]) => void
  dataTransfer: (data: {
    DroneId: string,
    PredictTime: string,
    PredictData: string,
    SelectData: string,
    SensorData: string,
    WarningData: string
  }[]) => void
}

export const PredictionForm: React.FC<PredictionFormProps> = (props) => {
  const [drones, setDrones] = useState<string[]>([])
  const [flights, setFlights] = useState<string[]>([])
  const [selectedLog, setSelectedLog] = useState<string>('')
  const [formData, setFormData] = useState({
    DroneId: '',
    FlightId: '',
    periodFrom: getDefaultFromDate(),
    periodTo: getDefaultToDate()
  })
  const { themeName } = useContext(SystemThemeContext)

  function getDefaultFromDate() {
    const today = new Date()
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate())
    return formatDate(twoMonthsAgo)
  }

  function getDefaultToDate() {
    return formatDate(new Date())
  }

  function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `${year}-${month}-${day}`
  }

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    formData.append('SelectData', selectedLog)
    try {
      const response = await axiosCredentials.post(`${BREAKDOWN_SERVICE_URL}/api/predict`, formData)
      if (response.status === 200) {
        const data = await response.data
        console.log('pred, form data', data)
        console.log('pred, form data[predictPage]', data['pred page'])

        if (data && data['pred page']) {
          props.optionTransfer(
            data['pred page'].map((obj: any) => ({
              SelectData: obj['SensorData'],
            }))
          )
        } else {
          console.error('Data or pred page is undefined or null.')
        }
        props.dataTransfer(data['pred page'])
        console.log('post 성공 data[pred page]', data)
      } else {
        console.log('response', response)
        console.error('요청 실패')
      }
    } catch (error) {
      console.error('요청 중 오류 발생', error)
    }
  }, [props, selectedLog])

  const fetchData = useCallback(async (data: typeof formData) => {
    const config: AxiosRequestConfig = {
      params: data,
    }
    try {
      const response = await axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/api/predict`,config)

      if (response.status === 200) {
        const data = await response.data
        setDrones(data['drones'])
        setFormData({ ...formData, DroneId: data['drones'][0] })
        console.log('get 요청 성공 predict form', data)
      } else {
        console.log('요청실패')
        console.error('요청 실패')
      }
    } catch (error) {
      console.log('요청실패')
      console.error('요청 중 오류 발생', error)
    }
  },[formData])

  useEffect(() => {
    fetchData(formData)
  }, [fetchData, formData])

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (formData.DroneId) {
        const queryString = new URLSearchParams(formData).toString()
        console.log(formData)
        try {
          const response = await axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/api/flightId?${queryString}`)
          if (response.status === 200) {
            console.log(response)
            const data = await response.data
            setFlights(data['all_flights_list'])
          } else {
            console.error('FlightId 요청 실패')
          }
        } catch (error) {
          console.error('FlightId 요청 중 오류 발생:', error)
        }
      }
    }
    fetchData()
  }, [formData])

  const formatDateType = (item:string) => {
    if (item !== 'NONE') {
      let year = item.slice(0,4)
      let month : string = item.slice(4,6)
      let day : string = item.slice(6,8)
      let hour : string = item.slice(8,10)
      let minute : string = item.slice(10,12)
      let second: string = item.slice(12,14)

      return `${year}-${month}-${day}(${hour}:${minute}:${second})`
    }
    return 'NONE'
  }

  return (
    <div id='predictiondropdown' className='prediction-form-wrapper w-full h-full grid wrapper-border-radius'>

      <span className='prediction-form-header-text'>{themeName === 'tft' ? <img src={icon} alt='icon' width={60}/>: <>•</> } 부품 및 조회기간 선택</span>
      <form method='POST' onSubmit={handleSubmit} className=''>
        <div className='prediction-form-search-box w-full h-full grid'>
          <span className='prediction-form-text-color'>✓  드론 선택</span>
          <select className='prediction-form-search-box-select-drone-option prediction-form-search-box-design'
            value={formData.DroneId} onChange={handleChange}
            name={'DroneId'}>
            {drones.map((item, index) => <option value={item} key={index}>{item}</option>)}
          </select>
          <span className='prediction-form-text-color prediction-form-text-space'>✓  기간 선택</span>
          <div className='prediction-form-search-box-select-day-option '>
            <input className='prediction-form-search-box-design' placeholder='yyyy-mm-dd' name={'periodFrom'}
              type={'date'} value={formData.periodFrom} onChange={handleChange}></input>
            <span className='mr-1 ml-1'> ㅡ </span>
            <input className='prediction-form-search-box-design' placeholder='yyyy-mm-dd' name={'periodTo'}
              type={'date'} value={formData.periodTo} onChange={handleChange}></input>
          </div>
          <span className='prediction-from-select-box-select-flight-log prediction-form-text-color'>✓  비행 로그 선택</span>
          <select className='prediction-from-select-box-select-flight-log-option log-form-search-box-design-flights'
            value={formData.FlightId} onChange={handleChange}
            name={'FlightId'}>
            {flights.map((item, index) => (
              <option value={item} key={index}>
                {formatDateType(item)}
              </option>
            ))}
          </select>
          <button type='submit' className='prediction-check-button '>조회</button>
        </div>
      </form>
    </div>
  )
}
