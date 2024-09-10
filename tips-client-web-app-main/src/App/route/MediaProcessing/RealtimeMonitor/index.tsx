import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { shallow } from 'zustand/shallow'
import { buildError } from '../../common/ErrorMessage'
import { STREAM_SERVICE_URL, STREAM_URL, onConfirm } from '../../common/path'
import MainView from './MainView'
import { useStreamStore } from './store/StreamStore'
import { Button } from '../../../components/ui/button'
import { FaEdit, FaUserEdit } from 'react-icons/fa'
import { FaTrash } from 'react-icons/fa6'

import './RealtimeMonitor.scss'
import DroneListSide from '../VideoAnalysis/component/DroneListSide'
import MemoizedVideoPreview from '../VideoAnalysis/component/VideoPreview'
import LoadingMotion from '../../common/LoadingMotion'
import VideoWebRTC from './MainView/VideoWebRTC'
import HeaderAction from './MainView/HeaderAction'
import VideoWebSocket from './MainView/VideoWebSocket'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog'
import StreamModal from './StreamModal'
import { SystemThemeContext } from '../../AppWrapper'
import VideoIFrame from './MainView/VideoIframe'

export interface IStreamInfo {
  id: number,
  name: string,
  rtspInput: string,
  rtspOutput: string,
  streamOutput: string,
}


const RealtimeMonitor = () => {

  const [editData, setEditData] = useState<IStreamInfo | undefined>()
  const [isShow, setIsShow] = useState(false)

  const [
    selectedName,
    streamUrl,
    listStream,

    onLoadStreamList,
    onSelectStream
  ] = useStreamStore(
    (state) => [
      state.selectedName,
      state.streamUrl,
      state.listStream,

      state.onLoadStreamList,
      state.onSelectStream
    ],
    shallow
  )
  const { themeName } = useContext(SystemThemeContext)
  const className=`stream-main-wrapper w-full h-full grid gap-2 ${themeName}`

  const onDeleteImage = (name: string, id: number) => {
    axiosCredentials.post(`${STREAM_URL}/delete-stream`, {
      id: id,
      name: name,
    }).then(response => {
      onLoadStreamList()
      toast('Delete Image Completed', { type: 'success' })
    }).catch(error => {
      buildError(error)
    })
  }

  // const onAddStream = () => {
  //   setIsShow(true)
  //   setEditData(undefined)
  // }

  useEffect(() => {
    onLoadStreamList()
    // setStream(true)
    return () => {
      // setStream(false)
    }
  }, [onLoadStreamList])

  const onEditStream = (stream: IStreamInfo) => {
    setEditData(stream)
  }

  const onAddStream = (name: string, rtspInput: string, rtspOutput: string, streamOutput: string) => {
    axiosCredentials.post(`${STREAM_URL}/add-stream`, {
      name: name,
      rtspInput: rtspInput,
      rtspOutput: rtspOutput,
      streamOutput: streamOutput
    }).then((response) => {
      toast('Add success', { type: 'success' })
      onLoadStreamList()
    }).catch(error => {
      buildError(error)
    })

  }

  const onUpdateStream = (id: number, name: string, rtspInput: string, rtspOutput: string, streamOutput: string) => {


    axiosCredentials.post(`${STREAM_URL}/update-stream`, {
      id: id,
      name: name,
      rtspInput: rtspInput,
      rtspOutput: rtspOutput,
      streamOutput: streamOutput,


    }).then((response) => {
      toast('Update success', { type: 'success' })
      onLoadStreamList()
    }).catch(error => {
      buildError(error)
    })
  }

  return (
    <Dialog>
      <div className={className}>
        <div className='real-time-left-side component-background'>
          <div></div>

          <div className="mb-1 p-2">
            <DialogTrigger className="mt-1 w-full">
              <Button className="w-full button-background" onClick={() => setEditData(undefined)} >
              드론 영상 추가
              </Button>
            </DialogTrigger>
          </div>

          <div className="mt-1 mb-1 p-2">
            {
              listStream?.length && listStream.map((stream, idx) => (
                <div key={idx} className="mb-1">
                  <Button className="button-select wrap-text w-3/5"
                    onClick={() => onSelectStream(stream)}
                    title={stream.name}>{stream.name}
                  </Button>
                  <DialogTrigger className="w-1/6 ml-1">
                    <Button className="button-select" onClick={() => onEditStream(stream)}>
                      <FaEdit />
                    </Button>
                  </DialogTrigger>
                  <Button className="button-select w-1/6 ml-1"
                    onClick={() => onConfirm(onDeleteImage, 'Confirm to delete?', stream.name, stream.id)}>
                    <FaTrash />
                  </Button>
                </div>
              ))
            }
          </div>
        </div>
        <div className='real-time-header-action component-background '>
          <HeaderAction/>
        </div>
        <div className='real-time-main-view component-background '>
          <div className='h-full w-full  flex-center mt-2'>
            <VideoIFrame processUrl={streamUrl}></VideoIFrame>
          </div>
        </div>
        {/*<div className='real-time-main-view'>*/}
        {/*  /!*<div className='col-span-1'>*!/*/}
        {/*  <MainView/>*/}
        {/*</div>*/}

        <StreamModal setIsShow={setIsShow} isShow={isShow} editData={editData}
          onAddNewStream={onAddStream} onUpdateStream={onUpdateStream}></StreamModal>
      </div>
    </Dialog>
  )
}

export default RealtimeMonitor
