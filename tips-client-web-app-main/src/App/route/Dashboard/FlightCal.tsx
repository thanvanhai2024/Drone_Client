import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday
} from 'date-fns'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { buildError } from '../common/ErrorMessage'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../AppWrapper'
import SvgVector from '../../../resources/tft/VectorLong.svg'
import './DashboardTFT.scss'
import './DashboardTIPS.scss'

interface FlightCalendarProps {
  currentMonth: string
  setCurrentMonth: React.Dispatch<React.SetStateAction<string>>
}

interface ColorItem {
  name: string
  color: string
}

interface DroneColorLegendProps {
  droneColorsMapping: ColorItem[];
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const DisplayFlightDateOnCalendar: React.FC<{ monthlyFlightData: any; day: any; themeName: string; uniqueDrone:string[]; }> = ({ monthlyFlightData, day, themeName, uniqueDrone }) => {

  const CircleCalendar: React.FC<{ themeName: string; monthlyFlightData: any[] }> = ({ themeName, monthlyFlightData }) => {
    const getColorPerDrone = (themeName: string): string[] => {
      return themeName === 'tips'
        ? [
          '#6359E9',
          '#64CFF6',
          '#8FE388',
          '#FFB119',
          '#FB2047',
          '#36F097',
          '#4682B4',
        ]
        :[
          '#3064FE',
          '#3DFFDC',
          '#995CFC',
          '#FFB119',
          '#FB2047',
          '#36F097',
          '#4682B4',
        ]
    }
    // 옵션에 따라 색상배 선택
    const colorPerDrone = getColorPerDrone(themeName)

    // 해당 droneId와 색상 맵핑
    const createColorMapping = (drones: string[], colors: string[]): { [key: string]: string } => {
      const colorMapping: { [key: string]: string } = {}

      drones.forEach((droneId, index) => {
        if (index < colors.length) {
          colorMapping[droneId] = colors[index]
        }
      })

      return colorMapping
    }

    const colorMapping = createColorMapping(uniqueDrone, colorPerDrone)

    const circleOnCalendar = monthlyFlightData
      .filter((data: any) => isSameDay(parseISO(data.FlightDate), day)) // 날짜가 day와 일치하는 항목만 필터링
      .flatMap((data: any) =>
        data.DroneIds.map((droneId: string, index: number) => {
          const color = colorMapping[droneId] // 드론 ID에 해당하는 색상 가져오기
          if (!color) return null // 색상이 없는 경우는 무시
          const style = {
            backgroundColor: color,
            width: '12px',
            height: '12px',
            borderRadius: '50%'
          }
          const className = `circle ${color}` // 색상을 사용하여 클래스 이름 설정
          return <div className={className} key={index} style={style}></div> // 원 요소 반환
        })
      )

    // console.log('check theme', themeName)
    return (
      <div className="flex justify-center h-3 mt-2 ">
        <div className='dash-cal-circle '>{circleOnCalendar}</div>
      </div>
    )
  }
  return <CircleCalendar themeName={themeName} monthlyFlightData={monthlyFlightData} />
}

const DroneColorLegend: React.FC<DroneColorLegendProps> = ({ droneColorsMapping }) => {
  return (
    <div className="dashboard-cal-dronecolor-bar">
      {droneColorsMapping.map((drone, index) => {
        const colorClass = `drone-color drone${index + 1}`
        const style = {
          backgroundColor: drone.color,
          width: '12px',
          height: '12px',
        }
        return (
          <div className="flex-center" key={index}>
            <div className={colorClass} style={style}></div>
            <span className="dash-cal-col">{drone.name}</span>
          </div>
        )
      })}
    </div>
  )
}

export const FlightCal: React.FC<FlightCalendarProps> = (props) => {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState<Date>(today)
  let firstDayCurrentMonth = parse(props.currentMonth, 'yyyy-MM', new Date())

  const [droneData, setDroneData] = useState<any[]>([])
  const [monthlyFlightData, setMonthlyFlightData] = useState<{ FlightDate: string, DroneIds: string[] }[]>([])
  const [uniqueDrone, setUniqueDrone] = useState<string[]>([])
  const [droneColorsMapping, setDroneColorsMapping] = useState<ColorItem[]>([])

  const { t } = useTranslation()
  const { themeName, setThemeName } = useContext(SystemThemeContext)

  const droneColors = themeName === 'tips'
    ? [
      { 'name': 'Drone1', 'color': '#6359E9' },
      { 'name': 'Drone2', 'color': '#64CFF6' },
      { 'name': 'Drone3', 'color': '#8FE388' },
      { 'name': 'Drone4', 'color': '#FFB119' },
      { 'name': 'Drone5', 'color': '#FB2047' },
      { 'name': 'Drone6', 'color': '#36F097' },
      { 'name': 'Drone7', 'color': '#4682B4' },
    ]
    : [
      { 'name': 'Drone1', 'color': '#3064FE' },
      { 'name': 'Drone2', 'color': '#3DFFDC' },
      { 'name': 'Drone3', 'color': '#995CFC' },
      { 'name': 'Drone4', 'color': '#FFB119' },
      { 'name': 'Drone5', 'color': '#FB2047' },
      { 'name': 'Drone6', 'color': '#36F097' },
      { 'name': 'Drone7', 'color': '#4682B4' },
    ]


  //1)해당 월에 해당하는 비행기록 데이터 가져오기
  // const getData = useCallback(() => {
  //   let requestData = { 'date': props.currentMonth }
  //   axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/get_flight_calendar/`, {
  //     params: requestData,
  //   })
  //     .then((response) => {
  //       setDroneData(response.data)
  //
  //       const uniqueDroneIds = [...new Set(droneData.map(data => data.DroneId))];
  //       console.log(uniqueDroneIds)
  //       setUniqueDrone(uniqueDroneIds)
  //
  //       const updatedCOLORS: ColorItem[] = uniqueDroneIds.map((drone, index) => ({
  //         name: drone,
  //         color: droneColors[index].color
  //       }))
  //       console.log(updatedCOLORS)
  //       setDroneColorsMapping(updatedCOLORS)
  //
  //     })
  //       .catch(error => {
  //         console.log('실패실패')
  //         buildError(error)
  //       })
  // }, [props.currentMonth])
  //
  // useEffect(() => {
  //   getData()
  // }, [props.currentMonth, getData])
  const getData = useCallback(() => {
    let requestData = { 'date': props.currentMonth }
    console.log(requestData, typeof(props.currentMonth) )
    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/get_flight_calendar/`, {
      params: requestData,
    })
      .then((response) => {
        setDroneData(response.data)
        console.log(response.data)
      })
      .catch(error => {
        setDroneData([])
        console.log('실패실패')
        buildError(error)
      })
  }, [props.currentMonth])
  
  useEffect(() => {
    getData()
  }, [props.currentMonth, getData])

  // 새로운 useEffect를 추가하여 droneData가 업데이트될 때마다 처리
  useEffect(() => {
    if (droneData.length > 0) {
      const uniqueDroneIds = [...new Set(droneData.map(data => data.DroneId))]
      setUniqueDrone(uniqueDroneIds)
      console.log(uniqueDroneIds)

      const updatedCOLORS: ColorItem[] = uniqueDroneIds.length > 0
        ? uniqueDroneIds.map((drone, index) => ({
          name: drone,
          color: droneColors[index]?.color || 'defaultColor'
        }))
        : []
      console.log(updatedCOLORS)
      setDroneColorsMapping(updatedCOLORS)
    }
  }, [droneData])


  //2) 가져온 데이터를 Date별로 중복제거한 DroneName
  const generateMonthlyFlightData = () => {
    const monthlyFlightData: { FlightDate: string, DroneIds: string[] }[] = []
    const uniqueFlightDates = [...new Set(droneData.map((data: any) => format(parseISO(data.FlightDate), 'yyyy-MM-dd')))]

    uniqueFlightDates.forEach(date => {
      const flightDataForDate = droneData.filter((data: any) => format(parseISO(data.FlightDate), 'yyyy-MM-dd') === date)
      const droneIdsForDate: string[] = flightDataForDate.map((data: any) => String(data.DroneId))
      const uniqueDroneIdsForDate = [...new Set(droneIdsForDate)].sort()
      monthlyFlightData.push({
        FlightDate: String(date),
        DroneIds: uniqueDroneIdsForDate,
      })
    })

    console.log(monthlyFlightData)
    setMonthlyFlightData(monthlyFlightData)
  }


  useEffect(() => {
    generateMonthlyFlightData()
  }, [droneData])

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  const firstMonth = new Date(2024, 1, 1)

  // 전달로 이동
  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    if (isBefore(firstDayNextMonth, firstMonth)) {
      toast.info('첫번째 달입니다.')
    } else {
      props.setCurrentMonth(format(firstDayNextMonth, 'yyyy-MM'))
    }
  }

  //다음달로 이동
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    if (!isAfter(firstDayNextMonth, today)) {
      props.setCurrentMonth(format(firstDayNextMonth, 'yyyy-MM'))
    } else {
      toast.info('마지막 달입니다.')
    }
  }

  //DroneName , color mapping

  //DroneName array(duplicated remove) ex)["GJ_Q02_03", "GJ_Q02_04"]
  // const getDroneIdsForCurrentMonth = () => {
  //   const droneIds = droneData
  //     .filter((data) => isSameMonth(parseISO(data.FlightDate), firstDayCurrentMonth))
  //     .map((data) => data.DroneId)
  //
  //   return [...new Set(droneIds)].sort()
  // }

  //filtering used DroneName
  // const filteredDroneColors = droneColors.filter(drone =>
  //     uniqueDrone.includes(drone.name)
  // )
  // console.log(filteredDroneColors)

  return (
    <>
      <div className={`dashboard-flight-cal${themeName}`}>
        <div className="dashboard-header-text">{t('Dashboard.FlightCalendar')}</div>
        {themeName === 'tft' && <img className="vector-dashboard vector-page" alt="vector" src={SvgVector} />}
        <div className="dashboard-flight-calender">
          <div className="dashboard-flight-cal-header">
            <div className="dashboard-flight-calendar-month">
              <button
                type="button"
                onClick={previousMonth}
                className="dashboard-flight-calendar-month-btn-left"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftCircle className="w-7 h-7 text-white" aria-hidden="true" />
              </button>
              <div className="dashboard-flight-calendar-header">
                {format(firstDayCurrentMonth, 'yyyy-MM')}
              </div>
              <button
                onClick={nextMonth}
                type="button"
                className="dashboard-flight-calendar-month-btn-right"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightCircle className="w-7 h-7 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="dashboard-flight-cal-mid">
            <div className="dashboard-flight-calendar-layout-subheader">
              <div>{t('Dashboard.FlightCalendar.date.Sunday')}</div>
              <div>{t('Dashboard.FlightCalendar.date.Monday')}</div>
              <div>{t('Dashboard.FlightCalendar.date.Tuesday')}</div>
              <div>{t('Dashboard.FlightCalendar.date.Wednesday')}</div>
              <div>{t('Dashboard.FlightCalendar.date.Thursday')}</div>
              <div>{t('Dashboard.FlightCalendar.date.Friday')}</div>
              <div>{t('Dashboard.FlightCalendar.date.Saturday')}</div>
            </div>
            <div className="dashboard-flight-calendar-layout-days">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    'dash-cal-days-layout'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && 'text-white',
                      !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          'text-black-500',
                      !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          'text-white-900',
                      !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          'text-white-400',
                      isEqual(day, selectedDay) && isToday(day) && 'bg-gray-500',
                      isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          'bg-gray-500',
                      !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                      (isEqual(day, selectedDay) || isToday(day)) &&
                          'font-semibold',
                      'mx-auto flex h-4 w-8 items-center justify-center rounded-full'
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>
                  <div className="dash-cal-wrapper">{/*h-1 mx-auto mt-1*/}
                    <DisplayFlightDateOnCalendar monthlyFlightData={monthlyFlightData} day={day} themeName={themeName} uniqueDrone = {uniqueDrone}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="dash-cal-colchart">
        <DroneColorLegend droneColorsMapping={droneColorsMapping} />
      </div>
    </>
  )
}
