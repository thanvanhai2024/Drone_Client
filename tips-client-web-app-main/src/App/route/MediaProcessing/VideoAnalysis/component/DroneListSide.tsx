import React, { useEffect } from 'react'
import { MEDIA_SERVICE_URL, onConfirm } from '../../../common/path'
import { toast } from 'react-toastify'
import { buildError } from '../../../common/ErrorMessage'
import { shallow } from 'zustand/shallow'
import { useVideoStore } from '../store/VideoStore'
import { Button } from '../../../../components/ui/button'
import { axiosCredentials } from '../../../../Auth/AuthorizedRoute'
import SVG from '../../../../../resources/tft/BlurSVG.svg'


const DroneListSide = () => {

  const [
    droneList,
    selectedDrone,

    onLoadVideoList,
    onSelectVideo,
  ] = useVideoStore(
    (state) => [
      state.droneList,
      state.selectedDrone,

      state.onLoadVideoList,
      state.onSelectDrone,
    ], shallow )

  const deleteVideo = (name: string) => {
    axiosCredentials.post(`${MEDIA_SERVICE_URL}/delete-video-folder/`, {
      videoName: name,
    })
      .then(response => {
        onLoadVideoList()
        toast('Deleted Completed', { type: 'success' })
      })
      .catch(error => {
        buildError(error)
      })
  }

  useEffect(() => {
    onLoadVideoList()
  }, [onLoadVideoList])

  return (
    <>
      <div className='video-header-text'>
        영상 분석
      </div>
      <img className="vector-page vector-Blur" alt="vector" src={SVG}/>

      <div className='flex-center-center fw-bold mt-2'>Drone list</div>
      <div className="video-name-list mb-1 p-2">
        {droneList && droneList.map((droneObj, idx) => (
          <div key={idx} className="image-preview">
            <Button
              className={`button-select wrap-text w-4/5 ${selectedDrone === droneObj.droneName ? 'drone-video-active' : 'aaaa'}`}
              key={idx}
              title={droneObj.droneName}
              onClick={() => onSelectVideo(droneObj)}>
              {droneObj.droneName}
            </Button>
            <Button className="w-1/6 ml-1 delete-image-folder"
              onClick={() => onConfirm(deleteVideo, 'Confirm to delete?', droneObj.droneName)}>
              X
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}

export default DroneListSide
