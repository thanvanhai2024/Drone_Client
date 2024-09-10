import React, { useContext, useEffect, useState } from 'react'

import './Prediction.scss'
import { DataMap } from '../components/DataMap'
import { SystemThemeContext } from '../../AppWrapper'

import ReactPaginate from 'react-paginate'

interface SensorData {
  [key: string]: number
}

interface TableDataItem {
  PredictData: number;
  SelectData: number;
  DroneId: string;
  PredictTime: string;
  SensorData: SensorData
}

interface PredictionTableProps {
  tableData: TableDataItem[];
}

const PredictionTable = (props: PredictionTableProps) => {
  const { themeName } = useContext(SystemThemeContext)
  const classNames = `prediction-table-wrapper w-full h-full wrapper-border-radius ${themeName}`
  const { tableData } = props
  
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 5
  const startIndex = currentPage * pageSize
  const endIndex = Math.min((currentPage + 1) * pageSize, tableData.length)
  const data = tableData.slice(startIndex, endIndex)
  
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }
  const totalPages = Math.ceil(tableData.length / pageSize)
  
  return (
    <div className={classNames}>
      <div className='prediction-table-item'>
        <table>
          <thead className="flex flex-col justify-around w-full">
            <tr className="flex flex-row text-white font-bold">
              {DataMap.mini_header.map((item: string, index: number) => (
                <th className="flex flex-col justify-center h-[50px] border-[#6359E9] border-r border-b bg-[#3E3D6D] background-item" key={index}>
                  <span className="flex flex-row justify-center w-[158px]">{item}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='prediction-table-cells w-full'>
            {data.map((item: TableDataItem, index: number) => (
              // <tr className={'flex flex-row border-[#6359E9] text-[#AEABD8] text-s'} key={index}>
              <tr className={'flex flex-row text-[#AEABD8] text-s'} key={index}>
                <TableCell key={`PredictData-${index}`} value={item.PredictData}/>
                <TableCell key={`SelectData-${index}`} value={item.SelectData}/>
              
                <TableCell key={`DroneId-${index}`} value={item.DroneId}/>
                <TableCell key={`PredictTime-${index}`} value={item.PredictTime.slice(0, -4)}/>
              
                <TableCell value={item.SensorData.attitudeRoll}/>
                <TableCell value={item.SensorData.attitudePitch}/>
                <TableCell value={item.SensorData.attitudeYaw}/>
              
                <TableCell value={item.SensorData.rawImuXacc}/>
                <TableCell value={item.SensorData.rawImuYacc}/>
                <TableCell value={item.SensorData.rawImuZacc}/>
              
                <TableCell value={item.SensorData.rawImuXgyro}/>
                <TableCell value={item.SensorData.rawImuZgyro}/>
                <TableCell value={item.SensorData.rawImuZgyro}/>
              
                <TableCell value={item.SensorData.rawImuXmag}/>
                <TableCell value={item.SensorData.rawImuZmag}/>
                <TableCell value={item.SensorData.rawImuYmag}/>
              
                <TableCell value={item.SensorData.vibrationVibrationX}/>
                <TableCell value={item.SensorData.vibrationVibrationY}/>
                <TableCell value={item.SensorData.vibrationVibrationZ}/>
              
                <TableCell value={item.SensorData.sensorOffsetsAccelCalX}/>
                <TableCell value={item.SensorData.sensorOffsetsAccelCalY}/>
                <TableCell value={item.SensorData.sensorOffsetsAccelCalZ}/>
                <TableCell value={item.SensorData.sensorOffsetsMagOfsX}/>
                <TableCell value={item.SensorData.sensorOffsetsMagOfsY}/>
                <TableCell value={item.SensorData.globalPositionIntVy}/>
                <TableCell value={item.SensorData.globalPositionIntVx}/>
                <TableCell value={item.SensorData.localPositionNedX}/>
                <TableCell value={item.SensorData.localPositionNedVx}/>
                <TableCell value={item.SensorData.localPositionNedVy}/>
                <TableCell value={item.SensorData.navControllerOutputNavPitch}/>
                <TableCell value={item.SensorData.navControllerOutputNavBearing}/>
                <TableCell value={item.SensorData.servoOutputRawServo3Raw}/>
                <TableCell value={item.SensorData.servoOutputRawServo8Raw}/>
                <TableCell value={item.SensorData.vfrHudGroundspeed}/>
                <TableCell value={item.SensorData.vfrHudAirspeed}/>
                <TableCell value={item.SensorData.scaledPressurePressAbs}/>
                <TableCell value={item.SensorData.powerStatusVservo}/>
                <TableCell value={item.SensorData.batteryStatusVoltages1}/>
                <TableCell value={item.SensorData.rcChannelsChancount}/>
                <TableCell value={item.SensorData.rcChannelsChan12Raw}/>
                <TableCell value={item.SensorData.rcChannelsChan13Raw}/>
                <TableCell value={item.SensorData.rcChannelsChan14Raw}/>
                <TableCell value={item.SensorData.rcChannelsChan15Raw}/>
                <TableCell value={item.SensorData.rcChannelsChan16Raw}/>
              </tr>
            ))}
          </tbody>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </table>
      </div>

    </div>
  )
}

interface TableCellProps {
  value: string | number;
}

const TableCell = ({ value }: TableCellProps) => (
  <td className='prediction-table-cells-design'>
    <span className='prediction-table-value-data-design'>{value}</span>
  </td>
)

export default PredictionTable
