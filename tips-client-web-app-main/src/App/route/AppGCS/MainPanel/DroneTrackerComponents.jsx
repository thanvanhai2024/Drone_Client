import React, { useContext, useMemo, useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import styles from '../components/DroneTrackerComponents.module.css'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { Slider, Box } from '@mui/material'
import newStyles from '../components/TSDroneTrackerComponents.module.css'
import { FaCaretDown, FaCaretLeft, FaCaretRight, FaCaretUp } from 'react-icons/fa6'
import { SystemThemeContext } from '../../AppWrapper'
import { useSubscribe } from '../../common/useRxjs'

export const DroneDirectionalControlBar = () => {
  const {
    handleSendManualControl,
    handleSendDroneFlightSpeedAlt,
    handleUpdateDroneFlightSpeedAlt,
    setFlightTakeoff,
    setFlightSpeed,
    FlightSpeed,
    FlightTakeoff,
  } = useContext(SignalRContext)

  const intervaltime = 250 //호출 시간 ms
  const intervalRef = useRef(null)
  const [showSetting, setShowsetting] = useState(false)
  const { themeName } = useContext(SystemThemeContext)
  const className = `flex flex-row ${themeName} `

  useEffect(() => {
    return () => StopPressBnt() // when App is unmounted we should stop counter
  }, [])

  const StopPressBnt = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function StartPressBnt(bnt, component) {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      handleSendManualControl(bnt, component)
      console.log(bnt, component)
    }, intervaltime)
  }
  return (
    <>
      <div className={className}>
        <div className={`relative ${newStyles.control_drone}`}>
          <div className={styles.set_button}>
            <button
              className={styles.btn_set}
              onClick={() => {
                handleUpdateDroneFlightSpeedAlt()
                setShowsetting(old => !old)
              }}>
              <FontAwesomeIcon
                icon={faGear}
                style={themeName === 'tft' ? { color: '#3064FE' } : { color: '#6359E9' }}
              />
            </button>
          </div>

          <div className={`flex justify-center ${newStyles.title}`}>
            <span
              className="border border-[#6359E9] rounded px-2 py-1 text-[#6359E9] text-xs"
              style={
                themeName === 'tft'
                  ? {
                      color: 'var(--Primary-p-1, #3064FE)',
                      border: '1px solid var(--Primary-p-1, #3064FE)',
                      background: 'var(--gb-dropbox-h, #142967)',
                    }
                  : {}
              }>
              드론 Left
            </span>
          </div>
          <div className="flex justify-center">
            <div className={`flex flex-col justify-center items-center ${newStyles.circle_out_drone}`}>
              <div className={`flex flex-row justify-center items-center ${newStyles.controllerCol}`}>
                <div
                  className={`flex flex-row z-30 text-2xl justify-center items-center shadow border-2 ${newStyles.circle_in_u}`}>
                  <button
                    className={newStyles.btn_top}
                    onMouseDown={() => StartPressBnt('up', 'drone')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretUp />
                  </button>
                </div>
                <div className={`flex justify-center text-2xl items-center shadow border-2 ${newStyles.circle_in_d}`}>
                  <button
                    className={newStyles.btn_left}
                    onMouseDown={() => StartPressBnt('left', 'drone')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretDown />
                  </button>
                </div>
              </div>
              <div className={newStyles.controllerRow}>
                <div className={`flex justify-center text-2xl items-center shadow border-2 ${newStyles.circle_in_r}`}>
                  <button
                    className={newStyles.btn_right}
                    onMouseDown={() => StartPressBnt('right', 'drone')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretRight />
                  </button>
                </div>
                <div className={`flex justify-center text-2xl items-center shadow border-2 ${newStyles.circle_in_l}`}>
                  <button
                    className={newStyles.btn_bottom}
                    onMouseDown={() => StartPressBnt('down', 'drone')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretLeft />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 제어 Right */}
        <div className={`shadow border-2 border-gray-600 ${newStyles.control_drone}`}>
          <div className={`flex justify-center ${newStyles.title}`}>
            <span
              className="border border-[#6359E9] text-[#6359E9] rounded px-2 py-1 text-xs"
              style={
                themeName === 'tft'
                  ? {
                      color: 'var(--Primary-p-1, #3064FE)',
                      border: '1px solid var(--Primary-p-1, #3064FE)',
                      background: 'var(--gb-dropbox-h, #142967)',
                    }
                  : {}
              }>
              제어 Right
            </span>
          </div>
          <div className="flex justify-center">
            <div className={`flex flex-col justify-center items-center ${newStyles.circle_out_camera}`}>
              <div className={`flex flex-row justify-center items-center ${newStyles.controllerCol}`}>
                <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_u}`}>
                  <button
                    className={`text-gray-400 text-2xl hover:text-white ${newStyles.btn_top}`}
                    onMouseDown={() => StartPressBnt('up', 'body')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretUp />
                  </button>
                </div>
                <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_d}`}>
                  <button
                    className={`text-gray-400 text-2xl hover:text-white ${newStyles.btn_bottom}`}
                    onMouseDown={() => StartPressBnt('down', 'body')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretDown />
                  </button>
                </div>
              </div>
              <div className={newStyles.controllerRow}>
                <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_r}`}>
                  <button
                    className={`text-gray-400 text-2xl hover:text-white ${newStyles.btn_right}`}
                    onMouseDown={() => StartPressBnt('right', 'body')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretRight />
                  </button>
                </div>
                <div className={`flex justify-center items-center shadow border-2 ${newStyles.circle_in_l}`}>
                  <button
                    className={`text-gray-400 text-2xl hover:text-white ${newStyles.btn_left}`}
                    onMouseDown={() => StartPressBnt('left', 'body')}
                    onMouseUp={StopPressBnt}
                    onClick={() => handleSendManualControl('stop', 'drone')}
                    onMouseLeave={StopPressBnt}>
                    <FaCaretLeft />
                  </button>
                </div>
              </div>
            </div>
            {showSetting ? (
              <div className={themeName !== 'tft' ? `${styles.flight_set}` : `${styles.flight_set_tft}`}>
                <div className={styles.title_slidar}> 드론 이륙 고도</div>
                <Box width={250}>
                  <div style={{ display: 'flex' }}>
                    {/*<div>SliderSliderSliderSlider</div>*/}
                    <Slider
                      className={styles.slidar_set}
                      size="medium"
                      defaultValue={FlightTakeoff}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      value={FlightTakeoff}
                      onChange={(event, FlightTakeoff) => {
                        setFlightTakeoff(FlightTakeoff)
                        handleSendDroneFlightSpeedAlt('manualTakeoffvar', FlightTakeoff)
                      }}
                    />

                    <div className="relative right-[-25px] bottom-[10px]">{FlightTakeoff}</div>
                  </div>
                </Box>
                <div className={styles.title_slidar}>드론 속도</div>

                <Box width={250}>
                  <div style={{ display: 'flex' }}>
                    <div>SliderSliderSliderSlider</div>

                    <Slider
                      className={styles.slidar_set}
                      size="medium"
                      max={400}
                      defaultValue={FlightSpeed}
                      aria-label="Small"
                      valueLabelDisplay="auto"
                      value={FlightSpeed}
                      onChange={(event, FlightSpeed) => {
                        setFlightSpeed(FlightSpeed)
                        handleSendDroneFlightSpeedAlt('manualSpeedvar', FlightSpeed)
                      }}
                    />
                    <div className="relative right-[-25px] bottom-[10px]">{FlightSpeed}</div>
                  </div>
                </Box>
              </div>
            ) : null}
          </div>
        </div>

        {/*/!* TODO: NEW CAMERA AREA*!/*/}
        {/*<div className={`shadow border-2 border-gray-600 ${newStyles.control_camera}`}>*/}
        {/*</div>*/}
      </div>
    </>
  )
}

export const FlightCommandButton = ({ children, ...props }) => {
  return (
    <div
      className={`${newStyles.control_btn} hover:bg-white  text-white font-semibold border border-gray-700 rounded-lg shadow text-md
        w-[75px] m-1`}>
      <button className="hover:bg-[#1d1d41] h-full w-full hover rounded-lg py-1.5 bg-btn-drone-monitor-page" {...props}>
        {children}
      </button>
    </div>
  )
}

export const FlightModeButtons = () => {
  const { selectedDroneStateObservable, handleSendDroneChangeFlightModeCommand } = useContext(SignalRContext)
  const [ds] = useSubscribe(selectedDroneStateObservable)
  const flightMode = ds?.droneState?.DroneRawState?.FLIGHT_MODE

  const { themeName } = useContext(SystemThemeContext)
  const className = `flex space-x-1 absolute top-3 left-60 z-10 ${themeName}`

  return (
    <div className={className}>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(3)} isActive={flightMode === 3}>
        Auto
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(0)} isActive={flightMode === 0}>
        Stablized
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(5)} isActive={flightMode === 5}>
        Loiter
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(16)} isActive={flightMode === 16}>
        PosHold
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(2)} isActive={flightMode === 2}>
        AltHold
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(4)} isActive={flightMode === 4}>
        Guided
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(17)} isActive={flightMode === 17}>
        Brake
      </FlightModeButton>
      <FlightModeButton onClick={() => handleSendDroneChangeFlightModeCommand(6)} isActive={flightMode === 6}>
        RTL
      </FlightModeButton>
    </div>
  )
}
export const FlightModeButton = ({ children, isActive, ...props }) => (
  <div className={`${newStyles.control_btn} rounded`}>
    <button
      className={`hover:bg-[#6359E9] w-full text-white font-semibold py-1 px-2 border border-gray-600 rounded shadow text-sm ${isActive ? 'btn-action-drone-monitor-active' : 'btn-action-drone-monitor'} 
      ${isActive ? 'bg-[#6359E9]' : ''}`}
      {...props}>
      {children}
    </button>
  </div>
)
