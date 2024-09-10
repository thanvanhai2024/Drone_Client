import { IDroneVideoData } from '../../../common/GlobalInterface'

export type VideoState = {
  currentVideoList: string[]
  droneList: IDroneVideoData[]
  maskedVideo: string
  unmaskedVideo: string

  isProcessingVideo: boolean
  isMaskingVideo: boolean
  isUnmaskingVideo: boolean

  selectedVideo: string
  selectedDrone: string
  processedVideo: string
}
