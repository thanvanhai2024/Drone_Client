import React from 'react'
import VideoWebRTC from './VideoWebRTC'
import HeaderAction from './HeaderAction'


const MainView = ( ) => {
  return <div>
    <HeaderAction/>
    <div className="component-background main-view p-2">
      <div className='flex-center mt-2'>
        {/*<VideoWebRTC/>*/}
      </div>
    </div>

  </div>
}

export default MainView