import React, { useContext } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import './Prediction.scss'
import { SystemThemeContext } from '../../AppWrapper'
import SVG from '../../../../resources/tft/LogSVG.svg'
interface GraphDataItem {
  PredictTime: string;
  PredictData: number;
  SelectData: number;
}
interface PredictionResultGraphProps {
  graphData: GraphDataItem[];
  finalData: GraphDataItem[];
  selectedLog: string;
}

const PredictionResultGraph: React.FC<PredictionResultGraphProps> = ({ graphData, finalData, selectedLog }) => {
  const dayReverse = finalData.reverse()
  const { themeName } = useContext((SystemThemeContext))
  // console.log('finalData: ' + graphData[0])
  // console.log('graphData: ' + finalData[0])
  return (
    <div className='prediction-graph-wrapper w-full h-full wrapper-border-radius'>
      <span className='prediction-graph-header-text'>
                • 로그 예측 모델 결과 조회
      </span>
      {
        themeName === 'tft' &&
        <img className='vector-page vector-alt' alt='vector' src={SVG}/>
      }
      <div id='loggraph' className='grid pred-cart-graph'>
        <ResponsiveContainer className='pred-graph'>
          {/*<ResponsiveContainer width='98%' height={400}>*/}
          <LineChart data={dayReverse} margin={{ top:30 }}>
            <XAxis dataKey='PredictTime' />
            <YAxis />
            <Legend />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='PredictData'
              stroke='#64CFF6'
              dot={false}
              name={`예측값(${selectedLog})`}
            />
            <Line
              type='monotone'
              dataKey='SelectData'
              stroke='#8FE388'
              dot={false}
              name={`실제값(${selectedLog})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PredictionResultGraph
