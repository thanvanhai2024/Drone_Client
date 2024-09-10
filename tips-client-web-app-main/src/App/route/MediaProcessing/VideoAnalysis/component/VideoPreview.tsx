import * as React from 'react'
import styled from 'styled-components'
import { memo, useEffect, useRef, useState } from 'react'
import { MEDIA_SERVICE_URL } from '../../../common/path'


interface IPreviewVideo {
  videoRelativePath: string,
}

const VideoPreview = ({ videoRelativePath }: IPreviewVideo) => {
  const videoRef = useRef<any>()
  const [hash, setHash] = useState<any>()

  useEffect(() => {
    if(videoRelativePath) {
      setHash(Date.now())
      videoRef.current?.load()
    }
  }, [videoRelativePath])

  return (
    <PreviewVideoDiv className={'col-span-1'}>
      <Video className="preview-video" ref={videoRef} controls muted >
        <source src={`${MEDIA_SERVICE_URL}/resources/videos/${videoRelativePath}?${hash}`} type="video/mp4"/>
          Your browser does not support the video tag.
      </Video>
    </PreviewVideoDiv>
  )
}

const PreviewVideoDiv = styled.div`
  display: grid;
  justify-items: center;
`

const Video = styled.video`
  width: 100%;
`


export default VideoPreview
