import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { buildError } from '../../../common/ErrorMessage'
import { MEDIA_SERVICE_URL, onConfirm } from '../../../common/path'
import { IWeightInfo } from '../../../common/GlobalInterface'
import { create } from 'zustand'
import { Button } from '../../../../components/ui/button'
import { useImageModelStore } from '../../ImageAnalysis/ModelManager/ModelManager'
import { Label } from '../../../../components/ui/label'
import { Input } from '../../../../components/ui/input'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'

interface IModelManager {
  weightList: IWeightInfo[]
  loadWeightList: () => void
}

type State = {
  imageSize: number
  currentWeight: string
  iouThreshold: number
  confThreshold: number
  weightList: IWeightInfo[]
}

type Action = {
  setImageSize: (imageSize: State['imageSize']) => void
  setConfThreshold: (confThreshold: State['confThreshold']) => void
  setIouThreshold: (iouThreshold: State['iouThreshold']) => void
  setCurrentWeight: (currentWeight: State['currentWeight']) => void
  setWeightList: (weightList: State['weightList']) => void

  onSelectDefaultWeight: (weightFullPath: string) => void
  onLoadWeightList: () => void
  // onLoadDefaultWeight: () => void
}


export const useVideoModelStore = create<State & Action>((set, get) => ({
  imageSize: 640,
  setImageSize: (imageSize) => set(() => ({ imageSize: imageSize })),
  confThreshold: 0.25,
  setConfThreshold: (confThreshold) => set(() => ({ confThreshold: confThreshold })),
  iouThreshold: 0.45,
  setIouThreshold: (iouThreshold) => set(() => ({ iouThreshold: iouThreshold })),

  currentWeight: '',
  setCurrentWeight: (currentWeight) => set(() => ({ currentWeight: currentWeight })),
  weightList: [],
  setWeightList: (weightList) => set(() => ({ weightList: weightList })),


  onLoadWeightList: () => {
    axiosCredentials.get(`${MEDIA_SERVICE_URL}/list-all-media-weight/`)
      .then((response) => {
        let responseObj = response.data
        get().setWeightList(responseObj.data)
        if (responseObj.data.length > 0) {
          get().setCurrentWeight(responseObj.data[0].fileName)
        }
      }).catch(error => {
        buildError(error)
      })
  },

  // onLoadDefaultWeight: () => {
  //   axios.get(`${MEDIA_SERVICE_URL}/get-default-media-weight/`)
  //     .then((response) => {
  //       let response_obj = response.data
  //       debugger
  //       if (response_obj.data.name in get().weightList) {
  //         get().setCurrentWeight(response_obj.data.name)
  //       }
  //     }).catch(error => {
  //       buildError(error)
  //     })
  // },

  onSelectDefaultWeight: (weightName: string) => {
    get().setCurrentWeight(weightName)
    // axios
    //   .post(`${MEDIA_SERVICE_URL}/set-default-weight-for-media/`, {
    //     fileName: weightObject.fileName,
    //   })
    //   .then(response => {
    //
    //   })
    //   .catch(error => {
    //     buildError(error)
    //   })
  },

}))

const ModelManager = () => {
  const [uploadedFile, setUploadedFile] = useState<File[]>([])

  const [
    imageSize,
    confThreshold,
    iouThreshold,
    weightList,

    setImageSize,
    setConfThreshold,
    setIouThreshold,
    onLoadWeightList,
  ] = useVideoModelStore(
    (state) => [
      state.imageSize,
      state.confThreshold,
      state.iouThreshold,
      state.weightList,

      state.setImageSize,
      state.setConfThreshold,
      state.setIouThreshold,
      state.onLoadWeightList,
    ]
  )

  const uploadModel = () => {
    let data: any = new FormData()
    Array.from(uploadedFile).forEach((file, index) => {
      data.append('file', file, file.name)
    })
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/upload-model/`, data, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    })
      .then(response => {
        onLoadWeightList()
        toast('Upload Completed', { type: 'success' })
      })
      .catch(error => {
        buildError(error)
      })
  }

  const onDeleteWeight = (model: string) => {
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/delete-media-weight/`, {
      weightName: model,
    })
      .then(response => {
        onLoadWeightList()
        toast('Update Completed', { type: 'success' })
      })
      .catch(error => {
        buildError(error)
      })
  }


  return <div className="grid grid-cols-4 space-x-2 border-top mt-2">
    <div className="col-span-1 p-2">
      <h2>Upload Model</h2>
      <div className="mb-3">
        <label htmlFor="uploadImage">이미지 등록</label>
        <input
          id="uploadImage"
          type="file"
          name="myImage"
          multiple
          onChange={(event: any) => {
            setUploadedFile(event.target.files)
          }}
        />
      </div>
      <Button className="w-full" disabled={uploadedFile.length === 0}
        onClick={() => uploadModel()}>
        이미지 등록
      </Button>
    </div>
    <div className="col-span-2">
      <h4>Select prediction parameters</h4>
      <div className="grid grid-cols-3 space-x-2">
        <div>
          <Label htmlFor="image-size">Image size</Label>
          <Input id="image-size" value={imageSize} onChange={(e) => setImageSize(parseInt(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="conf-thres">Confidence Threshold</Label>
          <Input id="conf-thres" value={confThreshold} onChange={(e) => setConfThreshold(parseFloat(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="ios-thres">Intersection over Union (IoU) Threshold</Label>
          <Input id="ios-thres" value={iouThreshold} onChange={(e) => setIouThreshold(parseFloat(e.target.value))} />
        </div>
      </div>
    </div>
    <div className="col-span-1 p-2">
      <h2>Model List</h2>
      {
        weightList && weightList.map((model: IWeightInfo, index: number) => (
          <div key={index} className="mb-1">
            <Button
              className="button-select wrap-text w-3/5 ml-1"
              title={model.fileName}>
              {model.fileName}
            </Button>
            <Button className="ml-1"
              onClick={() => onConfirm(onDeleteWeight, 'Confirm to delete?', model.fileName)}
            >
                  X
            </Button>
          </div>
        ))
      }
      <button></button>
    </div>
  </div>
}

export default ModelManager
