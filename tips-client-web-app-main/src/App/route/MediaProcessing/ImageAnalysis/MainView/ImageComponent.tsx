import * as React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { MEDIA_SERVICE_URL } from '../../../common/path'
import noImage from '../../../../../resources/no-image.png'
import LoadingMotion from '../../../common/LoadingMotion'

interface IPreviewImage {
  isLoading: boolean,
  imageName: string,
  onImageLoad?: (isImageLoad: boolean) => void
}

const OutputImageDiv = styled.div`
    display: grid;
    justify-items: center;
    border-radius: 4px;
`

const MarkerImg = styled.img`
    width: auto;
    object-fit: contain;
    height: 300px;
    border-radius: 4px;
`

const ImageComponent = ({ isLoading, imageName, onImageLoad }: IPreviewImage) => {
  const [hash, setHash] = useState<any>()

  useEffect(() => {
    setHash(Date.now())
  }, [imageName])

  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = noImage
  }

  const onImageLoadInternal = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (!event.currentTarget.src.includes(noImage)) {
      if (onImageLoad) {
        onImageLoad(true)
      }
    }
  }

  return (
    isLoading ? <div className="flex-center h-80">
      <LoadingMotion/>
    </div> :
      <OutputImageDiv>
        <MarkerImg src={`${MEDIA_SERVICE_URL}/resources/images/${imageName}?${hash}`} alt="Image not available"
          onError={(event: any) => imageOnErrorHandler(event)}
          onLoad={(event: any) => onImageLoadInternal(event)}/>
      </OutputImageDiv>
  )
}

export default ImageComponent
