import React, { useContext } from 'react'
import './RealTime.scss'
import { PredictionResultGraphProps } from './RealTime.type'
import { useLineChart } from './RealTimeHooks'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/LogSVG.svg'

function MapYAxis(m_dHeight:number):number{
  return m_dHeight > 20 ? m_dHeight * 1.5 :20
}

const RealTimeDroneGraph: React.FC<PredictionResultGraphProps> = (props) => {
  const data = props?.graphData?.map((item, index) => ({
    ...item,
    m_dHeight: item.m_dHeight / 1000,
    height: MapYAxis(item.m_dHeight / 1000),
    index,
  }))

  const lines = [
    {
      dataKey: 'm_dHeight',
      stroke: '#65CFF6',
      name: '드론 고도',
    },
  ]
  const { themeName } =useContext(SystemThemeContext)
  

  return (
    <div className="grid grid-row w-full h-full">
      <div className="w-full h-full grid">
        <span className="real-time-drone-header">• 드론 고도 </span>
        {
          themeName === 'tft' &&
          <img className="vector-page vector-alt" alt="vector" src={SVG}/>
        }
        <div id="realtime-graph" className="">
          {useLineChart({ data, xKey: 'index', yKey:'height', lines })}
        </div>
      </div>
    </div>
  )
}

export default RealTimeDroneGraph
