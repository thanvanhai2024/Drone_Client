import { useRef, useEffect, useState } from 'react'
import 'video.js/dist/video-js.css'
import videojs from 'video.js'

const VideoFeed: React.FC<VideoFeedProps> = ({ src }) => {
  const videoRef = useRef(null)
  const [player, setPlayer] = useState<ReturnType<typeof videojs>>()

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!player) {
      const videoElement = videoRef.current
      if (!videoElement) return

      setPlayer(
        videojs(videoElement, {}, () => {
          console.log('player is ready')
        })
      )
    }
  }, [player, videoRef])

  useEffect(() => {
    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [player])

  return (
    <div>
      <video className="video-js" ref={videoRef} controls>
        <source src={src} type="application/x-mpegURL" />
      </video>
    </div>
  )
}

interface VideoFeedProps {
  src: string;
}

export default VideoFeed