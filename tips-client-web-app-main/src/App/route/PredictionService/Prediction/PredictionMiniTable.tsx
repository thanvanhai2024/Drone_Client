import React from 'react'

import '../TableStyles.css'
import { DataMap } from '../components/DataMap'


interface MiniTableDataItem {
  PredictData: number;
  SelectData: number;
  DroneId: string;
  PredictTime: string;
  SensorData: {
    // Define properties within SensorData
    roll_ATTITUDE: any //number
    pitch_ATTITUDE: any //number
  };
}

interface PredictionTableProps {
  tableData: MiniTableDataItem[];
}

export const PredictionMiniTable : React.FC<PredictionTableProps> = (props) => {//= (props : any) => {
  const minitableObj = {
    header:DataMap.mini_header,
    data: props.tableData
  }


  return(
    <div className='flex flex-col h-full overflow-auto border-[#6359E9] border rounded-md mt-1 justify-start items-center text-center bg-[$1D1D41]'>
      <table id='predict-table' className='flex flex-col h-full w-full overflow-auto'>
        <thead className='flex flex-col justify-around w-full'>
          <tr className='flex flex-row  text-white font-bold'>
            {minitableObj.header.map((item :string, index: number)=> {
              return <th className='flex flex-col justify-center h-[50px] border-[#6359E9] border-r border-b bg-[#3E3D6D]' key={index}>
                <span className='flex flex-row justify-center w-[160px]'>{item}</span>
              </th>
            })}
          </tr>
        </thead>
        <tbody className="flex flex-col justify-around w-full">
          {minitableObj.data.map((item : any, index : number) => (
            <tr className={'flex flex-row h-full border-[#6359E9] text-[#AEABD8] text-s'} key={index}>
              <TableCell key={`PredictData-${index}`} value={item.PredictData} />
              <TableCell key={`SelectData-${index}`} value={item.SelectData} />
              <TableCell key={`DroneId-${index}`} value={item.DroneId} />
              <TableCell key={`PredictTime-${index}`} value={item.PredictTime} />
              <TableCell key={`roll_ATTITUDE-${index}`} value={item.SensorData.roll_ATTITUDE} />
              <TableCell key={`pitch_ATTITUDE-${index}`} value={item.SensorData.pitch_ATTITUDE} />
              <TableCell key={`yaw_ATTITUDE-${index}`} value={item.SensorData.yaw_ATTITUDE} />
              <TableCell key={`xacc_RAW_IMU-${index}`} value={item.SensorData.xacc_RAW_IMU} />
              <TableCell key={`yacc_RAW_IMU-${index}`} value={item.SensorData.yacc_RAW_IMU} />
              <TableCell key={`zacc_RAW_IMU-${index}`} value={item.SensorData.zacc_RAW_IMU} />
              <TableCell key={`xgyro_RAW_IMU-${index}`} value={item.SensorData.xgyro_RAW_IMU} />
              <TableCell key={`ygyro_RAW_IMU-${index}`} value={item.SensorData.ygyro_RAW_IMU} />
              <TableCell key={`zgyro_RAW_IMU-${index}`} value={item.SensorData.zgyro_RAW_IMU} />
              <TableCell key={`xmag_RAW_IMU-${index}`} value={item.SensorData.xmag_RAW_IMU} />
              <TableCell key={`ymag_RAW_IMU-${index}`} value={item.SensorData.ymag_RAW_IMU} />
              <TableCell key={`zmag_RAW_IMU-${index}`} value={item.SensorData.zmag_RAW_IMU} />
              <TableCell key={`vibration_x_VIBRATION-${index}`} value={item.SensorData.vibration_x_VIBRATION} />
              <TableCell key={`vibration_y_VIBRATION-${index}`} value={item.SensorData.vibration_y_VIBRATION} />
              <TableCell key={`vibration_z_VIBRATION-${index}`} value={item.SensorData.vibration_z_VIBRATION} />
              <TableCell key={`accel_cal_x_SENSOR_OFFSETS-${index}`} value={item.SensorData.accel_cal_x_SENSOR_OFFSETS} />
              <TableCell key={`accel_cal_y_SENSOR_OFFSETS-${index}`} value={item.SensorData.accel_cal_y_SENSOR_OFFSETS} />
              <TableCell key={`accel_cal_z_SENSOR_OFFSETS-${index}`} value={item.SensorData.accel_cal_z_SENSOR_OFFSETS} />
              <TableCell key={`mag_ofs_x_SENSOR_OFFSETS-${index}`} value={item.SensorData.mag_ofs_x_SENSOR_OFFSETS} />
              <TableCell key={`mag_ofs_y_SENSOR_OFFSETS-${index}`} value={item.SensorData.mag_ofs_y_SENSOR_OFFSETS} />
              <TableCell key={`vx_GLOBAL_POSITION_INT-${index}`} value={item.SensorData.vx_GLOBAL_POSITION_INT} />
              <TableCell key={`vy_GLOBAL_POSITION_INT-${index}`} value={item.SensorData.vy_GLOBAL_POSITION_INT} />
              <TableCell key={`x_LOCAL_POSITION_NED-${index}`} value={item.SensorData.x_LOCAL_POSITION_NED} />
              <TableCell key={`vx_LOCAL_POSITION_NED-${index}`} value={item.SensorData.vx_LOCAL_POSITION_NED} />
              <TableCell key={`vy_LOCAL_POSITION_NED-${index}`} value={item.SensorData.vy_LOCAL_POSITION_NED} />
              <TableCell key={`nav_pitch_NAV_CONTROLLER_OUTPUT-${index}`} value={item.SensorData.nav_pitch_NAV_CONTROLLER_OUTPUT} />
              <TableCell key={`nav_bearing_NAV_CONTROLLER_OUTPUT-${index}`} value={item.SensorData.nav_bearing_NAV_CONTROLLER_OUTPUT} />
              <TableCell key={`servo3_raw_SERVO_OUTPUT_RAW-${index}`} value={item.SensorData.servo3_raw_SERVO_OUTPUT_RAW} />
              <TableCell key={`servo8_raw_SERVO_OUTPUT_RAW-${index}`} value={item.SensorData.servo8_raw_SERVO_OUTPUT_RAW} />
              <TableCell key={`groundspeed_VFR_HUD-${index}`} value={item.SensorData.groundspeed_VFR_HUD} />
              <TableCell key={`airspeed_VFR_HUD-${index}`} value={item.SensorData.airspeed_VFR_HUD} />
              <TableCell key={`press_abs_SCALED_PRESSURE-${index}`} value={item.SensorData.press_abs_SCALED_PRESSURE} />
              <TableCell key={`Vservo_POWER_STATUS-${index}`} value={item.SensorData.Vservo_POWER_STATUS} />
              <TableCell key={`voltages1_BATTERY_STATUS-${index}`} value={item.SensorData.voltages1_BATTERY_STATUS} />
              <TableCell key={`chancount_RC_CHANNELS-${index}`} value={item.SensorData.chancount_RC_CHANNELS} />
              <TableCell key={`chan12_raw_RC_CHANNELS-${index}`} value={item.SensorData.chan12_raw_RC_CHANNELS} />
              <TableCell key={`chan13_raw_RC_CHANNELS-${index}`} value={item.SensorData.chan13_raw_RC_CHANNELS} />
              <TableCell key={`chan14_raw_RC_CHANNELS-${index}`} value={item.SensorData.chan14_raw_RC_CHANNELS} />
              <TableCell key={`chan15_raw_RC_CHANNELS-${index}`} value={item.SensorData.chan15_raw_RC_CHANNELS} />
              <TableCell key={`chan16_raw_RC_CHANNELS-${index}`} value={item.SensorData.chan16_raw_RC_CHANNELS} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
interface TableCellProps {
  value: string;
}
const TableCell = ({ value } : TableCellProps) => (
  <td className="flex flex-col justify-center h-[50px] border-b border-[#6359E9] border-r font-normal">
    <span className="flex flex-row justify-center w-[160px]">{value}</span>
  </td>
)
