import React, { useEffect, useRef } from 'react'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'

interface VideoUrl {
  processUrl: string
}

const VideoIFrame = ({ processUrl }: VideoUrl) => {
  return <div className="h-full w-full">
    <iframe title={processUrl} src={processUrl} height="100%" width="100%"></iframe>
  </div>
}


export default VideoIFrame
