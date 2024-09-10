import React, { useContext, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { SidebarComponentDiv } from './RightPanelCommonComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClapperboard, faFastForward, faFastBackward } from '@fortawesome/free-solid-svg-icons'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { SystemThemeContext } from '../../AppWrapper'

export const RightPanelVideo = () => {
  const { themeName } = useContext(SystemThemeContext)
  const { handleGetDroneSavedVideos } = useContext(SignalRContext)
  const [speed, setSpeed] = useState(1)
  const [videos, setVideos] = useState(['test.mp4', 'test2.mp4'])
  const [selectedVideo, setSelectedVideo] = useState()

  useEffect(() => {
    const fetchDroneVideos = async () => {
      const droneVideos = await handleGetDroneSavedVideos()
      setVideos(
        droneVideos.map(droneVideo => {
          const pathTokens = droneVideo.split('/')
          const name = pathTokens[pathTokens.length - 1]
          const nameTokens = name.split('.')[0].split('_')

          return {
            name,
            url: `${process.env.REACT_APP_WEB_BASE_URL}/video/${pathTokens.slice(1).join('/')}`,
            camId: nameTokens[2],
            createdAt: new Date(parseInt(nameTokens[1]) * 1000),
          }
        }),
      )
    }
    fetchDroneVideos()
  }, [handleGetDroneSavedVideos])

  return (
    <SidebarComponentDiv className="mt-1 flex flex-col">
      <div className={`w-full flex flex-col space-x-1 rounded-xl p-1 pb-2 pt-2 flex-1 ${themeName ==='tft' ? 'bg-[#0F1A46] border border-[#152B71]' : 'bg-[#1D1D41]'}`}>
        <div className="text-white mb-2">Video</div>
        <div className="overflow-scroll-y">
          {videos.map(video => (
            <div
              onClick={() => setSelectedVideo(video)}
              className="flex w-full space-x-2 text-white align-center items-center text-md cursor-pointer">
              <FontAwesomeIcon icon={faClapperboard} />
              <span>{video.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`w-full flex flex-col space-x-1 rounded-xl p-1pb-2 pt-2 mt-4 flex-1 ${themeName ==='tft' ? 'bg-[#0F1A46] border border-[#152B71]' : 'bg-[#1D1D41]'}`}>
        {selectedVideo ? (
          <div>
            <ReactPlayer playbackRate={speed} muted autoplay controls={true} width='w-100wh' url={selectedVideo.url} />
            <div className="flex space-x-2 mt-2 items-center justify-center">
              <FontAwesomeIcon
                icon={faFastBackward}
                onClick={() => speed > 1 && setSpeed(old => old / 2)}
                className="text-xl text-white"
              />
              <span className="text-xl text-white">{speed}X</span>
              <FontAwesomeIcon
                icon={faFastForward}
                onClick={() => speed <= 8 && setSpeed(old => old * 2)}
                className="text-xl text-white"
              />
            </div>
          </div>
        ) : null}
      </div>
    </SidebarComponentDiv>
  )
}
