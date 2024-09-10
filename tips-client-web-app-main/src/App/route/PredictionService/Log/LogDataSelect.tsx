import React, { useContext, useState } from 'react'
import LogForm from './LogForm'
import LogDroneTable from './LogDroneTable'
import LogCart from './LogOptionCart'
import LogSelectOption from './LogSelectOption'
import { SystemThemeContext } from '../../AppWrapper'
import TFTLogForm from './LogFormTFT'
import { LoadingPage2 } from '../../LoadingPage/Loadingpage'

const LogDataSelect = (props:any) => {
  const [tableData, setTableData] = useState<any[]>([])
  const [graphData, setGraphData] = useState<any[]>([])
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>(['ROLL', 'PITCH', 'YAW'])
  const { themeName }=useContext(SystemThemeContext)
  const className=`log-container grid gap-4 ${themeName}`

  const tableTransfer = (data: any[]) => {
    setTableData(data)
    // console.log('table', data)
  }

  const graphTransfer = (data: any[]) => {
    setGraphData(data)
    // console.log('graph', data)
  }

  const handleSelectedCheckboxesChange = (newSelectedCheckboxes: any[]) => {
    setSelectedCheckboxes(newSelectedCheckboxes)
  }

  if (props.loading) {
    return <LoadingPage2/>
  }

  if (themeName === 'tft') {
    return (
      <>
        <div id='logDataselection' className={className}>
          <TFTLogForm
            tableTransfer={tableTransfer}
            graphTransfer={graphTransfer}
            // @ts-ignore
            loading={props.loading}
            setLoading={props.setLoading}
          />
          <LogSelectOption
            graphData={graphData}
            onSelectedCheckboxesChange={handleSelectedCheckboxesChange}
          />
          <LogCart graphData={graphData} selectedCheckboxes={selectedCheckboxes}/>
          <LogDroneTable tableData={tableData}/>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div id='logDataselection' className={className}>
          <LogForm tableTransfer={tableTransfer} graphTransfer={graphTransfer}/>
          <LogSelectOption
            graphData={graphData}
            onSelectedCheckboxesChange={handleSelectedCheckboxesChange}
          />
          <LogCart graphData={graphData} selectedCheckboxes={selectedCheckboxes}/>
          <LogDroneTable tableData={tableData}/>
        </div>
      </>
    )
  }

}

export default LogDataSelect