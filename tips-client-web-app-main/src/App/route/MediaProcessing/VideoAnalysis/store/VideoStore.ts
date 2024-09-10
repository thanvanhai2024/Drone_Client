import { create } from 'zustand'
import { toast } from 'react-toastify'
import axios from 'axios'
import { buildError } from '../../../common/ErrorMessage'
import { VideoState } from './VideoState'
import { VideoAction } from './VideoAction'
import { useVideoModelStore } from '../component/ModelManager'
import { IDroneVideoData } from '../../../common/GlobalInterface'
import { MEDIA_SERVICE_URL } from '../../../common/path'
import { useImageModelStore } from '../../ImageAnalysis/ModelManager/ModelManager'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'


export const useVideoStore = create<VideoState & VideoAction>((set, get) => ({
  currentVideoList: [],
  setCurrentVideoList: (currentVideoList) => set(() => ({ currentVideoList: currentVideoList })),
  droneList: [],
  setDroneList: (droneList) => set(() => ({ droneList: droneList })),
  maskedVideo: '',
  setMaskedVideo: (maskedVideo) => set(() => ({ maskedVideo: maskedVideo })),
  unmaskedVideo: '',
  setUnmaskedVideo: (unmaskedVideo) => set(() => ({ unmaskedVideo: unmaskedVideo })),
  isProcessingVideo: false,
  setIsProcessingVideo: (isProcessingVideo) => set(() => ({ isProcessingVideo: isProcessingVideo })),
  isMaskingVideo: false,
  setIsMaskingVideo: (isMaskingVideo) => set(() => ({ isMaskingVideo: isMaskingVideo })),
  isUnmaskingVideo: false,
  setIsUnmaskingVideo: (isUnmaskingVideo) => set(() => ({ isUnmaskingVideo: isUnmaskingVideo })),
  selectedVideo: '',
  setSelectedVideo: (selectedVideo) => set(() => ({ selectedVideo: selectedVideo })),
  selectedDrone: '',
  setSelectedDrone: (selectedDrone) => set(() => ({ selectedDrone: selectedDrone })),
  processedVideo: '',
  setProcessedVideo: (processedVideo) => set(() => ({ processedVideo: processedVideo })),

  onLoadVideoList: () => {
    axiosCredentials.get(`${MEDIA_SERVICE_URL}/list-all-video/`)
      .then(response => {
        let responseObj = response.data

        if (responseObj.data && responseObj.data.length > 0) {
          get().setCurrentVideoList(responseObj.data[0].videoNameList)
          get().setDroneList(responseObj.data)
          // get().set
          get().onSelectDrone(responseObj.data[0])
        } else {
          toast('Folder empty!', { type: 'warning' })
        }
      })
      .catch(error => {
        console.log(error)
        buildError(error)
      })
  },

  onSelectDrone: (videoObject: IDroneVideoData) => {
    get().setSelectedDrone(videoObject.droneName)
    get().setCurrentVideoList(videoObject.videoNameList)

  },

  onSelectVideo: (videoName: string) => {
    console.log(videoName)
    get().setSelectedVideo(videoName)
    let processed = videoName.replace('raw', 'processed')
    get().setProcessedVideo(processed)
    let masked = videoName.replace('raw', 'masking')
    get().setMaskedVideo(masked)
    let unmasked = videoName.replace('raw', 'unmasking')
    get().setUnmaskedVideo(unmasked)
  },

  onProcessVideo: (username) => {
    get().setProcessedVideo('')
    // toast('Video analysis task is queued!', { type: 'info' })
    if (get().selectedVideo !== '') {
      get().setIsProcessingVideo(true)
      axiosCredentials.post(`${MEDIA_SERVICE_URL}/process-video/`, {
        username,
        videoName: get().selectedVideo,
        weightName: useVideoModelStore.getState().currentWeight,
        imageSize: useVideoModelStore.getState().imageSize,
        confThreshold: useVideoModelStore.getState().confThreshold,
        iouThreshold: useVideoModelStore.getState().iouThreshold,
      }).then(response => {
        let responseObj = response.data
        // get().setProcessedVideo(responseObj.data)
        toast(responseObj.message, { type: responseObj.type })
      }).catch(error => {
        buildError(error)
      }).finally(() => get().setIsProcessingVideo(false))
    } else {
      toast('Please Select Video For Object Detection', { type: 'error' })
    }
  },

  onMaskingVideo: (username, videoName: string) => {
    get().setIsMaskingVideo(true)
    get().setMaskedVideo('')
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/masking-video/`, {
      username,
      videoName: videoName,
      task: 'masking'
    })
      .then((response) => {
        let responseObj = response.data
        // get().setMaskedVideo(responseObj.data)
        toast(responseObj.message, { type: responseObj.type })
      }).catch(error => {
        buildError(error)
      })
      .finally(() => get().setIsMaskingVideo(false))
  },

  onUnmaskingVideo: (username, videoName: string) => {
    get().setIsUnmaskingVideo(true)
    get().setUnmaskedVideo('')
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/masking-video/`, {
      username,
      videoName: videoName,
      task: 'unmasking'
    })
      .then((response) => {
        let responseObj = response.data
        // get().setUnmaskedVideo(responseObj.data)
        toast(responseObj.message, { type: responseObj.type })
      }).catch(error => {
        buildError(error)
      })
      .finally(() => get().setIsUnmaskingVideo(false))
  },
}))
