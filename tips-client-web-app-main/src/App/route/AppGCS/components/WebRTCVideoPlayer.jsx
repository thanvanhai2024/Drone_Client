import React, { useRef, useEffect, useState, useMemo } from 'react'
import qs from 'qs'
import axios from 'axios'

let config = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302'],
    },
  ],
}

export const WebRTCVideoPlayer = ({ url, onTrackingDrag, ...props }) => {
  const [pc, setPc] = useState()
  const [shouldRetry, setShouldRetry] = useState(false)
  const videoRef = useRef()
  const [startDrag, setStartDrag] = useState()

  const suuid = useMemo(
    () => encodeURIComponent(url.replace('rtsp://', '').replaceAll('/', '-').replaceAll(':', '_')),
    [url],
  )

  useEffect(() => {
    function getCodecInfo() {
      axios
        .get('http://127.0.0.1:8083/stream/codec/' + suuid)
        .then(({ data }) => {
          console.log(data)
          try {
            data.forEach(value => {
              pc.addTransceiver(value.Type, {
                direction: 'sendrecv',
              })
            })
          } catch (e) {
            console.log(e)
          }
        })
        .catch(async e => {
          if (e.response.status === 404) {
            axios
              .post('http://127.0.0.1:8083/stream', qs.stringify({ url }), {
                headers: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
              })
              .then(() => setShouldRetry(true))
          }
        })
    }

    if (!!pc) {
      if (shouldRetry) {
        console.log('Retrying')
      }
      getCodecInfo()
    }
  }, [pc, suuid, shouldRetry, url])

  useEffect(() => {
    const streamIns = new MediaStream()
    const pcIns = new RTCPeerConnection(config)
    setPc(pcIns)

    pcIns.onnegotiationneeded = handleNegotiationNeededEvent
    pcIns.ontrack = handleOnTrack
    pcIns.oniceconnectionstatechange = e => console.log(pcIns.iceConnectionState + ' ' + url)

    function handleOnTrack(event) {
      streamIns.addTrack(event.track)
      videoRef.current.srcObject = streamIns
      videoRef.current.autoplay = true
      videoRef.current.muted = true
      videoRef.current.className = 'w-full h-full'
      console.log(event.streams.length + ' track is delivered')
    }

    async function handleNegotiationNeededEvent() {
      const offer = await pcIns.createOffer()
      await pcIns.setLocalDescription(offer)
      getRemoteSdp()
    }

    function getRemoteSdp() {
      axios.post(
        'http://127.0.0.1:8083/stream/receiver/' + suuid,
        qs.stringify({
          suuid,
          data: btoa(pcIns.localDescription.sdp),
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      ).then(({ data }) => {
        try {
          pcIns.setRemoteDescription(
            new RTCSessionDescription({
              type: 'answer',
              sdp: atob(data),
            }),
          )
        } catch (e) {
          console.warn(e)
        }
      })
    }

    return () => {
      pcIns.onnegotiationneeded = null
      pcIns.ontrack = null
      pcIns.oniceconnectionstatechange = null
    }
  }, [suuid, url])

  return (
    <div {...props}>
      <div className="ratio ratio-16x9">
        <video
          onMouseDown={e => {
            const boundingRect = e.target.getBoundingClientRect()
            setStartDrag({ x: e.clientX - boundingRect.x, y: e.clientY - boundingRect.y })
          }}
          onMouseUp={e => {
            if (onTrackingDrag) {
              const boundingRect = e.target.getBoundingClientRect()
              onTrackingDrag({
                x: startDrag.x,
                y: startDrag.y,
                endX: e.clientX - boundingRect.x,
                endY: e.clientY - boundingRect.y,
                width: e.target.offsetWidth,
                height: e.target.offsetHeight,
              })
            }
          }}
          className="w-100vw h-100vh"
          ref={videoRef}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}

