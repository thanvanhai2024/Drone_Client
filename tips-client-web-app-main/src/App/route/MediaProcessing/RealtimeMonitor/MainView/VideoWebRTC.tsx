import React, { useEffect, useRef } from 'react'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'

interface VideoUrl {
  processUrl: string
}

const VideoWebRTC = ({ processUrl }: VideoUrl) => {

  const videoPlayerRef = useRef<HTMLVideoElement>(null!)

  let uuid = '47a9e14b-fbeb-4a71-bc8f-630f369c5046'
  let channel = 0

  let webrtc: RTCPeerConnection

  let webrtcSendChannel: any
  let mediaStream: MediaStream


  async function startPlay() {
    mediaStream = new MediaStream()
    if (videoPlayerRef.current) {
      videoPlayerRef.current.srcObject = mediaStream
    }

    webrtc = new RTCPeerConnection({
      iceServers: [{
        urls: ['stun:0.0.0.0:8189']
      }],
      // sdpSemantics: 'unified-plan'
    })
    webrtc.onnegotiationneeded = handleNegotiationNeeded
    webrtc.onsignalingstatechange = signalingstatechange

    webrtc.ontrack = ontrack

    let offer = await webrtc.createOffer({
      //iceRestart:true,
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    await webrtc.setLocalDescription(offer)
  }

  function ontrack(event: any) {
    console.log(event.streams.length + ' track is delivered')
    mediaStream.addTrack(event.track)
  }

  async function signalingstatechange() {

    switch (webrtc.signalingState) {
        case 'have-local-offer':
          console.log('have-local-offer')
          let url = 'http://0.0.0.0:8889/mystream'
          axiosCredentials.post(url, {
            data: btoa(webrtc.localDescription!.sdp)
          }, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
          }).then((response: any) => {
            console.log(response)
            try {
              webrtc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: atob(response.data)
              }))
              console.log(webrtc)
            } catch (e) {
              console.warn(e)
            }

          })
          break
        case 'stable':

          // There is no ongoing exchange of offer and answer underway.
          // This may mean that the RTCPeerConnection object is new, in which case both the localDescription and remoteDescription are null;
          // it may also mean that negotiation is complete and a connection has been established.

          break
        case 'closed':
          break

        default:
          console.log(`unhandled signalingState is ${webrtc.signalingState}`)
          break
    }
  }

  async function handleNegotiationNeeded() {
    console.log('handleNegotiationNeeded')
    let url = 'http://192.168.3.8:8083/stream/' + uuid + '/channel/' + channel + '/webrtc?uuid=' + uuid + '&channel=' + channel
    let offer = await webrtc.createOffer()

    await webrtc.setLocalDescription(offer)
    axiosCredentials.post(url, {
      data: btoa(webrtc.localDescription!.sdp)
    }, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    }).then((response: any) => {
      try {

        webrtc.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: atob(response)
        }))
      } catch (e) {
        console.warn(e)
      }

    })
  }

  // useEffect(() => {
  //   startPlay()
  // }, [startPlay])

  return <div className="h-full w-full">
    {/*<iframe src="http://0.0.0.0:8889/mystream" scrolling="no"></iframe>*/}
    <iframe src={processUrl} height="100%" width="100%" scrolling="no"></iframe>
    {/*<video ref={videoPlayerRef} id="videoPlayer" autoPlay controls muted playsInline></video>*/}
  </div>
}


export default VideoWebRTC