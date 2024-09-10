import React, { ChangeEvent, useContext, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { buildError } from '../../../common/ErrorMessage'
import { MEDIA_SERVICE_URL, onConfirm } from '../../../common/path'
import { IWeightInfo } from '../../../common/GlobalInterface'
import { create } from 'zustand'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'
import { SystemThemeContext } from '../../../AppWrapper'

interface IModelManager {
  weightList: IWeightInfo[]
  onLoadWeightList: () => void
}

type State = {
  imageSize: number
  confThreshold: number
  iouThreshold: number
  currentWeight: string
  weightList: IWeightInfo[]
}

type Action = {
  setImageSize: (imageSize: State['imageSize']) => void
  setConfThreshold: (confThreshold: State['confThreshold']) => void
  setIouThreshold: (iouThreshold: State['iouThreshold']) => void
  setCurrentWeight: (currentWeight: State['currentWeight']) => void
  setWeightList: (weightList: State['weightList']) => void

  onSelectDefaultWeight: (modelName: string) => void
  onLoadWeightList: () => void
  // onLoadDefaultWeight: () => void
}


export const useImageModelStore = create<State & Action>((set, get) => ({
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

  onSelectDefaultWeight: (weightName: string) => {
    get().setCurrentWeight(weightName)
  },

}))

const ModelManager = () => {
  const [uploadedModel, setUploadedModel] = useState<File[]>([])

  const [uploadedEvaluationFile, setUploadedEvaluationFile] = useState<File[]>([])

  const modelInputRef = useRef<HTMLInputElement>(null)

  const { themeName } = useContext(SystemThemeContext)

  const [
    imageSize,
    confThreshold,
    iouThreshold,
    weightList,

    setImageSize,
    setConfThreshold,
    setIouThreshold,
    onLoadWeightList,
  ] = useImageModelStore(
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

  const onUploadModel = () => {
    let data: any = new FormData()
    if (modelInputRef.current?.files?.length && modelInputRef.current?.files?.length > 0) {
      let files = modelInputRef.current?.files
      for (let i = 0; i < files.length; i++) {
        data.append('file', files.item(i), files.item(i)!.name)
        files.item(0)
      }

      axiosCredentials.post(`${MEDIA_SERVICE_URL}/upload-model/`, data, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
      }).then(response => {
        onLoadWeightList()

        let dataTransfer = new DataTransfer()
        modelInputRef.current!.files = dataTransfer.files

        toast('Upload Completed', { type: 'success' })
      }).catch(error => {
        buildError(error)
      })
    }
  }

  const onUploadEvaluationFile = async () => {
    let data: any = new FormData()

    Array.from(uploadedEvaluationFile).forEach((file, index) => {
      data.append('file', file, file.name)
    })
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/upload-evaluation-dataset/`,
      data,
      {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
      }).then(response => {
      onLoadWeightList()
      toast('Upload Completed', { type: 'success' })
    }).catch(error => {
      buildError(error)
    })
  }


  const onDeleteWeight = (model: string) => {
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/delete-media-weight/`, {
      weightName: model,
    }).then(response => {
      onLoadWeightList()
      toast('Update Completed', { type: 'success' })
    }).catch(error => {
      buildError(error)
    })
  }

  const [uploadLoading, setUploadLoading] = useState<boolean>(false)




  const onChangeModelFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length !== 0) {
      setUploadedModel([...event.target.files!])
    }

    setUploadedModel([...event.target.files!])

    // if (modelInputRef.current) {
    //   let dataTransfer = new DataTransfer()
    //   modelInputRef.current.files = dataTransfer.files
    // }
  }

  return (
    <div className="grid grid-cols-5 space-x-2 border-top mt-2">
      <div className="col-span-1 p-2">
        <div>
          <div className="text-xl mb-2">Upload Model</div>
          <div className="mb-3">
            <input ref={modelInputRef} type="file" onChange={onChangeModelFile} />
          </div>
          <Button className="w-full" disabled={uploadedModel.length === 0} onClick={onUploadModel}>등록</Button>
        </div>
        <div>
          <div className="text-xl mb-2">Model List</div>
          {
            weightList.map((model: IWeightInfo, index: number) => (
              <div key={index} className="mb-1">
                <Button className="button-select wrap-text w-4/5 ml-1" title={model.fileName}>
                  {model.fileName}
                </Button>
                <Button className="ml-1" onClick={() => onConfirm(onDeleteWeight, 'Confirm to delete?', model.fileName)}>
                  X
                </Button>
              </div>
            ))
          }
        </div>
      </div>
      <div className="col-span-2 p-2">
        {
          themeName === 'tips' &&
          <div>
            <div className="text-xl mb-2">Evaluation</div>
            <div className="mb-3">
              <input type="file" onChange={(event: any) => setUploadedEvaluationFile(event.target.files)}/>
            </div>
            <Button className="w-[200px]" disabled={uploadedEvaluationFile.length === 0}
              onClick={() => onUploadEvaluationFile()}>등록</Button>
          </div>
        }
      </div>

      <div className="col-span-2 p-2">
        <div className="text-xl mb-2">Select prediction parameters</div>
        <div className="grid grid-rows-3 gap-2 ">
          <div className="flex flex-row flex-center">
            <Label className='flex-1' htmlFor="image-size">Image size</Label>
            <Input className='flex-1' id="image-size" value={imageSize}
              onChange={(e) => setImageSize(parseInt(e.target.value))}/>
          </div>
          <div className="flex flex-row flex-center">
            <Label className='flex-1' htmlFor="conf-thres">Confidence Threshold</Label>
            <Input className='flex-1' id="conf-thres" value={confThreshold}
              onChange={(e) => setConfThreshold(parseFloat(e.target.value))}/>
          </div>
          <div className="flex flex-row flex-center">
            <Label className='flex-1' htmlFor="ios-thres">Intersection over Union (IoU) Threshold</Label>
            <Input className='flex-1' id="ios-thres" value={iouThreshold}
              onChange={(e) => setIouThreshold(parseFloat(e.target.value))}/>
          </div>
        </div>
      </div>

    </div>
  )

}

export default ModelManager
