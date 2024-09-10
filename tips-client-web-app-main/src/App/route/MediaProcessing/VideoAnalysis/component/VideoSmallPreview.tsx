import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { MEDIA_SERVICE_URL } from '../../../common/path'


interface IPreviewVideo {
  videoName: string,
}

const VideoSmallPreview = ({ videoName }: IPreviewVideo) => {
  const videoRef = useRef<any>()
  const [hash, setHash] = useState<any>()


  useEffect(() => {
    setHash(Date.now())
    videoRef.current?.load()
  }, [videoName])

  return (
    <PreviewVideoDiv className={'col-span-1'}>
      <Video ref={videoRef} controls muted preload={'none'}>
        <source src={`http://${MEDIA_SERVICE_URL}/resources/videos/${videoName}?${hash}`} type="video/mp4"/>
        Your browser does not support the video tag.
      </Video>
    </PreviewVideoDiv>
  )
}


const PreviewVideoDiv = styled.div`
  max-height: 500px;
  display: grid;
  justify-items: center;
`

const Video = styled.video`
  max-height: 500px;
  width: 100%;
  //height: 500px;
`

export default VideoSmallPreview
