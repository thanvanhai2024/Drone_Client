import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IStreamInfo } from './index'
import { STREAM_SERVICE_URL } from '../../common/path'
import { buildError } from '../../common/ErrorMessage'
import { useStreamStore } from './store/StreamStore'
import { shallow } from 'zustand/shallow'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'


interface IStreamModal {
  isShow: boolean,
  setIsShow: (x: boolean) => void,
  onAddNewStream: (name: string, rtspInput: string, rtspOutput: string, streamUrl: string) => void,
  onUpdateStream: (id: number, name: string, rtspInput: string, rtspOutput: string, streamUrl: string) => void,
  editData?: IStreamInfo
}

const StreamModal = ({ isShow, setIsShow, onAddNewStream, onUpdateStream, editData }: IStreamModal) => {

  const [name, setName] = useState<string>('')
  const [rtspInput, setRtspInput] = useState<string>('')
  const [rtspOutput, setRtspOutput] = useState<string>('')
  const [streamOutput, setStreamOutput] = useState<string>('')


  const handleClose = () => setIsShow(false)


  const [
    onLoadStreamList,
  ] = useStreamStore(
    (state) => [
      state.onLoadStreamList,
    ],
    shallow
  )

  useEffect(() => {
    console.log(editData)
    if (editData) {
      setName(editData.name)
      setRtspInput(editData.rtspInput)
      setRtspOutput(editData.rtspOutput)
      setStreamOutput(editData.streamOutput)
    } else {
      setName('')
      setRtspInput('')
      setRtspOutput('')
      setStreamOutput('')
    }
  }, [editData])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New Stream</DialogTitle>
        <DialogDescription>
        </DialogDescription>

      </DialogHeader>

      <div>Name</div>
      <Input type="text" placeholder="Name" value={name} onChange={
        (event) => setName(event.currentTarget.value)}/>

      <div>Rtsp Input</div>
      <Input type="text" placeholder="Rtsp Input" value={rtspInput} onChange={
        (event) => setRtspInput(event.currentTarget.value)}/>

      <div>AI Masking Server Rtsp Output</div>
      <Input type="text" placeholder="Rtsp Output" value={rtspOutput} onChange={
        (event) => setRtspOutput(event.currentTarget.value)}/>

      <div>AI Masking Server Stream Output</div>
      <Input type="text" placeholder="Stream Output" value={streamOutput} onChange={
        (event) => setStreamOutput(event.currentTarget.value)}/>


      {editData !== undefined ?
        <Button variant="primary" onClick={() => {
          onUpdateStream(editData?.id, name, rtspInput, rtspOutput, streamOutput)
          handleClose()
        }}>
          Update Stream
        </Button> :
        <Button variant="primary" onClick={() => {
          onAddNewStream(name, rtspInput, rtspOutput, streamOutput)
          handleClose()
        }}>
          Add Stream
        </Button>
      }
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </DialogContent>
  )
}

export default StreamModal
