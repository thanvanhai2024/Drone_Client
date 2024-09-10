import { DatasetPage } from '../index'
import { IFolderList } from '../component/ImageLeftSide'

export type ImageState = {

  imageByPage: DatasetPage
  folderList: IFolderList[]
  currentDataset: IFolderList

  maskImage: string

  isProcessingImage: boolean
  isMaskingImage: boolean
  isUnmaskingImage: boolean

  pageNumber: number
  maxPageNumber: number

  selectedImage: string
  processedImage: string
  maskingImage: string
  unmaskingImage: string



}
