import { create } from 'zustand'
import { toast } from 'react-toastify'
import axios from 'axios'
import { MEDIA_SERVICE_URL } from '../../../common/path'
import { buildError } from '../../../common/ErrorMessage'
import { ImageState } from './ImageState'
import { ImageAction } from './ImageAction'
import { useImageModelStore } from '../ModelManager/ModelManager'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'


export const useImageStore = create<ImageState & ImageAction>((set, get) => ({
  maskImage: '',
  setMaskImage: (maskImage) => set(() => ({ maskImage: maskImage })),
  isProcessingImage: false,
  setIsProcessingImage: (isProcessingImage) => set(() => ({ isProcessingImage: isProcessingImage })),
  isMaskingImage: false,
  setIsMaskingImage: (isMaskingImage) => set(() => ({ isMaskingImage: isMaskingImage })),
  isUnmaskingImage: false,
  setIsUnmaskingImage: (isUnmaskingImage) => set(() => ({ isUnmaskingImage: isUnmaskingImage })),
  pageNumber: 0,
  setPageNumber: (pageNumber) => set(() => ({ pageNumber: pageNumber })),
  maxPageNumber: 0,
  setMaxPageNumber: (maxPageNumber) => set(() => ({ maxPageNumber: maxPageNumber })),
  selectedImage: '',
  setSelectedImage: (selectedImage) => set(() => ({ selectedImage: selectedImage })),
  processedImage: '',
  setProcessedImage: (processedImage) => set(() => ({ processedImage: processedImage })),
  maskingImage: '',
  setMaskingImage: (maskingImage) => set(() => ({ maskingImage: maskingImage })),
  unmaskingImage: '',
  setUnmaskingImage: (unmaskingImage) => set(() => ({ unmaskingImage: unmaskingImage })),

  imageByPage: {
    imageList: [],
    numberOfPage: 0,
    pageNumber: 0
  },
  folderList: [],
  currentDataset: {
    folderName: '',
    fullPath: ''
  },

  onSelectImage: (relativeName: string) => {
    get().setSelectedImage(relativeName)
    relativeName = relativeName.substring(0, relativeName.lastIndexOf('.')) + '.png'
    get().setMaskingImage(relativeName.replace('raw', 'masking'))
    get().setProcessedImage(relativeName.replace('raw', 'processed'))
    get().setUnmaskingImage(relativeName.replace('raw', 'unmasking'))
  },

  onProcessImage: () => {
    get().setProcessedImage('')
    toast('Processing image...', { type: 'info' })
    if (get().selectedImage) {
      get().setIsProcessingImage(true)
      axiosCredentials.post(`${MEDIA_SERVICE_URL}/process-image/`, {
        imageName: get().selectedImage,
        datasetName: get().currentDataset?.folderName,
        weightName: useImageModelStore.getState().currentWeight,
        imageSize: useImageModelStore.getState().imageSize,
        confThreshold: useImageModelStore.getState().confThreshold,
        iouThreshold: useImageModelStore.getState().iouThreshold,
      })
        .then(response => {
          let responseObj = response.data
          get().setProcessedImage(responseObj.data)
          get().setIsProcessingImage(false)
          toast('Process image completed!', { type: 'success' })
        })
        .catch(error => {
          buildError(error)
        })
    } else {
      toast('Please Select Image For Object Detection', { type: 'error' })
    }
  },

  onMaskingImage: (imageName: string) => {
    get().setMaskImage('')
    get().setIsMaskingImage(true)
    if (imageName) {
      axiosCredentials.post(`${MEDIA_SERVICE_URL}/masking-image/`, {
        imageName: imageName,
        datasetName: get().currentDataset?.folderName,
        task: 'masking'
      })
        .then((response) => {
          let responseObj = response.data
          get().setMaskImage(responseObj.data)
          get().setIsMaskingImage(false)
          toast('Masking Image Completed', { type: 'success' })
        }).catch(error => {
          buildError(error)
        })
    }
  },

  onUnmaskingImage: (imageName: string) => {
    // get().setUnmaskImage('')
    get().setIsUnmaskingImage(true)
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/masking-image/`, {
      imageName: imageName,
      datasetName: get().currentDataset?.folderName,
      task: 'unmasking'
    })
      .then((response) => {
        let responseObj = response.data
        // get().setUnmaskImage(responseObj.data)
        get().setIsUnmaskingImage(false)
        toast('Masking Image Completed', { type: 'success' })
      }).catch(error => {
        buildError(error)
      })
  },


  updateImageByPage: (imageByPage) => set(() => ({ imageByPage: imageByPage })),
  updateFolderList: (folderList) => set(() => ({ folderList: folderList })),
  updateCurrentDataset: (currentDataset) => set(() => ({ currentDataset: currentDataset })),
  onLoadImageDatasetList: () => {
    axiosCredentials
      .get(`${MEDIA_SERVICE_URL}/list-dataset-folder/`)
      .then(response => {
        let responseObj = response.data
        get().updateFolderList(responseObj.data)
      })
      .catch(error => {
        buildError(error)
      })
  }

}))
