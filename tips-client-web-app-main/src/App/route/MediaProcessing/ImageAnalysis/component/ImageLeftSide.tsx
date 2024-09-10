import React, { useCallback, useEffect, useRef, useState,useContext } from 'react'
import { toast } from 'react-toastify'
import { buildError } from '../../../common/ErrorMessage'
import { MEDIA_SERVICE_URL, onConfirm } from '../../../common/path'
import { shallow } from 'zustand/shallow'
import { useImageStore } from '../store/ImageStore'
import { Button } from '../../../../components/ui/button'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../../../AppWrapper'
import SVG from '../../../../../resources/tft/BlurSVG.svg'


export interface IFolderList {
  folderName: string,
  fullPath: string
}

interface IImageList {
  folderList: IFolderList[]
  setFolderList: React.Dispatch<React.SetStateAction<IFolderList[]>>
  setCurrentDataset: React.Dispatch<React.SetStateAction<IFolderList | undefined>>
}

const ImageLeftSide = () => {

  const uploadImageRef = useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = useState<File[]>([])
  const [imageLoading, setImageLoading] = useState<boolean>(false)

  const [
    folderList,
    updateCurrentDataset,
    updateImageByPage,
    loadDatasetList
  ] = useImageStore(
    (state) => [
      state.folderList,
      state.updateCurrentDataset,
      state.updateImageByPage,
      state.onLoadImageDatasetList],
    shallow
  )

  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const { themeName } = useContext(SystemThemeContext)

  const onDeleteImage = (imageName: string) => {
    axiosCredentials.delete(`${MEDIA_SERVICE_URL}/delete-dataset/`, {
      data: { datasetName: imageName },
    })
      .then(response => {
        loadDatasetList()
        toast('Delete Image Completed', { type: 'success' })
      })
      .catch(error => {
        buildError(error)
      })
  }


  const onSelectFirstPageDataset = useCallback((folder: IFolderList) => {
    updateCurrentDataset(folder)
    setSelectedFolder(folder.folderName)
    axiosCredentials.get(`${MEDIA_SERVICE_URL}/list-image-by-page/${folder.folderName}/0`)
      .then(response => {
        let responseObj = response.data
        updateImageByPage(responseObj.data)
      })
      .catch(error => {
        buildError(error)
      })
  }, [updateCurrentDataset, updateImageByPage])

  useEffect(() => {
    if (folderList.length) {
      onSelectFirstPageDataset(folderList[0])
    }
  }, [folderList, onSelectFirstPageDataset])


  useEffect(() => {
    loadDatasetList()
  }, [loadDatasetList])

  const uploadImage = () => {
    setImageLoading(true)
    let data: any = new FormData()
    Array.from(uploadedFile).forEach((file, index) => {
      data.append('file', file, file.name)
    })
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/upload-image/`, data, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    }).then(response => {
      loadDatasetList()
      setUploadedFile([])
      uploadImageRef!.current!.value = ''
      toast('Upload Completed', { type: 'success' })
    }).catch(error => {
      buildError(error)
    }).finally(() => {
      setImageLoading(false)
    })
  }

  return (
    <div className={ themeName }>
      <div className='image-header-text'>
          ‧ 이미지 분석
      </div>
      {
        themeName === 'tft' &&
        <img className="vector-page vector-Blur" alt="vector" src={SVG}/>
      }
      <div className="p-2 border-bottom">
        <label htmlFor="uploadImage">
          <input ref={uploadImageRef} className='input-file-select mt-2 mb-2' id="uploadImage" type="file"
            name="myImage" multiple title="test"
            onChange={(event: any) => setUploadedFile(event.target.files)} hidden/>
          <div className='content-upload'> 
            <div className="content-upload-1">파일 선택</div>
            <div className='content-upload-2'>{uploadedFile.length > 0 ? uploadedFile[0]?.name : '선택한 파일 없음'}</div>
          </div>       
        </label>

        <Button
          className='add-image-button'
          // className="mt-2 w-full"
          // disabled={uploadedFile.length === 0}
          onClick={() => uploadImage()}>
          이미지 등록
        </Button>
      </div>
      <div className='flex-center-center fw-bold mt-2'>Folder list</div>
      <div className="image-name-list mb-1 p-2">
        {folderList && folderList.map((folder, index) => (
          <div key={index} className="image-preview">
            <Button
              className="button-select wrap-text w-4/5"

              onClick={() => {
                onSelectFirstPageDataset(folder)
              }}
              title={folder.folderName}>
              {folder.folderName}
            </Button>
            <Button className="w-1/6 ml-1 delete-image-folder"
              onClick={() => onConfirm(onDeleteImage, 'Confirm to delete?', folder.folderName)}>
                  X
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageLeftSide
