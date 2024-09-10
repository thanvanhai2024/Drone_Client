import React from 'react'
import { ColorThema } from '../components/ProjectTema'


interface SensorData {
  // xacc_RAW_IMU: number
  [key: string | number]: number | boolean
}

interface Props {
  WarningData: SensorData
}

export const RealTimeTable: React.FC<Props> = (props) => { //= (props) => {

  return (
    <div className={`flex flex-row w-full h-ful overflow-hi mb-4 rounded-2xl ${ColorThema.Secondary4}`}>
      <div className="flex flex-col h-[250px] w-[20%] p-3 ">
        <span className="text-white rounded-md ml-3 mb-5 font-bold text-medium">• 드론 상태 진단 현황</span>
        <RealTimeStateTable WarningData={props.WarningData}/>
      </div>
      <div className="flex flex-col h-full w-[80%] py-3 pr-3 ">
        <span className="text-white rounded-md ml-3 mb-5 font-bold text-medium">
                        • 로그별 잔차 임계치 이상발생 수
        </span>
        <RealTimeAnomalyTable WarningData={props.WarningData}/>
      </div>
    </div>)
}

const RealTimeStateTable: React.FC<Props> = (props) => {// = (props) => {

  // const WarningData = props.WarningData || {}
  const WarningData: SensorData = props.WarningData || {}
 
  const wholeCount = Object.values(WarningData).filter(value => value === false).length

  return (
    <div
      className="flex flex-col items-center  my-auto mx-3 rounded-md border border-[#6359E9] text-white font-normal ">
      <div className="flex flex-col overflow-hidden w-full">
        <div className="">
          <div className={`flex w-full justify-center  ${ColorThema.Secondary2}`}>
            <div className="flex text-center p-2 font-normal">전체로그 수</div>
          </div>
          <div className="flex w-full mx-auto text-center ">
            <div className="flex flex-col w-full">
              <div className={`w-full  p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                정상
              </div>
              <div className="p-2">{15 - wholeCount}</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                주의
              </div>
              <div className="w-full p-2 border-x border-[#6359E9]">0</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                위험
              </div>
              <div className="p-2">{wholeCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RealTimeAnomalyTable: React.FC<Props> = (props) => {// = (props : any) => {
  // const WarningData = props.WarningData || {}
  const WarningData: SensorData = props.WarningData || {}
  const deviceCount = ['roll_ATTITUDE', 'pitch_ATTITUDE', 'yaw_ATTITUDE'].filter(prop => WarningData[prop] === false).length
  const gyrCount = ['xgyro_RAW_IMU', 'ygyro_RAW_IMU', 'zgyro_RAW_IMU'].filter(prop => WarningData[prop] === false).length
  const accCount = ['xacc_RAW_IMU', 'yacc_RAW_IMU', 'zacc_RAW_IMU'].filter(prop => WarningData[prop] === false).length
  const magCount = ['xmag_RAW_IMU', 'ymag_RAW_IMU', 'zmag_RAW_IMU'].filter(prop => WarningData[prop] === false).length
  const vibCount = ['vibration_x_VIBRATION', 'vibration_y_VIBRATION', 'vibration_z_VIBRATION'].filter(prop => WarningData[prop] === false).length

  return (
    <div
      className="flex flex-row items-center my-auto mx-3 rounded-md border border-[#6359E9] text-white font-thin overflow-hidden ">
      <div className="flex flex-col w-full border-r border-[#6359E9]">
        <div className="font-normal">
          <div className={`flex w-full justify-center ${ColorThema.Secondary2}`}>
            <div className="flex p-2 text-center font-normal ">기체 자세</div>
          </div>
          <div className="flex w-full mx-auto text-center">
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                정상
              </div>
              <div className=" p-2">{3 - deviceCount}</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                주의
              </div>
              <div className="w-full p-2 border-x border-[#6359E9]">0</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                위험
              </div>
              <div className=" p-2">{deviceCount}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-r border-[#6359E9]">
        <div className="font-normal">
          <div className={`flex w-full justify-center ${ColorThema.Secondary2}`}>
            <div className="flex p-2 text-center font-normal">자이로 센서</div>
          </div>
          <div className="flex w-full mx-auto text-center">
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                정상
              </div>
              <div className=" p-2">{3 - gyrCount}</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                주의
              </div>
              <div className="w-full p-2 border-x border-[#6359E9]">0</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                위험
              </div>
              <div className=" p-2">{gyrCount}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-r border-[#6359E9]">
        <div className="font-normal ">
          <div className={`flex w-full justify-center ${ColorThema.Secondary2}`}>
            <div className="flex p-2 text-center font-normal">가속도 센서</div>
          </div>
          <div className="flex w-full mx-auto text-center">
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                정상
              </div>
              <div className=" p-2">{3 - accCount}</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                주의
              </div>
              <div className="w-full p-2 border-x border-[#6359E9]">0</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                위험
              </div>
              <div className=" p-2">{accCount}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-r border-[#6359E9]">
        <div className="font-normal ">
          <div className={`flex w-full justify-center ${ColorThema.Secondary2}`}>
            <div className="flex p-2 text-center font-normal">지자기 센서</div>
          </div>
          <div className="flex w-full mx-auto text-center">
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                정상
              </div>
              <div className=" p-2">{3 - magCount}</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full  p-2 border font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                주의
              </div>
              <div className="w-full p-2 border-x border-[#6359E9]">0</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                위험
              </div>
              <div className=" p-2">{magCount}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full ">
        <div className="font-normal ">
          <div className={`flex w-full justify-center ${ColorThema.Secondary2}`}>
            <div className="flex p-2 text-center font-normal">진동 센서</div>
          </div>
          <div className="flex w-full mx-auto text-center">
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                정상
              </div>
              <div className=" p-2">{3 - vibCount}</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                주의
              </div>
              <div className="w-full p-2 border-x border-[#6359E9]">0</div>
            </div>
            <div className="flex flex-col w-full">
              <div className={`w-full p-2 border-y font-normal border-[#6359E9] ${ColorThema.Secondary2}`}>
                위험
              </div>
              <div className=" p-2">{vibCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
