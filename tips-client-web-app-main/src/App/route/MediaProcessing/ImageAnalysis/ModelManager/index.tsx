import React, { useCallback, useEffect, useState } from 'react'
import EvaluationHeader from './EvaluationHeader'
import { MEDIA_SERVICE_URL } from '../../../common/path'
import { buildError } from '../../../common/ErrorMessage'
import { IFolderList } from '../component/ImageLeftSide'
import { useImageStore } from '../store/ImageStore'
import { Button } from '../../../../components/ui/button'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'


interface IEvaluation {
  precision: number
  recall: number
  mAP50: number
  IoU: number
}

interface ICompareFolder {
  predictedLabelFileOnly: string[],
  evaluationLabelFileOnly: string[]
}

const ModelManage = () => {
  const [compareFolder, setCompareFolder] = useState<ICompareFolder>()
  const [isEvaluable, setIsEvaluable] = useState<boolean>(false)


  const initEval = {
    precision: 0,
    recall: 0,
    mAP50: 0,
    IoU: 0,
  }

  const [evaluation, setEvaluation] = useState<IEvaluation>(initEval)

  const loadData = useCallback(() => {

  }, [])

  const [selectedFolder, setSelectedFolder] = useState<string>('')

  // const [folderList, updateCurrentDataset, loadDatasetList] = useImageStore(
  //   (state) => [
  //     state.folderList,
  //     state.updateCurrentDataset,
  //     state.onLoadImageDatasetList
  //   ],
  //   shallow
  // )

  const onSelectFirstPageDataset = useCallback((folder: IFolderList) => {
    // updateCurrentDataset(folder)
    setSelectedFolder(folder.folderName)
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/verify-evaluation-folder`, {
      datasetName: folder.folderName,
    }).then(response => {
      let responseObj = response.data
      setIsEvaluable(responseObj.data)
    }).catch(error => {
      buildError(error)
    })
  }, [])


  // useEffect(() => {
  //   loadDatasetList()
  // }, [loadDatasetList])

  return <div className="grid grid-cols-5 gap-2">
    <div className="col-span-1 flex component-background padding-10">
      <div className="mb-1 p-2 w-full">
        {/*{folderList && folderList.map((folder, index) => (*/}
        {/*  <div key={index} className="image-preview">*/}
        {/*    <Button*/}
        {/*      className="button-select wrap-text w-4/5"*/}
        {/*      onClick={() => {*/}
        {/*        onSelectFirstPageDataset(folder)*/}
        {/*      }}*/}
        {/*      title={folder.folderName}>*/}
        {/*      {folder.folderName}*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </div>

    <div className="col-span-4 flex component-background padding-10">
      <EvaluationHeader loadData={loadData} isEvaluable={isEvaluable}/>
    </div>

    <div className="col-span-5 flex component-background padding-10">

      <div className=' '>
        Precision: {`${evaluation?.precision.toFixed(2)} `}&nbsp;&nbsp;
        Recall: {`${evaluation?.recall.toFixed(2)} `}&nbsp;&nbsp;
        mAP<sub>50</sub>: {`${evaluation?.mAP50.toFixed(2)} `}&nbsp;&nbsp;
        IoU: {`${evaluation?.IoU.toFixed(2)}`}&nbsp;&nbsp;
      </div>
    </div>
  </div>
}

export default ModelManage
