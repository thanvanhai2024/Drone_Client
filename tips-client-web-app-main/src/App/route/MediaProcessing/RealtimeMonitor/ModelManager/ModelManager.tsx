import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { buildError } from '../../../common/ErrorMessage'
import { MEDIA_SERVICE_URL, onConfirm, STREAM_SERVICE_URL } from '../../../common/path'
import { IWeightInfo } from '../../../common/GlobalInterface'
import { create } from 'zustand'
import { Button } from '../../../../components/ui/button'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'

interface IModelManager {
  weightList: IWeightInfo[]
  loadWeightList: () => void
}

type State = {
  currentWeight: string
  weightList: IWeightInfo[]
}

type Action = {
  setCurrentWeight: (currentWeight: State['currentWeight']) => void
  setWeightList: (weightList: State['weightList']) => void

  onSelectDefaultWeight: (modelName: string) => void
  onLoadWeightList: () => void
  // onLoadDefaultWeight: () => void
}


export const useStreamWeightStore = create<State & Action>((set, get) => ({
  currentWeight: '',
  setCurrentWeight: (currentWeight) => set(() => ({ currentWeight: currentWeight })),
  weightList: [],
  setWeightList: (weightList) => set(() => ({ weightList: weightList })),


  onLoadWeightList: () => {
    axiosCredentials.get(`${STREAM_SERVICE_URL}/list-all-media-weight/`)
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

  onSelectDefaultWeight: (modelName: string) => {
    get().setCurrentWeight(modelName)
  },
}))

const ModelManager = ({ weightList, loadWeightList }: IModelManager) => {
  const [uploadedFile, setUploadedFile] = useState<File[]>([])

  const uploadModel = () => {
    let data: any = new FormData()
    Array.from(uploadedFile).forEach((file, index) => {
      data.append('file', file, file.name)
    })
    axiosCredentials.post(`${STREAM_SERVICE_URL}/upload-model/`, data, {
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    })
      .then(response => {
        loadWeightList()
        toast('Upload Completed', { type: 'success' })
      })
      .catch(error => {
        buildError(error)
      })
  }

  const onDeleteWeight = (model: string) => {
    axiosCredentials.post(`${STREAM_SERVICE_URL}/delete-media-weight/`, {
      weightName: model,
    })
      .then(response => {
        loadWeightList()
        toast('Update Completed', { type: 'success' })
      })
      .catch(error => {
        buildError(error)
      })
  }

  const [
    onLoadWeightList,
  ] = useStreamWeightStore(
    (state) => [
      state.onLoadWeightList,
    ]
  )
  useEffect(() => {
    onLoadWeightList()
  }, [onLoadWeightList])

  return <div className="grid grid-cols-4 space-x-2 border-top mt-2">
    <div className="col-span-1 p-2">
      <h2>Upload Model</h2>
      <div className="mb-3">
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
        등록
      </Button>
    </div>
    <div className="col-span-1">


    </div>
    <div className="col-span-2 p-2">
      <h2>Model List</h2>
      {weightList && weightList.map((model: IWeightInfo, index: number) => (
        <div key={index} className="mb-1">
          <Button
            className="button-select wrap-text w-3/5 ml-1"
            title={model.fileName}>
            {model.fileName}
          </Button>
          <Button className="ml-1"
            onClick={() => onConfirm(onDeleteWeight, 'Confirm to delete?', model.fileName)}
          >X </Button>
        </div>
      ))}
    </div>
  </div>
}

export default ModelManager
