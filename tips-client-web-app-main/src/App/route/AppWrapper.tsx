import { Outlet } from 'react-router-dom'
import './MediaProcessing/MediaProcessing.scss'
import MainMenu from '../components/MainMenu'
import { SignalRContext, SignalRProvider } from './AppGCS/DroneRealtime/SignalRContainer'
import { WarningModal } from './common/WarningModal.'
import React, { useContext, useEffect, useState } from 'react'

import tftHeader from '../../resources/tft/tft-header.svg'

import { createContext } from 'react'
import HeaderButton from './HeaderButton'

import { DRONE_POWER_V_THRESHOLD, DRONE_TEMPERATURE_C_THRESHOLD } from './common/Constants'
import { useSubscribe } from './common/useRxjs'

interface ISystemTheme {
  themeName: string
  setThemeName: (name: string) => void
}

export const SystemThemeContext = createContext<ISystemTheme>({} as ISystemTheme)

const AppWrapper = () => {
  const [theme, setTheme] = useState<string>(process.env.REACT_APP_THEME_NAME || 'tft')

  const onThemeChange = (name: string) => {
    setTheme(name)
  }

  return (
    <SignalRProvider>
      <SystemThemeContext.Provider value={{ themeName: theme, setThemeName: name => onThemeChange(name) }}>
        <div className={`${theme} `}>
          <div className={'app-background flex flex-col h-screen w-screen'}>
            {theme === 'tft' && (
              <div
                className=""
                style={{
                  backgroundSize: '100% auto',
                  backgroundImage: `url(${tftHeader})`,
                  backgroundRepeat: 'no-repeat',
                }}>
                <div className="system-header w-full flex-center text-2xl">AI 드론 관제 시스템</div>
                <HeaderButton />
              </div>
            )}
            <div className="app-background app-main-wrapper">
              <div className="">
                <MainMenu />
              </div>
              <div className="main-wrapper">
                <Outlet />
              </div>
              <WarningContainer />
            </div>
          </div>
        </div>
      </SystemThemeContext.Provider>
    </SignalRProvider>
  )
}

const WarningContainer = () => {
  const { baseDroneStatesObservable, warningSkipList }: any = useContext(SignalRContext) // isWarningModal의 유형을 명시하지 않음
  const [warningList, setWarningList] = useState<string[]>([])

  const [droneStates] = useSubscribe(baseDroneStatesObservable)

  useEffect(() => {
    const newWarningList: string[] = []

    for (const key in droneStates) {
      const drone = droneStates[key]

      if (
        drone.FlightId !== 'NONE' &&
        drone.DroneRawState.POWER_V !== null &&
        drone.DroneRawState.TEMPERATURE_C !== null
      ) {
        console.log(drone?.DroneRawState.POWER_V)
        if (
          drone?.DroneRawState.POWER_V <= DRONE_POWER_V_THRESHOLD ||
          drone?.DroneRawState.TEMPERATURE_C >= DRONE_TEMPERATURE_C_THRESHOLD
        ) {
          newWarningList.push(drone.DroneName)
          setWarningList(newWarningList)
        }
      }
    }
  }, [droneStates])

  // first time component load
  let result
  if (warningSkipList !== undefined) {
    result = warningList.filter(item => !warningSkipList.includes(item))
  }

  return (
    <>
      {result &&
        result.map((d: string, i: number) => (
          <div className={'modal absolute top-[30%] left-[40%] w-[400px] h-[300px] z-50'}>
            <WarningModal key={i} drone={d} />
          </div>
        ))}
    </>
  )
}

export default AppWrapper
