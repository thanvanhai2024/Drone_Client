import { VideoState } from './VideoState'
import { IDroneVideoData } from '../../../common/GlobalInterface'

export type VideoAction = {
  setCurrentVideoList: (imageByPage: VideoState['currentVideoList']) => void
  setDroneList: (droneList: VideoState['droneList']) => void

  setMaskedVideo: (maskVideo: VideoState['maskedVideo']) => void
  setUnmaskedVideo: (unmaskedVideo: VideoState['unmaskedVideo']) => void
  setIsProcessingVideo: (isProcessingVideo : VideoState['isProcessingVideo']) => void
  setIsMaskingVideo: (isMaskingVideo : VideoState['isMaskingVideo']) => void
  setIsUnmaskingVideo: (isUnmaskingVideo : VideoState['isUnmaskingVideo']) => void
  setSelectedDrone: (selectedDrone : VideoState['selectedDrone']) => void

  setSelectedVideo: (selectedVideo: VideoState['selectedVideo']) => void
  setProcessedVideo: (processedVideo: VideoState['processedVideo']) => void

  onLoadVideoList: () => void
  onProcessVideo: (username: string) => void
  onSelectDrone: (videoObject: IDroneVideoData) => void
  onSelectVideo: (videoName: string) => void
  onMaskingVideo: (username: string, videoName: string) => void
  onUnmaskingVideo: (username: string, videoName: string) => void
}
