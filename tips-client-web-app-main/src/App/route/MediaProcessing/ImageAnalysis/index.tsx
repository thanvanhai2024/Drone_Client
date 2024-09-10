import * as React from 'react'

import './ImageAnalysis.scss'
import ImageLeftSide from './component/ImageLeftSide'
import MemoImagePreview from './MainView/ImagePreview'
import HeaderAction from './MainView/HeaderAction'
import ImageComponent from './MainView/ImageComponent'
import { useImageStore } from './store/ImageStore'
import { shallow } from 'zustand/shallow'
import { SystemThemeContext } from '../../AppWrapper'
import { useState } from 'react'

export interface DatasetPage {
  imageList: string[],
  numberOfPage: number,
  pageNumber: number
}

const ImageAnalysis = () => {

  const [
    imageByPage,
    selectedImage,
    isProcessingImage,
    isMaskingImage,
    isUnmaskingImage,
    processedImage,
    maskingImage,
    unmaskingImage,

    onSelectImage,

  ] = useImageStore(
    (state) => [
      state.imageByPage,
      state.selectedImage,
      state.isProcessingImage,
      state.isMaskingImage,
      state.isUnmaskingImage,
      state.processedImage,
      state.maskingImage,
      state.unmaskingImage,
      state.onSelectImage,
    ],
    shallow
  )
  const [open, setOpen] = useState(false)

  return (
    <div className="image-main-grid w-full h-full grid gap-2">
      <div className={'image-left-side component-background'}>
        <ImageLeftSide/>
      </div>
      <div className="image-list-side component-background">
        <div className=" main-full-height  p-2">
          <div className="grid grid-cols-1 gap-2">
            {imageByPage.imageList &&
              imageByPage.imageList.map((image, index) => (
                <div key={index}>
                  <MemoImagePreview
                    onSelectImage={onSelectImage}
                    currentImage={selectedImage}
                    imageName={image}></MemoImagePreview>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="image-header-action component-background">
        <HeaderAction buttonOpen={open} setButtonOpen={setOpen} />
      </div>
      <div className={`image-main-view component-background overflow-auto ${open ? 'image-main-view-open' : 'image-main-view-close'}`}>
        <div className="center-wrapper-grid p-2 gap-2">
          <div className='h-full w-full'>
            <div className=''>
              {selectedImage && <ImageComponent isLoading={false} imageName={selectedImage}></ImageComponent>}
            </div>
            <div className={'flex-center  mt-3'}>{selectedImage}&nbsp;-&nbsp;Original</div>
          </div>
          <div className='h-full w-full'>
            <ImageComponent isLoading={isProcessingImage} imageName={processedImage}></ImageComponent>
            <div className={'flex-center  mt-3'}>{processedImage}&nbsp;-&nbsp;Object Detection</div>
          </div>
          <div className='h-full w-full'>
            <ImageComponent isLoading={isUnmaskingImage} imageName={unmaskingImage}></ImageComponent>
            <div className={'flex-center  mt-3'}>{unmaskingImage}&nbsp;-&nbsp;Unmasking</div>
          </div>
          <div className='h-full w-full'>
            <ImageComponent isLoading={isMaskingImage} imageName={maskingImage}></ImageComponent>
            <div className={'flex-center mt-3'}>
              <div className=''>{maskingImage}&nbsp;-&nbsp;Masking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageAnalysis
