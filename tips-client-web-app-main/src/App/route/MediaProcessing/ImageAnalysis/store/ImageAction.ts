import { ImageState } from './ImageState'

export type ImageAction = {
  setMaskImage: (maskImage: ImageState['maskImage']) => void
  setIsProcessingImage: (isProcessingImage : ImageState['isProcessingImage']) => void
  setIsMaskingImage: (isMaskingImage : ImageState['isMaskingImage']) => void
  setIsUnmaskingImage: (isUnmaskingImage : ImageState['isUnmaskingImage']) => void
  setPageNumber: (pageNumber: ImageState['pageNumber']) => void
  setMaxPageNumber: (maxPageNumber: ImageState['maxPageNumber']) => void
  setSelectedImage: (selectedImage: ImageState['selectedImage']) => void
  setProcessedImage: (processedImage: ImageState['processedImage']) => void
  setMaskingImage: (maskingImage: ImageState['maskingImage']) => void
  setUnmaskingImage: (unmaskingImage: ImageState['unmaskingImage']) => void


  onProcessImage: () => void
  onSelectImage: (relativeName: string) => void
  onMaskingImage: (imageName: string) => void
  onUnmaskingImage: (imageName: string) => void

  updateImageByPage: (imageByPage: ImageState['imageByPage']) => void
  updateFolderList: (folderList: ImageState['folderList']) => void
  updateCurrentDataset: (currentDataset: ImageState['currentDataset']) => void
  onLoadImageDatasetList: () => void

}