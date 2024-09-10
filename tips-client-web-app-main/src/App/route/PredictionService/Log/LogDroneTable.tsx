import React, { useContext, useState } from 'react'
import './Log.scss'
import { DataMap } from '../components/DataMap'
import { SystemThemeContext } from '../../AppWrapper'

import ReactPaginate from 'react-paginate'


const LogDroneTable = (props: any) => {
  const { themeName }= useContext(SystemThemeContext)
  const { tableData } = props
  const classNames=`log-table-wrapper w-full h-full wrapper-border-radius ${themeName}`
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 5
  const startIndex = currentPage * pageSize
  const endIndex = Math.min((currentPage + 1) * pageSize, tableData.length)
  const data = tableData.slice(startIndex, endIndex)
  // const data = tableData || []
  
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)
  }
  const totalPages = Math.ceil(tableData.length / pageSize)
  
  return (
    <div className={classNames}>
      <div className='log-table-item'>
        <table>
          <thead className='flex flex-col justify-around w-full'>
            <tr className='flex flex-row text-white font-bold'>
              {DataMap.table_header.map((header, index) => (
                <th className='flex flex-col justify-center h-[50px] border-[#6359E9] border-r border-b bg-[#3E3D6D] background-item'
                  key={index}>
                  <span className='flex flex-row justify-center w-[158px]'>{header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='flex flex-col justify-around w-full'>
            {data.map((item : any, index : any) => (
              <React.Fragment key={index}>
                <tr className={'flex flex-row border-[#6359E9] text-[#AEABD8] text-xs '} key={index}>
                  <TableCell value={item.DroneId}/>
                  <TableCell value={item.FlightTime.slice(0, -4)}/> {/*Mon, 26 Feb 2024 16:05:10 GMT*/}
                  {/*<TableCell value={item.SensorData.attitudeRoll}/>*/}
                  {/*<TableCell value={item.SensorData.attitudePitch}/>*/}
                  {/*<TableCell value={item.SensorData.attitudeYaw}/>*/}

                  {/*<TableCell value={item.SensorData.rawImuXacc}/>*/}
                  {/*<TableCell value={item.SensorData.rawImuYacc}/>*/}
                  {/*<TableCell value={item.SensorData.rawImuZacc}/>*/}

                  {/*<TableCell value={item.SensorData.rawImuXgyro}/>*/}
                  {/*<TableCell value={item.SensorData.rawImuYgyro}/>*/}
                  {/*<TableCell value={item.SensorData.rawImuZgyro}/>*/}

                  {/*<TableCell value={item.SensorData.rawImuXmag}/>*/}
                  {/*<TableCell value={item.SensorData.rawImuZmag}/>*/}
                  {/*<TableCell value={item.SensorData.rawImuYmag}/>*/}

                  {/*<TableCell value={item.SensorData.vibrationVibrationX}/>*/}
                  {/*<TableCell value={item.SensorData.vibrationVibrationY}/>*/}
                  {/*<TableCell value={item.SensorData.vibrationVibrationY}/>*/}

                  {/*<TableCell value={item.SensorData.sensorOffsetsAccelCalX}/>*/}
                  {/*<TableCell value={item.SensorData.sensorOffsetsAccelCalY}/>*/}
                  {/*<TableCell value={item.SensorData.sensorOffsetsAccelCalZ}/>*/}
                  {/*<TableCell value={item.SensorData.sensorOffsetsMagOfsX}/>*/}
                  {/*<TableCell value={item.SensorData.sensorOffsetsMagOfsY}/>*/}
                  {/*<TableCell value={item.SensorData.globalPositionIntVy}/>*/}
                  {/*<TableCell value={item.SensorData.globalPositionIntVx}/>*/}
                  {/*<TableCell value={item.SensorData.localPositionNedX}/>*/}
                  {/*<TableCell value={item.SensorData.localPositionNedVx}/>*/}
                  {/*<TableCell value={item.SensorData.localPositionNedVy}/>*/}
                  {/*<TableCell value={item.SensorData.navControllerOutputNavPitch}/>*/}
                  {/*<TableCell value={item.SensorData.navControllerOutputNavBearing}/>*/}
                  {/*<TableCell value={item.SensorData.servoOutputRawServo3Raw}/>*/}
                  {/*<TableCell value={item.SensorData.servoOutputRawServo8Raw}/>*/}
                  {/*<TableCell value={item.SensorData.vfrHudGroundspeed}/>*/}
                  {/*<TableCell value={item.SensorData.vfrHudAirspeed}/>*/}
                  {/*<TableCell value={item.SensorData.scaledPressurePressAbs}/>*/}
                  {/*<TableCell value={item.SensorData.powerStatusVservo}/>*/}
                  {/*<TableCell value={item.SensorData.batteryStatusVoltages1}/>*/}
                  {/*<TableCell value={item.SensorData.rcChannelsChancount}/>*/}
                  {/*<TableCell value={item.SensorData.rcChannelsChan12Raw}/>*/}
                  {/*<TableCell value={item.SensorData.rcChannelsChan13Raw}/>*/}
                  {/*<TableCell value={item.SensorData.rcChannelsChan14Raw}/>*/}
                  {/*<TableCell value={item.SensorData.rcChannelsChan15Raw}/>*/}
                  {/*<TableCell value={item.SensorData.rcChannelsChan16Raw}/>*/}

                  {/*  softwareTest*/}
                  <TableCell value={item.SensorData.attitudeRoll} />
                  <TableCell value={item.SensorData.attitudePitch} />
                  <TableCell value={item.SensorData.attitudeYaw} />
                  <TableCell value={item.SensorData.attitudeRollspeed} />
                  <TableCell value={item.SensorData.attitudePitchspeed} />
                  <TableCell value={item.SensorData.attitudeYawspeed} />
                  <TableCell value={item.SensorData.ahrsOmegaIx} />
                  <TableCell value={item.SensorData.ahrsOmegaIy} />
                  <TableCell value={item.SensorData.ahrsOmegaIz} />
                  <TableCell value={item.SensorData.ahrsErrorRp} />
                  <TableCell value={item.SensorData.ahrsErrorYaw} />
                  <TableCell value={item.SensorData.ahrs2Roll} />
                  <TableCell value={item.SensorData.ahrs2Pitch} />
                  <TableCell value={item.SensorData.ahrs2Yaw} />
                  <TableCell value={item.SensorData.ahrs3Roll} />
                  <TableCell value={item.SensorData.ahrs3Pitch} />
                  <TableCell value={item.SensorData.ahrs3Yaw} />
                  <TableCell value={item.SensorData.ekfStatusReportVelocityVariance} />
                  <TableCell value={item.SensorData.ekfStatusReportPosHorizVariance} />
                  <TableCell value={item.SensorData.ekfStatusReportPosVertVariance} />
                  <TableCell value={item.SensorData.ekfStatusReportCompassVariance} />
                  <TableCell value={item.SensorData.globalPositionIntAlt} />
                  <TableCell value={item.SensorData.globalPositionIntRelativeAlt} />
                  <TableCell value={item.SensorData.globalPositionIntVx} />
                  <TableCell value={item.SensorData.globalPositionIntVy} />
                  <TableCell value={item.SensorData.globalPositionIntVz} />
                  <TableCell value={item.SensorData.localPositionNedX} />
                  <TableCell value={item.SensorData.localPositionNedY} />
                  <TableCell value={item.SensorData.localPositionNedZ} />
                  <TableCell value={item.SensorData.localPositionNedVx} />
                  <TableCell value={item.SensorData.localPositionNedVy} />
                  <TableCell value={item.SensorData.localPositionNedVz} />
                  <TableCell value={item.SensorData.navControllerOutputNavRoll} />
                  <TableCell value={item.SensorData.navControllerOutputNavPitch} />
                  <TableCell value={item.SensorData.navControllerOutputNavBearing} />
                  <TableCell value={item.SensorData.navControllerOutputTargetBearing} />
                  <TableCell value={item.SensorData.navControllerOutputAspdError} />
                  <TableCell value={item.SensorData.navControllerOutputXtrackError} />
                  <TableCell value={item.SensorData.rawImuXacc} />
                  <TableCell value={item.SensorData.rawImuYacc} />
                  <TableCell value={item.SensorData.rawImuZacc} />
                  <TableCell value={item.SensorData.rawImuXgyro} />
                  <TableCell value={item.SensorData.rawImuYgyro} />
                  <TableCell value={item.SensorData.rawImuZgyro} />
                  <TableCell value={item.SensorData.rawImuXmag} />
                  <TableCell value={item.SensorData.rawImuYmag} />
                  <TableCell value={item.SensorData.rawImuZmag} />
                  <TableCell value={item.SensorData.scaledImu2Xacc} />
                  <TableCell value={item.SensorData.scaledImu2Yacc} />
                  <TableCell value={item.SensorData.scaledImu2Zacc} />
                  <TableCell value={item.SensorData.scaledImu2Xgyro} />
                  <TableCell value={item.SensorData.scaledImu2Ygyro} />
                  <TableCell value={item.SensorData.scaledImu2Zgyro} />
                  <TableCell value={item.SensorData.scaledImu2Xmag} />
                  <TableCell value={item.SensorData.scaledImu2Ymag} />
                  <TableCell value={item.SensorData.scaledImu2Zmag} />
                  <TableCell value={item.SensorData.scaledPressurePressAbs} />
                  <TableCell value={item.SensorData.scaledPressureTemperature} />
                  <TableCell value={item.SensorData.sensorOffsetsMagOfsX} />
                  <TableCell value={item.SensorData.sensorOffsetsMagOfsY} />
                  <TableCell value={item.SensorData.sensorOffsetsMagOfsZ} />
                  <TableCell value={item.SensorData.sensorOffsetsMagDeclination} />
                  <TableCell value={item.SensorData.sensorOffsetsGyroCalX} />
                  <TableCell value={item.SensorData.sensorOffsetsGyroCalY} />
                  <TableCell value={item.SensorData.sensorOffsetsGyroCalZ} />
                  <TableCell value={item.SensorData.sensorOffsetsAccelCalX} />
                  <TableCell value={item.SensorData.sensorOffsetsAccelCalY} />
                  <TableCell value={item.SensorData.sensorOffsetsAccelCalZ} />
                  <TableCell value={item.SensorData.servoOutputRawServo1Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo2Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo3Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo4Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo5Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo6Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo7Raw} />
                  <TableCell value={item.SensorData.servoOutputRawServo8Raw} />
                  <TableCell value={item.SensorData.vfrHudAirspeed} />
                  <TableCell value={item.SensorData.vfrHudGroundspeed} />
                  <TableCell value={item.SensorData.vfrHudHeading} />
                  <TableCell value={item.SensorData.vfrHudClimb} />
                  <TableCell value={item.SensorData.vibrationVibrationX} />
                  <TableCell value={item.SensorData.vibrationVibrationY} />
                  <TableCell value={item.SensorData.vibrationVibrationZ} />
                  <TableCell value={item.SensorData.batteryStatusVoltages1} />
                  <TableCell value={item.SensorData.batteryStatusCurrentBattery} />
                  <TableCell value={item.SensorData.batteryStatusCurrentConsumed} />
                  <TableCell value={item.SensorData.batteryStatusEnergyConsumed} />
                  <TableCell value={item.SensorData.batteryStatusBatteryRemaining} />
                  <TableCell value={item.SensorData.powerStatusVcc} />
                  <TableCell value={item.SensorData.powerStatusVservo} />
                  <TableCell value={item.SensorData.hwstatusVcc} />
                  <TableCell value={item.SensorData.rcChannelsChancount} />
                  <TableCell value={item.SensorData.rcChannelsChan1Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan2Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan3Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan4Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan5Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan6Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan7Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan8Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan9Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan10Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan11Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan12Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan13Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan14Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan15Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan16Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan17Raw} />
                  <TableCell value={item.SensorData.rcChannelsChan18Raw} />
                </tr>
              </React.Fragment>
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
  value: string | number
}

const TableCell = ({ value }: TableCellProps) => (
  <td className='log-table-cells-design'>
    <span className='log-table-value-data-design'>{value}</span>
  </td>
)
export default LogDroneTable
