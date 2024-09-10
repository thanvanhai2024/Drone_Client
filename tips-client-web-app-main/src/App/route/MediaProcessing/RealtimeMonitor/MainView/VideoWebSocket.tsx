import React, { useCallback, useEffect, useRef } from 'react'


const VideoWebSocket = () => {

  const videoPlayerRef = useRef<HTMLVideoElement>(null!)

  let uuid = 'e38e66db-fcec-456e-b91a-2c5d9b518627'
  let channel = 0

  let mseQueue: any = []
  let mseSourceBuffer: any
  let mseStreamingStarted = false
  let videoSound = false

  const startPlay = useCallback(() => {
    let socketProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    let host = '0.0.0.0:8083'
    let url = `${socketProtocol}://${host}/stream/${uuid}/channel/${channel}/mse?uuid=${uuid}&channel=${channel}`
    let mse = new MediaSource()
    videoPlayerRef.current.src = window.URL.createObjectURL(mse)
    mse.addEventListener('sourceopen', function () {
      let ws = new WebSocket(url)
      ws.binaryType = 'arraybuffer'
      ws.onopen = function (event) {
        console.log('Connect to ws')
      }
      ws.onmessage = function (event) {
        let data = new Uint8Array(event.data)
        let mimeCodec
        let decoded_arr
        if (data[0] === 9) {
          decoded_arr = data.slice(1)
          if (window.TextDecoder) {
            mimeCodec = new TextDecoder('utf-8').decode(decoded_arr)
          } else {
            mimeCodec = Utf8ArrayToStr(decoded_arr)
          }
          if (mimeCodec.indexOf(',') > 0) {
            videoSound = true
          }
          mseSourceBuffer = mse.addSourceBuffer('video/mp4; codecs="' + mimeCodec + '"')
          mseSourceBuffer.mode = 'segments'
          mseSourceBuffer.addEventListener('updateend', pushPacket)

        } else {
          readPacket(event.data)
        }
      }
    }, false)
  }, [])


  function pushPacket() {
    if (!mseSourceBuffer.updating) {
      if (mseQueue.length > 0) {
        let packet = mseQueue.shift()
        mseSourceBuffer.appendBuffer(packet)
      } else {
        mseStreamingStarted = false
      }
    }
    if (videoPlayerRef.current.buffered.length > 0) {
      if (typeof document.hidden !== 'undefined' && document.hidden && !videoSound) {
        //no sound, browser paused video without sound in background
        videoPlayerRef.current.currentTime = videoPlayerRef.current.buffered.end((videoPlayerRef.current.buffered.length - 1)) - 0.5
      }
    }
  }

  function readPacket(packet: any) {
    if (!mseStreamingStarted) {
      mseSourceBuffer.appendBuffer(packet)
      mseStreamingStarted = true
      return
    }
    mseQueue.push(packet)
    if (!mseSourceBuffer.updating) {
      pushPacket()
    }
  }


  useEffect(() => {
    if (videoPlayerRef.current !== null) {
      startPlay()

      videoPlayerRef.current.addEventListener('loadeddata', () => {
        videoPlayerRef.current.play()
        // let browser: any = browserDetector()
        // if (!browser.safari) {
        //   // makePic()
        // }
      })
      //fix stalled video in safari
      videoPlayerRef.current.addEventListener('pause', () => {
        if (videoPlayerRef.current.currentTime > videoPlayerRef.current.buffered.end((videoPlayerRef.current.buffered.length - 1))) {
          videoPlayerRef.current.currentTime = videoPlayerRef.current.buffered.end((videoPlayerRef.current.buffered.length - 1)) - 0.1
          videoPlayerRef.current.play()
        }
      })

      videoPlayerRef.current.addEventListener('error', () => {
        console.log('video_error')
      })
    }
  }, [startPlay])

  return <div>
    <video ref={videoPlayerRef} id="videoPlayer" autoPlay controls muted playsInline></video>
  </div>
}


export default VideoWebSocket


