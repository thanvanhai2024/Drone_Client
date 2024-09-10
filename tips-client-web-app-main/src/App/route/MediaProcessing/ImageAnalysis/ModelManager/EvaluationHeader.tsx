import * as React from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { ERROR } from '../../../common/Constants'
import LoadingMotion from '../../../common/LoadingMotion'
import { buildError } from '../../../common/ErrorMessage'
import { MEDIA_SERVICE_URL } from '../../../common/path'
import { Button } from '../../../../components/ui/button'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'



interface IEvaluationHeader {
  loadData: () => void
  isEvaluable: boolean
}

const EvaluationHeader = ({ loadData, isEvaluable }: IEvaluationHeader) => {

  const defaultEvalState = useMemo(() => ({
    precision: 0,
    recall: 0,
    mAP50: 0,
    IoU: 0,
  }), [])


  const [uploadedFile, setUploadedFile] = useState<any>(null)
  const [label, setLabel] = useState<any>('kisa_data')
  const [processLoading, setProcessLoading] = useState<boolean>(false)
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)

  const runEvaluateImage = () => {
    // setLoadingEval(true)
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/evaluate-image/`, {
      // dataset: selectedImage,
    })
      .then((response) => {
        let responseObj = response.data

        if (responseObj.status === 'success') {
          // setEvaluation(responseObj.data)
        }
        // setIsEvaluated(true)
        // setLoadingEval(false)
      }).catch(error => {
        toast(ERROR, { type: 'error' })
      })
  }

  const uploadEvaluationData = () => {
    setUploadLoading(true)
    let data: any = new FormData()
    data.append('file', uploadedFile, uploadedFile.name)
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/upload-label/`, data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    }).then((response) => {
      let responseObj = response.data
      setLabel(responseObj)
      setUploadLoading(false)
      loadData()
      toast('Upload Label Completed', { type: 'success' })
    }).catch(error => {
      setUploadLoading(false)
      buildError(error)
    })
  }

  const runEvaluationDataset = () => {
    setProcessLoading(true)
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/evaluate-image/`, {
      dataset: label,
    })
      .then((response) => {
        let responseObj = response.data

        // setEvaluation(responseObj)
        setProcessLoading(false)
        toast('Evaluation Completed', { type: 'success' })
      }).catch(error => {
        setProcessLoading(false)
        buildError(error)
      })
  }


  return (
    <div className=' ' >
      <div >
        <span>
          <label htmlFor="uploadLabel">
             등록
          </label>
          <input id="uploadLabel" type="file" name="myImage" onChange={(event: any) => {
            setUploadedFile(event.target.files[0])
          }}/>
          <Button disabled={uploadedFile === null} variant={'secondary'} onClick={() => uploadEvaluationData()}>평가 이미지 등록</Button>
        </span>
        {
          uploadLoading && <span className='ml-3'><LoadingMotion/> </span>
        }
      </div>
      <div>
        <span className='ml-1'>
          <Button disabled={!isEvaluable} variant={'secondary'} onClick={() => runEvaluationDataset()}>성능 평가</Button>
        </span>
        {
          processLoading && <span className='ml-3'><LoadingMotion/> </span>
        }
      </div>
    </div>
  )
}

export default EvaluationHeader
