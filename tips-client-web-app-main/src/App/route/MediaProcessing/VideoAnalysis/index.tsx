import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DroneListSide from './component/DroneListSide'
import useUserStore from '../../../store'
import { useSubscription } from 'react-stomp-hooks'
import VideoPreview from './component/VideoPreview'

import { useVideoStore } from './store/VideoStore'
import { shallow } from 'zustand/shallow'
import LoadingMotion from '../../common/LoadingMotion'
import { MEDIA_SERVICE_URL, onConfirm } from '../../common/path'
import HeaderAction from './component/HeaderAction'
import { toast } from 'react-toastify'
import { TypeOptions } from 'react-toastify/dist/types'
import { WsMessageProps } from '../../../service/NotificationService'

import './VideoAnalysis.scss'
import { SystemThemeContext } from '../../AppWrapper'
import { Button } from '../../../components/ui/button'
import { axiosCredentials } from '../../../Auth/AuthorizedRoute'
import { buildError } from '../../common/ErrorMessage'

const VideoAnalysis = () => {
  const navigate = useNavigate()
  const userStore = useUserStore()

  const [uploadedVideo, setUploadedVideo] = useState<File[]>([])
  const [isRegisteringVideo, setIsRegisteringVideo] = useState<boolean>(false)


  const [
    videoList,
    maskedVideo,
    unmaskedVideo,
    processedVideo,
    selectedDrone,

    onLoadVideoList,
    setProcessedVideo,
    isProcessingVideo,
    isMaskingVideo,
    setMaskedVideo,
    isUnmaskingVideo,
    setUnmaskedVideo,
    onSelectVideo
  ] = useVideoStore(
    (state) => [
      state.currentVideoList,
      state.maskedVideo,
      state.unmaskedVideo,
      state.processedVideo,
      state.selectedDrone,

      state.onLoadVideoList,
      state.setProcessedVideo,
      state.isProcessingVideo,
      state.isMaskingVideo,
      state.setMaskedVideo,
      state.isUnmaskingVideo,
      state.setUnmaskedVideo,
      state.onSelectVideo
    ], shallow )

  const [message, setMessage] = useState<WsMessageProps>()
  const [open, setOpen] = useState(false)
  const { themeName } = React.useContext(SystemThemeContext)

  const [filter, setFilter] = useState('')
  const [filterList, setFilterList] = useState<string[]>()
  console.log(filterList)

  useEffect(() => {
    setFilterList(videoList)
  }, [videoList])

  const onChangeFilter = (value: string) => {
    setFilter(value)
    setFilterList(videoList.filter((video: string) => video.includes(value)))
  }

  useSubscription('/user/specific', (msg) => setMessage(JSON.parse(msg.body)))

  useEffect(() => {
    if (message) {
      if (message.resultType === 'success') {
        if (message.taskName === 'detection') {
          setProcessedVideo(message.data)
        } else if (message.taskName === 'masking') {
          setMaskedVideo(message.data)
        } else if (message.taskName === 'unmasking') {
          setUnmaskedVideo(message.data)
        }
      }
    }
    // TODO: check
  }, [message, setMaskedVideo, setProcessedVideo, setUnmaskedVideo])

  const uploadVideo = (selectedDrone: string) => {
    setIsRegisteringVideo(true)

    if (selectedDrone === '') {
      toast('Please select drone.', { type: 'info' })
    }

    let data: any = new FormData()
    Array.from(uploadedVideo).forEach((video, index) => {
      data.append('file', video, video.name)
    })

    const obj = {
      droneName: selectedDrone
    }
    const json = JSON.stringify(obj)
    const blob = new Blob([json], {
      type: 'application/json'
    })
    data.append('document', blob)


    axiosCredentials.post(`${MEDIA_SERVICE_URL}/upload-video/`, data, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    }).then(response => {
      onLoadVideoList()
      toast('Upload Video Completed', { type: 'success' })
    }).catch(error => {
      buildError(error)
    }).finally(() => setIsRegisteringVideo(false))
  }

  const onDeleteVideoFile = (videoPath: string) => {
    axiosCredentials.delete(`${MEDIA_SERVICE_URL}/delete-video-file/`, {
      data: { videoPath: videoPath },
    }).then(response => {
      onLoadVideoList()
      toast('Delete Video Completed', { type: 'success' })
    }).catch(error => {
      buildError(error)
    })

  }

  return (
    <div className="video-main-grid w-full h-full grid gap-2">
      <div className={`video-left-side component-background ${themeName}`}>
        <DroneListSide/>
      </div>
      <div className="video-list-side component-background ">
        <div className=" main-full-height p-2">
          <div className="p-2 border-bottom ">
            <label className="">
              <input id="uploadVideo" type="file" name="myVideo" multiple={true}
                onChange={(event: any) => {
                  setUploadedVideo(event.target.files)
                }}
                className='video-choose-button'
                hidden
              />
              <div className='content-upload '>
                <div className="content-upload-1">파일 선택</div>
                <div className='content-upload-2'>{uploadedVideo.length > 0 ? uploadedVideo[0].name : '선택한 파일 없음'}</div>
              </div>
            </label>
            <div className=''>
              <Button className='add-video-button' onClick={() => uploadVideo(selectedDrone)}>
                {isRegisteringVideo && <LoadingMotion/>}
                영상 등록
              </Button>
            </div>
          </div>
          <div className="flex-center mb-3">Video List for {selectedDrone}</div>

          <div className="mb-2">
            <input
              className={'rounded-lg md:w-[500px] md:h-[50px] p-2 text-black'}
              placeholder="Search video by time"
              onChange={event => onChangeFilter(event.target.value)}
              type={'text'}
              value={filter}
            />
          </div>
          <div className=" grid grid-cols-1 gap-2 ">
            {filterList && filterList.map((video, idx) =>
              <div className="" key={idx}>
                <VideoPreview videoRelativePath={`${video}`}></VideoPreview>
                <div className={'flex-center-between my-2 px-3'}>
                  <Button className='' onClick={() => onSelectVideo(video)}>
                    Select
                  </Button>
                  <div className={''}>{video}</div>
                  <Button className='' onClick={() => onConfirm(onDeleteVideoFile, 'Confirm to delete?', video)}>
                    X
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="video-header-action component-background">
        <HeaderAction buttonOpen={open} setButtonOpen={setOpen}/>
      </div>
      <div
        className={`video-main-view component-background overflow-auto ${open ? 'video-main-view-open' : 'video-main-view-close'}`}>
        <div className="">
          <div className='grid grid-cols-2 gap-4'>
            <div className='col-span-2'>
              {
                isProcessingVideo ?
                  <div className="flex-center h-80">
                    <LoadingMotion/>
                  </div> :
                  <VideoPreview videoRelativePath={processedVideo}></VideoPreview>
              }
            </div>
            <div className='col-span-1'>
              {
                isMaskingVideo ?
                  <div className="flex-center h-80">
                    <LoadingMotion/>
                  </div> :
                  <VideoPreview videoRelativePath={maskedVideo}></VideoPreview>
              }
            </div>
            <div className='col-span-1'>
              {
                isUnmaskingVideo ?
                  <div className="flex-center h-80">
                    <LoadingMotion/>
                  </div> :
                  <VideoPreview videoRelativePath={unmaskedVideo}></VideoPreview>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoAnalysis
