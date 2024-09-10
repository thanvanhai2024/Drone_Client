import React, { useContext, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons'
import { SidebarComponentDiv, mavFrameList } from './RightPanelCommonComponent'
import { MissionContext } from '../components/MissionContext'
import { SystemThemeContext } from '../../AppWrapper'
import styled from 'styled-components'
import { isNil } from 'lodash'

export const RightPanelMission = () => {
  const { subMode, setSubMode } = useContext(MissionContext)
  return (
    <SidebarComponentDiv className="mt-1">
      <ButtonGroups
        subMode={subMode}
        setSubMode={setSubMode}
        items={[
          {
            title: 'Mission',
            value: 'mission',
          },
          // {
          //   title: 'Fence',
          //   value: 'fence',
          // },
          // {
          //   title: 'Rally',
          //   value: 'rally',
          // },
        ]}
      />

      {(subMode === 'mission' && <MissionBody />) || null}
    </SidebarComponentDiv>
  )
}

const ScrollContainer = styled.div`
  overflow-y: scroll; /* 세로 스크롤이 필요한 경우에만 스크롤바를 표시 */
  scrollbar-width: none; /* Firefox에 스크롤바 숨기기 */
  -ms-overflow-style: none; /* Internet Explorer에 스크롤바 숨기기 */
  /* WebKit 브라우저(예: Chrome, Safari)에서 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none; /* 스크롤바 숨김 */
  }
`

const MissionBody = () => {
  const [expanding, setExpanding] = useState()
  const { missionItems, removeWaypoint, updateWaypoint } = useContext(MissionContext)

  return (
    <ScrollContainer>
      <div className="flex text-white mt-4 flex-col space-y-4">
        {missionItems.map((missionItem, index) => (
          <MissionItem
            key={index}
            onChangeParam={(paramIndex, value) => {
              updateWaypoint(index, {
                ...missionItem,
                [paramIndex]: value,
              })
            }}
            expand={expanding === index}
            toggleExpand={() => {
              setExpanding(old => (old !== undefined && old === index ? undefined : index))
            }}
            toggleExpandTure={() => {
              setExpanding(index)
            }}
            missionItem={missionItem}
            onRemoveWaypoint={() => {
              removeWaypoint(index)
            }}
            draggable={true}
          />
        ))}
      </div>
    </ScrollContainer>
  )
}

function getMissionItemName(missionType) {
  if (missionType === 'START') {
    return 'Mission Start'
  } else if (missionType === 'MAV_CMD_NAV_TAKEOFF') {
    return 'Takeoff'
  } else if (missionType === 'MAV_CMD_NAV_RETURN_TO_LAUNCH') {
    return 'Return To Launch'
  } else {
    return 'Waypoint'
  }
}

const MissionItem = ({ missionItem, onChangeParam, onRemoveWaypoint, expand, toggleExpand, toggleExpandTure }) => {
  const { themeName } = useContext(SystemThemeContext)
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="w-full flex flex-col">
      <div
        className={`w-full h-10 flex p-2 ${themeName === 'tft' ? 'bg-[#1F42A9]' : 'bg-[#4B4B99]'} ${
          expand ? 'rounded-tl-lg rounded-tr-lg' : 'rounded-lg'
        } justify-between cursor-pointer`}
        onClick={() => {
          toggleExpand()
        }}>
        <div className="flex space-x-2">
          {missionItem.type !== 'START' && missionItem.type !== 'MAV_CMD_NAV_TAKEOFF' ? (
            <button
              onClick={e => {
                e.stopPropagation()
                onRemoveWaypoint()
              }}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          ) : null}
          <span>{getMissionItemName(missionItem.type)}</span>
        </div>

        <div>
          <button
            onClick={e => {
              e.stopPropagation()
              if (!expand) {
                toggleExpandTure()
              }
              setShowAll(old => !old)
            }}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>
      {expand ? (
        <MissionItemBody
          showAll={showAll}
          onChangeParam={onChangeParam}
          missionItem={missionItem}
          themeName={themeName}
        />
      ) : null}
    </div>
  )
}

