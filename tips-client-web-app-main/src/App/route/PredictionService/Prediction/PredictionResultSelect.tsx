import React, { useContext, useEffect, useState } from 'react'
import { PredictionForm } from './PredictionForm'
import TFTPredictionForm from './PredictionFormTFT'
import PredictionResultGraph from './PredictionResultGraph'
import PredictResultSelectOption from './PredictResultSelectOption'
import PredictionTable from './PredictionTable'
import { SystemThemeContext } from '../../AppWrapper'
import { LoadingPage2 } from '../../LoadingPage/Loadingpage'

export const PredictionResultSelect = (props:any) => {
  const [tableData, setTableData] = useState<any[]>([])
  const [graphData, setOptionData] = useState<any[]>([])
  const [selectedLog, setSelectedLog] = useState<string[]>(['attitudeRoll'])
  const [Data, setData] = useState<any[]>([])
  const [finalData, setGraphData] = useState<any[]>([]) //any[] []를 둘다 {}로 고쳐보기 여기서 타입이 틀려서 그럼
  const { themeName } = useContext(SystemThemeContext)
  const classNames = `prediction-container grid gap-4 ${themeName}`

  const tableTransfer = (data: any[]) => {
    setTableData(data)
    // console.log('table', data)
  }

  const dataTransfer = (data: any[]) => {
    setData(data)
    // console.log('data', data)
  }

  const optionTransfer = (data: any[]) => {
    setOptionData(data)
    // console.log('graph', data)
  }

  // 이게 그래프로 (변수명 다시 만들어야함.)
  const finalDataTransfer = (data: any) => {
    setGraphData(data)
    // console.log('finalData', data)
  }

  const transfer = (value: string) => {
    //parsing graphData
    finalDataTransfer(Data.map((obj: any) => {
      return {
        'PredictTime': obj['PredictTime'],
        'PredictData': obj['PredictData'][`${value}_PREDICT`],
        'SelectData': obj['SensorData'][`${value}`],
      }
    }))

    //parsing tableData
    tableTransfer(Data.map((obj: any) => {
      return {
        'DroneId': obj['DroneId'],
        'PredictTime': obj['PredictTime'],
        'PredictData': obj['PredictData'][`${value}_PREDICT`],
        'SelectData': obj['SensorData'][value],
        'SensorData': obj['SensorData']
      }
    }))
  }

  useEffect(() => {
    if (Data !== null){
      transfer(selectedLog[0].toString())
    }
  }, [Data])

  if (props.loading) {
    return <LoadingPage2/>
  }
  if (themeName === 'tft') {
    return (
      <>
        <div className={classNames}>
          <TFTPredictionForm
            dataTransfer={dataTransfer}
            optionTransfer={optionTransfer}
            loading={props.loading}
            setLoading={props.setLoading}
          />
          <PredictResultSelectOption
            data={Data}
            graphData={graphData}
            transfer={transfer}
            finalDataTransfer={finalDataTransfer}
            tableTransfer={tableTransfer}
            setSelectedLog={setSelectedLog}
          />
          <PredictionResultGraph
            graphData={graphData}
            finalData={finalData}
            selectedLog={selectedLog[0]}
          />
          <PredictionTable tableData={tableData}/>

        </div>
      </>
    )
  } else {
    return (
      <>
        <div className={classNames}>
          <PredictionForm
            dataTransfer={dataTransfer}
            optionTransfer={optionTransfer}
          />
          <PredictionResultGraph
            graphData={graphData}
            finalData={finalData}
            selectedLog={selectedLog[0]}/>
          <PredictResultSelectOption
            data={Data}
            graphData={graphData}
            transfer={transfer}
            finalDataTransfer={finalDataTransfer}
            tableTransfer={tableTransfer}
            setSelectedLog={setSelectedLog}
          />
          <PredictionTable tableData={tableData}/>
        </div>
      </>
    )
  }
}
