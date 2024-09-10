import React, { useCallback, useContext, useEffect, useState } from 'react'
import './Log.scss'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import { BREAKDOWN_SERVICE_URL } from '../../common/path'
import { SystemThemeContext } from '../../AppWrapper'
import icon from '../../../../resources/tft/icon.svg'
import { AxiosRequestConfig } from 'axios'

interface LogFormProps {
  graphTransfer: (data: { SelectData: number }[]) => void
  tableTransfer: (data: { DroneId: string; SensorData: string }[]) => void
}

interface FlightData {
  all_flights_list: string[]; // flights 배열의 구조에 맞게 타입을 정의합니다.
}

const LogForm: React.FC<LogFormProps> = (props) => {
  const [drones, setDrones] = useState<string[]>([])
  const [flights, setFlights] = useState<string[]>([])
  const [formData, setFormData] = useState({
    DroneId: '',
    FlightId: '',
    periodFrom: getDefaultFromDate(),
    periodTo: getDefaultToDate()
  })
  const { themeName } = useContext(SystemThemeContext)
  const classNames = `log-form-wrapper w-full h-full grid wrapper-border-radius ${themeName}`

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
    formData.append('SelectData', 'some_value')
    try {
      const response = await axiosCredentials.post(`${BREAKDOWN_SERVICE_URL}/api/logdata`, formData)

      if (response.status === 200) {
        const data = await response.data
        console.log('form data', data)
        props.graphTransfer(
          data['logPage'].map((obj: any) => ({
            SelectData: obj['SensorData'],
          }))
        )
        props.tableTransfer(data['logPage'])
        console.log('총 데이터의 수 : ', data['logPage'].length)
        console.log('post 성공 data[logPage]', data)
      } else {
        console.log('response', response)
        console.error('요청 실패')
      }
    } catch (error) {
      console.error('요청 중 오류 발생', error)
    }
  }, [props])

  const fetchData = useCallback(async (data: typeof formData) => {
    const config: AxiosRequestConfig = {
      params: data,
    }
    try {
      const response = await axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/api/logdata`,config)
      if (response.status === 200) {
        const data = await response.data
        setDrones(data['drones'])
        setFormData({ ...formData, DroneId: data['drones'][0] })
      } else {
        console.error('요청 실패')
      }
    } catch (error) {
      console.error('요청 중 오류 발생', error)
    }
  }, [formData])

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
    <div id='predictiondropdown' className={classNames}>
      <span className='log-form-header-text'>{themeName === 'tft' ? <img src={icon} alt='icon' width={60}/> : <>•</>} 부품 및 조회기간 선택</span>
      <form onSubmit={handleSubmit} className='log-form'>
        <div className='log-form-search-box w-full h-full grid'>
          <span className='log-form-text-color'>✓ 드론 선택</span>
          <select className='log-form-search-box-select-drone-option log-form-search-box-design' name='DroneId'
            value={formData.DroneId} onChange={handleChange}>
            {drones.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
          <span className='log-form-text-color log-form-text-space'>✓ 기간 선택</span>
          <div className='log-form-search-box-select-day-option '>
            <input className='log-form-search-box-design' placeholder='yyyy-mm-dd' name='periodFrom' type='date'
              value={formData.periodFrom} onChange={handleChange}/>
            <span className='mr-1 ml-1'> ㅡ </span>
            <input className='log-form-search-box-design' placeholder='yyyy-mm-dd' name='periodTo' type='date'
              value={formData.periodTo} onChange={handleChange}/>
          </div>
          <span className='log-from-select-box-select-flight-log log-form-text-color'>✓ 비행 로그 선택</span>
          <select className='log-from-select-box-select-flight-log-option log-form-search-box-design-flights' name='FlightId'
            value={formData.FlightId} onChange={handleChange}>
            {flights.map((item, index) => (
              <option value={item} key={index}>
                {formatDateType(item)}
              </option>
            ))}
          </select>
          <button type='submit' className='log-check-button'>
            조회
          </button>
        </div>
      </form>
    </div>
  )
}

export default LogForm
