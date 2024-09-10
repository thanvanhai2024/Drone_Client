import * as React from 'react'
import styled from 'styled-components'
import { memo } from 'react'
import { MEDIA_SERVICE_URL } from '../../../common/path'

interface IPreviewImage {
  imageName: string,
  currentImage?: string
  onSelectImage?: (imageName: string) => void
}

const ImagePreview = ({ imageName, currentImage, onSelectImage }: IPreviewImage ) => {

  return (
    <PreviewImageDiv
      className={`${currentImage === imageName ? 'image-selected' : {} }`}
      onClick={() => onSelectImage ? onSelectImage(imageName) : null}>
      <MarkerImg src={`${MEDIA_SERVICE_URL}/resources/images/${imageName}`} alt="Image not available"/>
    </PreviewImageDiv>
  )
}

const PreviewImageDiv = styled.div`
  display: grid;
  justify-items: center;
  border-radius: 4px;
`

const MarkerImg = styled.img`
  width: auto;
  max-height: 500px;
  border-radius: 4px;
`

const MemoImagePreview = memo(ImagePreview)

export default MemoImagePreview
