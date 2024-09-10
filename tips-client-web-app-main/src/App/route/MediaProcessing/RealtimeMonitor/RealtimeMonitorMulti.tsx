import React, { useContext, useEffect, useState } from 'react'

import './RealtimeMonitor.scss'
import VideoIFrame from './MainView/VideoIframe'
import { useStreamStore } from './store/StreamStore'
import { shallow } from 'zustand/shallow'
import { Button } from '../../../components/ui/button'

const RealtimeMonitorMulti = () => {
  const [streamFull, setStreamFull] = useState<string>('')
  const [isFull, setIsFull] = useState(false)

  const [
    listStream,
    onLoadStreamList,
  ] = useStreamStore(
    (state) => [
      state.listStream,

      state.onLoadStreamList,
    ],
    shallow
  )

  useEffect(() => {
    onLoadStreamList()
  }, [onLoadStreamList])

  const onChangeFull = (stream: string) => {
    setIsFull(true)
    setStreamFull(stream)
  }

  const onChangeList = () => {
    setIsFull(false)
    setStreamFull('')
  }

  return <>
    {
      isFull ?
        <div className={''}>
          <Button onClick={() => onChangeList()}> Close </Button>
          <VideoIFrame processUrl={streamFull}></VideoIFrame>
        </div>

        :
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
          {
            [...Array(9).keys()].map((index) => (
              <div className="realtime-stream-wrapper ">
                {
                  listStream[index] &&
                    <div className="">
                      <div className="p-2">{listStream[index].name}</div>

                      <div className="h-[200px]">
                        <VideoIFrame processUrl={listStream[index].streamOutput}></VideoIFrame>
                      </div>
                      <div className="p-2">
                        <Button onClick={() => onChangeFull(listStream[index].streamOutput)}> Full screen </Button>
                      </div>
                    </div>
                }
              </div>
            ))
          }
        </div>
    }
  </>
}

export default RealtimeMonitorMulti
