import React, { useContext } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import SVG from '../../../../resources/tft/LogSVG.svg'
import { SystemThemeContext } from '../../AppWrapper'

interface GraphDataItem {
  SelectData: any
}

interface LogCartProps {
  graphData: GraphDataItem[]
  selectedCheckboxes: string[]
  onSelectedCheckboxesChange?: (newSelectedCheckboxes: string[]) => void
}

const COLORS = ['#8FE388', '#64CFF6', '#c933ff', '#FABC05', '#FF5733']

const LogCart: React.FC<LogCartProps> = (props) => {
  const dayReverse = props.graphData.reverse()
  // console.log(dayReverse)
  // Filter data based on selected checkboxes
  const filteredData = dayReverse.map(item => {
    const dataEntry: any = { SelectData: item.SelectData }
    props.selectedCheckboxes.forEach(checkbox => {
      dataEntry[checkbox] = item.SelectData[checkbox]
    })
    return dataEntry
  })
  console.log('filteredData: '+ filteredData)
  console.log('selectedCheckboxes: '+ props.selectedCheckboxes)
  const { themeName } = useContext((SystemThemeContext))
  
  return (
    <div className='log-chart-graph-wrapper w-full h-full wrapper-border-radius'>
      <span className='log-chart-graph-header'>• 로그 데이터 조회</span>
      {
        themeName === 'tft' &&
        <img className='vector-page vector-alt' alt='vector' src={SVG}/>
      }
      <div id='select option' className='grid log-cart-graph'>
        <ResponsiveContainer >
          {/*<ResponsiveContainer width='98%' height={400}>*/}
          <LineChart data={filteredData} margin={{ top:30 }}>
            <XAxis dataKey='SelectData' />
            <YAxis />
            <Legend />
            <Tooltip />
            {props.selectedCheckboxes.map((checkbox, index) => (
              <Line
                key={index}
                type='monotone'
                dataKey={checkbox}
                stroke={COLORS[index % COLORS.length]}
                dot={false}
                name={checkbox}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LogCart
