// sensor table custom hooks
import React, { FormEvent, useCallback, useContext, useEffect, useState } from 'react'
import { LineChart, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer, Line } from 'recharts'
import {
  RealTimePageType,
  SensorData,
} from './RealTime.type'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import { BREAKDOWN_SERVICE_URL } from '../../common/path'
import { DataMap } from '../components/DataMap'
import { SignalRContext } from '../../AppGCS/DroneRealtime/SignalRContainer'

const transformValue = (value: any,index:number): number => { // string | number => {
  if (typeof value === 'number') {
    return parseFloat(value.toExponential(index))
  }
  return parseFloat(value)
}

const transformPropsObject=(data:any,index:number) =>{
  const transformedObject : SensorData = {}
  for ( const key in data) {
    if (data.hasOwnProperty(key)) {
      transformedObject[key] = transformValue(data[key],index)
    }
  }
  return transformedObject
}

export function useSensorTableData(predictData: SensorData, rangeMax: SensorData, rangeMin: SensorData) {
  const [transformedData, setTransformedData] = useState<SensorData>({})
  const [dataRangeMax, setDataRangeMax] = useState<SensorData>(rangeMax)
  const [dataRangeMin, setDataRangeMin] = useState<SensorData>(rangeMin)


  useEffect(() => {
    setTransformedData(transformPropsObject(predictData,5))
    setDataRangeMax(transformPropsObject(rangeMax,1))
    setDataRangeMin(transformPropsObject(rangeMin,1))
  }, [predictData])
  return {
    PredictData : transformedData,
    RangeMax : dataRangeMax,
    RangeMin : dataRangeMin
  }
}

export function useSensorDisplay(sensorData: number, rangeMin: number, rangeMax: number): { value: number; className: string } {
  const className = sensorData > rangeMin && sensorData < rangeMax ? 'text-[#36F097]' : 'text-[#FB2047]'
  return { value: sensorData, className }
}

// form
interface FormDataProps {
  DroneId: string;
  FlightId: string;
  periodFrom: string;
  periodTo: string;
}

interface ApiResponse {
  drones: string[];
  flights: string[];
  logPage?: { SensorData: string }[];
  'pred page'?: {
    DroneId: string;
    PredictTime: string;
    PredictData: string;
    SelectData: string;
    SensorData: string;
    WarningData: string;
  }[];
}
export function useAPIData() {
  const [drones, setDrones] = useState<string[]>([])
  const [flights, setFlights] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/api/predict`)
        if (response.status === 200) {
          const data = await response.data
          setDrones(data.drones)
          setFlights(data.flights)
        } else {
          console.error('요청 실패')
        }
      } catch (error) {
        console.error('요청 중 오류 발생', error)
      }
    }
    fetchData()
  }, [])

  return { drones, flights }
}

export function useFormData(initialFormData: FormDataProps) {

  const { handleUpdateDroneSelectedId } = useContext<RealTimePageType>(SignalRContext)
  const [formData, setFormData] = useState<FormDataProps>(initialFormData)


  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = event.target
    setFormData({ ...formData, DroneId: value })
    handleUpdateDroneSelectedId(value)
   
  }, [formData])

  return { formData, handleChange }
}


export const useAPISubmit = (onSuccess: (data: ApiResponse) => void) => {
  return useCallback(async (event: FormEvent<HTMLFormElement>, formData: FormDataProps) => {
    event.preventDefault()
    try {
      const response = await axiosCredentials.post(`${BREAKDOWN_SERVICE_URL}/api/predict`, formData)
      if (response.status === 200) {
        const data: ApiResponse = await response.data
        console.log('pred, form data', data)
        console.log('pred form data[predictPage]', data['pred page'])
        onSuccess(data)
        console.log('post success , data[predictPage]', data['pred page'])
      } else {
        console.log('request fail')
      }
    } catch (error) {
      console.log('request error', error)
    }
  }, [onSuccess])
}

// table
interface TableCellProps {
  value : string | number
}

export interface LogTableProps {
  tableData : any[]
}

const TableCell = ({ value } : TableCellProps) => (
  <td className='log-table-cells-design'>
    <span className='log-table-value-data-design'>{value}</span>
  </td>
)

export const useTableRenderer = (tableData: any[]) => {
  return (
    <div className='log-table-wrapper w-full h-full wrapper-border-radius'>
      <div className='log-table-item'>
        <table>
          <thead className='flex flex-col justify-around w-full'>
            <tr className='flex flex-row text-white font-bold'>
              {DataMap.table_header.map((header, index) => (
                <th className='flex flex-col justify-center h-[50px] border-[#6359E9] border-r border-b bg-[#3E3D6D]'
                  key={index}>
                  <span className='flex flex-row justify-center w-[160px]'>{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='flex flex-col justify-around w-full'>
            {tableData.map((item: any, index: number) => (
              <tr className={'flex flex-row border-[#6359E9] text-[#AEABD8] text-xs '} key={index}>
                {Object.values(item.SensorData).map((value: any, idx: number) => (
                  <TableCell value={value} key={idx}/>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


export function useLineChart({ data, xKey, yKey, lines } : any) {
  return (
    <ResponsiveContainer width='98%' height={180} maxHeight={180}>
      <LineChart data={data}>
        <XAxis dataKey={xKey} interval={60} />
        <YAxis dataKey={yKey} />
        <Legend />
        <Tooltip />
        {lines.map((line : any, index : any) => (
          <Line
            key={index}
            type='monotone'
            dataKey={line.dataKey}
            stroke={line.stroke}
            dot={false}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function useWarningCount(WarningData: any) {
  const roll = ['roll_ATTITUDE_WARNING'].filter(prop => WarningData[prop] === true).length
  const pitch = ['pitch_ATTITUDE_WARNING'].filter(prop => WarningData[prop] === true).length
  const yaw = ['yaw_ATTITUDE_WARNING'].filter(prop => WarningData[prop] === true).length

  const xgyro = ['xgyro_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length
  const ygyro = ['ygyro_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length
  const zgyro = ['zgyro_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length

  const xacc = ['xacc_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length
  const yacc = ['yacc_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length
  const zacc = ['zacc_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length

  const xmag = ['xmag_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length
  const ymag = ['ymag_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length
  const zmag = ['zmag_RAW_IMU_WARNING'].filter(prop => WarningData[prop] === true).length

  const vibx = ['vibration_x_VIBRATION_WARNING'].filter(prop => WarningData[prop] === true).length
  const viby = ['vibration_y_VIBRATION_WARNING'].filter(prop => WarningData[prop] === true).length
  const vibz = ['vibration_z_VIBRATION_WARNING'].filter(prop => WarningData[prop] === true).length

  return {
    roll,
    pitch,
    yaw,
    xgyro,
    ygyro,
    zgyro,
    xacc,
    yacc,
    zacc,
    xmag,
    ymag,
    zmag,
    vibx,
    viby,
    vibz
  }
}
