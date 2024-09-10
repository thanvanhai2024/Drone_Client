import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullhorn, faTrashCan, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useSubscribe } from '../../common/useRxjs'

export const DroneLogger = () => {
  const [showLog, setShowLog] = useState(false)
  const [autoscroll, setAutoScroll] = useState(true)
  const [userscroll, setUserScroll] = useState(false)
  const [readMessageCount, setReadMessageCount] = useState(0)

  const { selectedDroneStateObservable, selectedDroneId, handleClearDroneSeverityLog } = useContext(SignalRContext)

  const [droneStateWithId] = useSubscribe(selectedDroneStateObservable)
  const droneState = droneStateWithId?.droneState

  const handleScroll = useCallback(e => {
    const element = e.target

    const { scrollTop, clientHeight, scrollHeight } = element
    const isScrolledToBottom = Math.abs(clientHeight + Math.round(scrollTop) - scrollHeight) <= 2

    if (isScrolledToBottom) {
      setAutoScroll(true)
      setUserScroll(false)
      console.log('autoscroll = true')
    } else {
      setAutoScroll(false)
      setUserScroll(true)
      console.log('autoscroll = false')
    }
    //console.log(`scrollTop 값 :${scrollTop}  clientHeight r값: ${clientHeight}  비교해야하는 값 :${scrollHeight} scrollTop + clientHeght = ${Math.round(scrollTop) + clientHeight}`)
  }, [])

  const hasErrorUnreadMessage = useMemo(
    () => droneState?.DroneLogger?.slice(readMessageCount).findIndex(log => log.severity <= 5) !== -1,
    [readMessageCount, droneState?.DroneLogger],
  )

  useEffect(() => {
    console.log(`autoscroll: ${autoscroll} userscroll: ${userscroll}`)
    let intervalId = null

    const scrollIntoView = () => {
      var elem = document.getElementById('drone-last-message')
      if (elem) {
        elem.scrollIntoView()
      }
    }

    if (autoscroll && !userscroll) {
      intervalId = setInterval(scrollIntoView, 1000)
    } else {
      clearInterval(intervalId)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [autoscroll, userscroll])

  return (
    <>
      <button
        className="w-[40px] h-[40px] border-none bg-white text-black faTriangleExclamation"
        onClick={() => {
          setShowLog(old => !old)
          setReadMessageCount((droneState?.DroneLogger || []).length)
        }}>
        <FontAwesomeIcon
          className="text-lg"
          icon={hasErrorUnreadMessage ? faTriangleExclamation : faBullhorn}
          style={{ opacity: readMessageCount === (droneState?.DroneLogger || []).length ? 0.5 : 1 }}
        />
      </button>

      {showLog ? (
        <div className="w-[400px] h-[300px] p-2 bg-white overflow-y-auto static" onScroll={handleScroll}>
          {(droneState?.DroneLogger || []).map((severityLog, index) => (
            <span key={index}>
              <span
                id={index === (droneState?.DroneLogger || []).length - 1 ? 'drone-last-message' : undefined}
                key={severityLog.time}
                className={
                  severityLog.severity < 4
                    ? 'text-red-600'
                    : severityLog.severity === 5
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }>
                {new Date(severityLog.time).toLocaleString()}: {severityLog.message.replace(/[^a-zA-Z0-9\s]/g, '')}
              </span>
              <br />
            </span>
          ))}
          <button
            className="absolute bottom-4 right-4"
            onClick={() => {
              handleClearDroneSeverityLog(selectedDroneId)
            }}>
            <FontAwesomeIcon className="text-lg" icon={faTrashCan} />
          </button>
        </div>
      ) : null}
    </>
  )
}
