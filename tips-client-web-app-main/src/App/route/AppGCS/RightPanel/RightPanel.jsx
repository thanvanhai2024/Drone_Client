import React, { useContext, useEffect, useState } from 'react'
import {
  SideDiv2,
  SideDiv4,
  SidebarComponentDiv,
  SidebarTable,
  SideDivTitle,
} from './RightPanelCommonComponent'
import { ControlButtonsPanel } from '../components/DroneControlButtonsPanel'
import { SystemThemeContext } from '../../AppWrapper'
import GCSSVG from '../../../../resources/tft/GCSLine.svg'
import { DRONE_POWER_V_THRESHOLD, DRONE_TEMPERATURE_C_THRESHOLD } from '../../common/Constants'

const RightPanel = ({ droneState, droneDeliveryInfo, displayMapsAsMain, submitWaypoints, sendStartSignal,
  DroneMapsCmp, VideoPlayer, onVideoSwap, rcOverride, }) => {
  const { themeName } =useContext(SystemThemeContext)
  const className=`text-sm ${themeName}`
  const { DroneRawState } = droneState || {}
  const droneAvailable = droneState && droneState.IsOnline
  const [queue, setQueue] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('RightPanel')
    const interval = setInterval(() => {
      const isUndifined = droneState?.WarningData?.WarningCount === undefined
      const isNormal = droneState?.WarningData?.WarningCount < 10

      setQueue(prevQueue => [...prevQueue,
        isUndifined
          ? '없음'
          : (droneState?.DroneRawState.POWER_V <= DRONE_POWER_V_THRESHOLD) ||
            (droneState?.DroneRawState.TEMPERATURE_C >= DRONE_TEMPERATURE_C_THRESHOLD)
            ? '위험'
            : isNormal
              ? '정상'
              : '주의'
      ])

      setCount(prevCount => {
        const newCount = prevCount + 1
        if (count !== 0 && count % 12 === 0) {
          setQueue([])
          return 0
        }
        return newCount
      })
    }, 1000)

    return () => clearInterval(interval) // 컴포넌트 언마운트 시 clearInterval

  }, [count])

  return (
    <SidebarComponentDiv className={className}>
      <SideDiv4 className="rounded-2xl background-drone-monitor-page">

        <SideDivTitle title="드론정보" />

        <SidebarTable
          droneAvailable={droneAvailable}
          data={[
            { name: '드론 ID', value: droneState?.DroneName },
            { name: '드론 전압 (V)', value: (DroneRawState || {}).POWER_V },
            { name: 'GPS 수신 수', value: (DroneRawState || {}).SAT_COUNT },
            { name: '위도', value: (DroneRawState || {}).DR_LAT },
            { name: '고도 (m)', value: (DroneRawState || {}).DR_ALT / 1000 },
            { name: '현재 WP 번호', value: (DroneRawState || {}).WP_NO },
            { name: '드론 온도 (°C)', value: (DroneRawState || {}).TEMPERATURE_C, },
            { name: 'HDOP', value: (DroneRawState || {}).HDOP, },
            { name: '경도', value: (DroneRawState || {}).DR_LON },
            { name: '제어권', value: rcOverride ? '있음(GCS)' : '없음(RC)' },
          ]}
        />
      </SideDiv4>

      <SideDiv2 className="rounded-2xl background-drone-monitor-page">
        <SideDivTitle title="드론 운용 상태" />
        <div className="w-full h-full">
          {
            !displayMapsAsMain ? DroneMapsCmp : VideoPlayer
          }
        </div>
        <div className={'flex flex-col justify-center h-full'}>
          <ControlButtonsPanel onVideoSwap={onVideoSwap} droneState={droneState} />
        </div>

        {droneState?.IsOnline
          ? (
            <div className={'flex justify-center items-end'}>
              <div
                className={`flex items-center mt-1 p-0.5 w-[95%] h-7 border-2 rounded-lg overflow-hidden ${themeName === 'tft' ? 'border-[#17317F]' : 'border-[#4B4B99] '}`}>
                <div className={'flex h-7 items-center mx-2'}>장애 진단 예측</div>
                <div className="flex overflow-hidden">
                  {queue.map((status, index) => (
                    <div
                      key={index}
                      className={`flex ml-1 w-6 h-4 
                      ${status === '정상' ? 'bg-green-600' 
                      : status === '주의' ? 'bg-orange-400' 
                        : status === '없음' ? 'bg-gray-500'
                          : 'bg-red-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
          : null
        }

      </SideDiv2>
    </SidebarComponentDiv>
  )
}

export default RightPanel

