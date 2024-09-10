import React, { useContext, useMemo, useState } from 'react'
import { GCSLoadingBar } from '../common/GCSLoadingBar'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { GCSModal } from '../common/GCSModal'
import GCSInput from '../common/GCSInput'
import { GCSButton } from '../common/GCSButton'

export const MavlinkParametersModal = ({ droneId, paramInfo, ...props }) => {
  const [search, setSearch] = useState()
  const [mouseOver, setMouseOver] = useState()
  const [editing, setEditing] = useState()
  const [editingValue, setEditingValue] = useState()

  const {
    handleLoadMavlinkParams,
    mavParameters,
    mavParametersDownloadProgress,
    selectedDroneId,
    handleUpdateMavlinkParam,
    ParamInfo,
  } = useContext(SignalRContext)
  const parameters = useMemo(() => mavParameters[selectedDroneId], [selectedDroneId, mavParameters])
  const progress = useMemo(
    () => mavParametersDownloadProgress[selectedDroneId],
    [selectedDroneId, mavParametersDownloadProgress],
  )

  function rep(param, ...args) {
    const result = param.replaceAll('\x00', '')

    let Param = 'Param'
    let Description = 'Description'
    let Units = 'Units'
    let Range = 'Range'
    let Values = 'Values'
    let Increment = 'Increment'
    let RebootRequired = 'RebootRequired'
    let Bitmask = 'Bitmask'
    let ReadOnly = 'ReadOnly'
    let Advanced = 'Advanced'
    let Standard = 'Standard'

    // option 값들을 모두 저장할 배열
    const optionValues = []

    // args 배열을 순회하며 일치하는 값이 있는지 확인하고, 있다면 optionValues 배열에 해당 값을 추가
    args.forEach(option => {
      if (ParamInfo && ParamInfo[result] && ParamInfo[result][option] !== null) {
        if (![Description, Units, ReadOnly, Param, Values, Increment].includes(option))
          optionValues.push(`${option} \n ${ParamInfo[result][option]}`)
        else if (option === Values) {
          optionValues.push(`${ParamInfo[result][option].replaceAll(/[, ]/g, '\n')}`)
        }

        else
          optionValues.push(`${ParamInfo[result][option]}`)
      }
      else {
        if (option === Param) {
          optionValues.push(result)
        }

      }

    })
    // optionValues 배열에 저장된 값들을 줄바꿈을 추가하여 문자열로 변환하여 반환
    return optionValues.join('\n')
  }

  return (
    <GCSModal {...props}>
      <div className="p-6 rounded-lg w-[1106px] max-h-[800px] min-h-[200px] flex flex-col bg-[#27264E]">
        <GCSInput placeholder="search" value={search} onChange={e => setSearch(e.target.value)} />
        {progress ? <GCSLoadingBar percentage={(progress.Current / progress.Total) * 100} /> : null}
        <div className="flex-1 flex flex-col space-y-1 max-w-[1050px] overflow-y-scroll max-height: 500px mb-4">
          <div className="max-w-[1050px] flex justify-between min-h-12 align-middle" style={{ position: 'sticky', top: 0, borderBottom: '3px solid #2d3748' }}>
            <div className="flex-1 max-w-[160px] bg-[#8C89B4] text-black decoration-500 text-center justify-center p-3">Param Name</div>
            <div className="flex-1 max-w-[600px] bg-[#8C89B4] break-all leading-3 text-black font-bold text-center p-1 p-1 ml-1 flex inline-flex items-center justify-center whitespace-pre-line">Description</div>
            <div className="flex-1 max-w-[50px] bg-[#8C89B4] break-all leading-3 text-black font-bold text-center p-1 p-1 ml-1 flex inline-flex items-center justify-center ">Units</div>
            <div className="flex-1 max-w-[50px] bg-[#8C89B4] break-all leading-3 text-black font-bold text-center p-1 p-1 ml-1 flex inline-flex items-center justify-center ">INC</div>
            <div className="flex-1 max-w-[100px] bg-[#8C89B4] break-all leading-3 text-black font-bold text-center p-1 p-1 ml-1 flex inline-flex items-center justify-center ">Option</div>
            <div className="flex-1 max-w-[280px] bg-[#8C89B4] break-all leading-3 text-black font-bold text-center ml-2 flex inline-flex items-center justify-center mr-1">Value</div>
          </div>
          {parameters
            ?.filter(param => (search ? param.Name.toLowerCase().indexOf(search) !== -1 : true))
            .map(param =>
              <div
                key={param.Name}
                className="max-w-[1050px] flex justify-between min-h-12 align-middle"
                onMouseEnter={() => setMouseOver(param.Name)}
                onMouseLeave={() => setMouseOver(undefined)}>
                <div className="flex-1 max-w-[160px] bg-[#8C89B4] text-white text-center flex items-center justify-center p-2">{rep(param.Name, 'Param')}</div>
                <div className="flex-1 max-w-[600px] break-all leading-3 text-white text-center p-1 bg-[#B6B1C7] p-1 ml-1 flex inline-flex items-center justify-center whitespace-pre-line">{rep(param.Name, 'Description')}</div>
                <div className="flex-1 max-w-[50px] break-all leading-3 text-white text-center p-1 bg-[#B6B1C7] p-1 ml-1 flex inline-flex items-center justify-center whitespace-pre-line ">{rep(param.Name, 'Units')}</div>
                <div className="flex-1 max-w-[50px] break-all leading-3 text-white text-center p-1 bg-[#B6B1C7] p-1 ml-1 flex inline-flex items-center justify-center whitespace-pre-line ">{rep(param.Name, 'Increment')}</div>
                <div className="flex-1 max-w-[100px] break-all leading-3 text-white text-center p-1 bg-[#B6B1C7] p-1 ml-1 flex inline-flex items-center justify-center whitespace-pre-line">{rep(param.Name, 'Range', 'Values')}</div>
                <div className="flex-1 max-w-[280px] break-all leading-3 text-white text-center bg-[#B6B1C7] ml-2 flex items-center justify-center whitespace-pre-line mr-1">
                  {editing?.Name === param.Name ? (
                    <input
                      className="bg-transparent"
                      style={{ width: '55px', borderColor : '#8C89B4', borderStyle : 'solid', borderWidth: '2px', borderRadius : '4px', marginLeft: '70px', padding:'3px', backgroundColor: '#8C89B4' }}
                      // style={{ width: '55px', borderColor : '#1D1D41', borderStyle : 'solid', borderWidth: '2px', borderRadius : '4px', marginLeft: '70px', padding:'3px', backgroundColor: '#8C89B4' }}

                      value={editingValue}
                      onChange={e => setEditingValue(e.target.value)}
                    />
                  ) : (
                    <div className="flex-1 text-center items-center justify-center" >{param.Value}</div>
                  )}
                  {mouseOver === param.Name || editing?.Name === param.Name ? (
                    <GCSButton
                      type="link"
                      onClick={() => {
                        if (editing?.Name !== param.Name && rep(param.Name, 'ReadOnly') !== 'True') {

                          setEditing(param)
                          setEditingValue(param.Value)
                        } else {
                          handleUpdateMavlinkParam(selectedDroneId, editing?.Name, parseFloat(editingValue))
                          setEditing(undefined)
                          setEditingValue(undefined)
                        }
                      }}>
                      <FontAwesomeIcon
                        color="white"
                        className="flex-1 text-lg"
                        icon={editing?.Name === param.Name ? faCheckSquare : faEdit}
                      />
                    </GCSButton>
                  ) : null}
                </div>
              </div>
            )}
        </div>
        <div className="space-x-2">
          <GCSButton className='bg-[#6359E9]' onClick={() => handleLoadMavlinkParams(droneId)}>Fetch</GCSButton>
        </div>
      </div>
    </GCSModal>
  )
}
