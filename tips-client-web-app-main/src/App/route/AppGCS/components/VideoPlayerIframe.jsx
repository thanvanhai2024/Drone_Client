import React from 'react'

export const VideoPlayerIframe = (props) => {
  return <div className="flex flex-1">
    <iframe src={props.stream} height="100%" width="100%" title={'drone stream'}></iframe>
  </div>
}