const MissionItemBody = ({ missionItem, onChangeParam, showAll, themeName }) => {
  const [hasSpeed, setHasSpeed] = useState(false)
  const [hasServo, setHasServo] = useState(false)

  useEffect(() => {
    if (missionItem.speed) {
      setHasSpeed(true)
    }
  }, [missionItem.speed])

  useEffect(() => {
    if (!isNil(missionItem.servoNumber)) {
      setHasServo(true)
    }
  }, [missionItem.servoNumber])

  return (
    <div
      className={`flex flex-col space-y-2 text-black p-2 ${themeName === 'tft' ? 'bg-[#1F42A9]' : 'bg-[#4B4B99]'} rounded-br-lg rounded-bl-lg text-sm`}>
      {/*<div className="flex flex-col space-y-2 text-black p-2 bg-accent-bg-2 rounded-br-lg rounded-bl-lg text-sm">*/}
      {/*<div className="bg-yellow-100 w-full h-16 rounded flex flex-col p-1">*/}
      <div className={`${themeName === 'tft' ? 'bg-[#99CCFF]' : 'bg-[#8C89B4]'} w-full h-16 rounded flex flex-col p-1`}>
        <span className="text-white font-bold text-sm mb-1">Altitude</span>
        <input
          className="rounded p-1"
          value={missionItem.altitude}
          onChange={e => onChangeParam('altitude', tryParseFloat(e.target.value))}
        />
      </div>
      {showAll ? (
        <>
          <SelectWithLabel
            label="Command"
            value={missionItem.type}
            onChange={e => onChangeParam('type', e.target.value)}
            options={mavCmdList}
          />
          <SelectWithLabel
            label="Frame"
            value={missionItem.frame}
            onChange={e => onChangeParam('frame', e.target.value)}
            options={Object.keys(mavFrameList).map(key => mavFrameList[key])}
          />
          <InputWithLabel
            label="Param 1"
            value={missionItem.param1 || 0}
            onChange={e => onChangeParam('param1', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Param 2"
            value={missionItem.param2 || 0}
            onChange={e => onChangeParam('param2', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Param 3"
            value={missionItem.param3 || 0}
            onChange={e => onChangeParam('param3', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Param 4"
            value={missionItem.param4 || 0}
            onChange={e => onChangeParam('param4', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Param 5"
            value={missionItem.param5 || 0}
            onChange={e => onChangeParam('param5', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Lat/X"
            value={missionItem.latitude}
            onChange={e => onChangeParam('latitude', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Lng/Y"
            value={missionItem.longitude}
            onChange={e => onChangeParam('longitude', tryParseFloat(e.target.value))}
          />
          <InputWithLabel
            label="Altitude/Z"
            value={missionItem.altitude}
            onChange={e => onChangeParam('altitude', tryParseFloat(e.target.value))}
          />
        </>
      ) : (
        <>
          <InputWithLabel
            label="Hold"
            value={missionItem.param1 || 0}
            onChange={e => onChangeParam('param1', tryParseFloat(e.target.value))}
          />
          {missionItem.type === 'MAV_CMD_NAV_WAYPOINT' ? (
            <>
              <InputWithLabel
                label={
                  <div className="flex space-x-2">
                    <input
                      type="checkbox"
                      checked={hasSpeed}
                      onChange={() => {
                        if (hasSpeed) {
                          onChangeParam('speed', undefined)
                        }
                        setHasSpeed(old => !old)
                      }}
                    />
                    <span>Speed</span>
                  </div>
                }
                value={missionItem.speed}
                placeholder={missionItem.speed || 5}
                onChange={e => onChangeParam('speed', e.target.value && tryParseFloat(e.target.value))}
                disabled={!hasSpeed}
              />
              <InputWithLabel
                label={
                  <div className="flex space-x-2">
                    <input
                      type="checkbox"
                      checked={hasServo}
                      onChange={() => {
                        if (hasServo) {
                          onChangeParam('servoNumber', undefined)
                        }
                        setHasServo(old => !old)
                      }}
                    />
                    <span>Servo Number</span>
                  </div>
                }
                value={missionItem.servoNumber}
                placeholder={missionItem.servoNumber}
                onChange={e => onChangeParam('servoNumber', e.target.value && tryParseFloat(e.target.value))}
                disabled={!hasServo}
              />
              <InputWithLabel
                label={
                  <div className="flex space-x-2">
                    <input
                      type="checkbox"
                      checked={hasServo}
                      onChange={() => {
                        if (hasServo) {
                          onChangeParam('servoPWM', undefined)
                        }
                        setHasServo(old => !old)
                      }}
                    />
                    <span>Servo PWM</span>
                  </div>
                }
                value={missionItem.servoPWM}
                placeholder={missionItem.servoPWM}
                onChange={e => onChangeParam('servoPWM', e.target.value && tryParseFloat(e.target.value))}
                disabled={!hasServo}
              />
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  )
}

const InputWithLabel = ({ label, value, onChange, ...inputProps }) => {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-20 font-normal text-white">{label}</div>
      <input
        className="flex-1 h-8 w-full  rounded border border-[#4B4B99] p-2"
        type="text"
        value={value}
        onChange={onChange}
        {...inputProps}
      />
    </div>
  )
}

const SelectWithLabel = ({ label, value, onChange, options, ...props }) => {
  return (
    <div className="flex text-xs items-center justify-center">
      <span className="w-16 font-normal text-white">{label}</span>
      <select
        {...props}
        className="flex-1 h-8 w-full rounded border border-[#4B4B99]"
        value={value}
        onChange={onChange}>
        {options.map(option => (
          <option value={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}

const ButtonGroups = ({ subMode, setSubMode, items }) => {
  const { themeName } = useContext(SystemThemeContext)
  return (
    <div className="w-full flex space-x-1 justify-between rounded-md">
      {items.map(item => (
        <div key={item.value} className="flex-1">
          <input
            type="radio"
            name="subMode"
            id={item.value}
            className="peer hidden"
            checked={subMode === item.value}
            onChange={() => {
              setSubMode(item.value)
            }}
          />
          <label
            htmlFor={item.value}
            className={`flex flex-center w-full text-white 
            cursor-pointer select-none p-1 h-12 rounded-md text-center bg-[#1D1D41] text-xl ${themeName === 'tft' ? 'bg-[#1F42A9]' : ''} )
            }]' }`}>
            {item.title}
          </label>
        </div>
      ))}
    </div>
  )
}

const mavCmdList = [
  'MAV_CMD_NAV_WAYPOINT',
  'MAV_CMD_NAV_RETURN_TO_LAUNCH',
  'MAV_CMD_NAV_TAKEOFF',
  'MAV_CMD_NAV_LAND',
  'MAV_CMD_NAV_LOITER_UNLIM',
  'MAV_CMD_NAV_LOITER_TURNS',
  'MAV_CMD_NAV_LOITER_TIME',
  'MAV_CMD_NAV_SPLINE_WAYPOINT',
  'MAV_CMD_NAV_GUIDED_ENABLE',
  'MAV_CMD_DO_JUMP',
  'MAV_CMD_MISSION_START',
  'MAV_CMD_COMPONENT_ARM_DISARM',
  'MAV_CMD_CONDITION_DELAY',
  'MAV_CMD_CONDITION_DISTANCE',
  'MAV_CMD_CONDITION_YAW',
  'MAV_CMD_DO_CHANGE_SPEED',
  'MAV_CMD_DO_SET_HOME',
  'MAV_CMD_DO_SET_SERVO',
  'MAV_CMD_DO_SET_RELAY',
  'MAV_CMD_DO_REPEAT_SERVO',
  'MAV_CMD_DO_REPEAT_RELAY',
  'MAV_CMD_DO_DIGICAM_CONFIGURE',
  'MAV_CMD_DO_DIGICAM_CONTROL',
  'MAV_CMD_DO_SET_CAM_TRIGG_DIST',
  'MAV_CMD_DO_SET_ROI',
  'MAV_CMD_DO_MOUNT_CONTROL',
  'MAV_CMD_DO_PARACHUTE',
  'MAV_CMD_DO_GRIPPER',
  'MAV_CMD_DO_GUIDED_LIMITS',
  'MAV_CMD_DO_SET_RESUME_DIST',
  'MAV_CMD_DO_FENCE_ENABLE',
  'MAV_CMD_STORAGE_FORMAT',
]

const tryParseFloat = str => {
  return !isNaN(str) && !!str && !str.endsWith('.') ? parseFloat(str) : str
}
