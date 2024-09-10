import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

let baseAPIGatewayPath: string
if (process.env.REACT_APP_API_GATEWAY_PATH === undefined) {
  baseAPIGatewayPath = `${window.location.protocol}//${process.env.REACT_APP_API_GATEWAY || window.location.hostname}:${process.env.REACT_APP_API_GATEWAY_PORT || 8182}`
} else {
  baseAPIGatewayPath = `${window.location.protocol}//${process.env.REACT_APP_API_GATEWAY || window.location.hostname}:${process.env.REACT_APP_API_GATEWAY_PORT || 8182}/${process.env.REACT_APP_API_GATEWAY_PATH}`
}
export const MEDIA_SERVICE_URL = `${baseAPIGatewayPath}/${process.env.REACT_APP_IMAGE_VIDEO_SERVICE_NAME}`
export const STREAM_SERVICE_URL = `${baseAPIGatewayPath}/${process.env.REACT_APP_STREAM_SERVICE_NAME}`
export const BREAKDOWN_SERVICE_URL = `${baseAPIGatewayPath}/${process.env.REACT_APP_BREAKDOWN_SERVICE_NAME}`
export const AUTH_SERVICE_URL = `${baseAPIGatewayPath}/${process.env.REACT_APP_AUTH_SERVICE_NAME}`

export let baseGCSPath: string
if (process.env.REACT_APP_GCS_SERVER_URL === undefined) {
  baseGCSPath = `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_GCS_SERVER_PORT}`
} else {
  baseGCSPath = `${process.env.REACT_APP_GCS_SERVER_URL}:${process.env.REACT_APP_GCS_SERVER_PORT}`
}

export let aiStream: string = ''

if (process.env.REACT_APP_AI_STREAM_SERVICE_URL === undefined) {
  aiStream = `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_AI_STREAM_SERVICE_PORT}`
} else {
  aiStream = `${process.env.REACT_APP_AI_STREAM_SERVICE_URL}:${process.env.REACT_APP_AI_STREAM_SERVICE_PORT}`
}


export const STREAM_URL=`${aiStream}`




const wsBasePath = process.env.REACT_APP_API_GATEWAY_PATH === undefined ?
  `ws://${process.env.REACT_APP_API_GATEWAY || window.location.hostname}:${process.env.REACT_APP_API_GATEWAY_PORT || 8182}`
  :
  `ws://${process.env.REACT_APP_API_GATEWAY || window.location.hostname}:${process.env.REACT_APP_API_GATEWAY_PORT || 8182}/${process.env.REACT_APP_API_GATEWAY_PATH}`

export const AUTH_SERVICE_WEBSOCKET_URL = `${wsBasePath}/${process.env.REACT_APP_AUTH_SERVICE_NAME}`


export const onConfirm = ( callbackFunction: any, title: string, ...params: any) => {
  confirmAlert({
    title: title,
    message: 'Are you sure to do this.',
    buttons: [
      {
        label: 'Yes',
        onClick: () => callbackFunction(...params),
      },
      {
        label: 'No',
        onClick: () => {
        },
      },
    ],
  })

}
