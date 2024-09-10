import React, { useEffect, useState } from 'react'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { buildError } from '../common/ErrorMessage'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { ExternalLink } from 'lucide-react'
import { t } from 'i18next'
import { Position } from 'google-map-react'
import SvgVector from '../../../resources/tft/VectorShort.svg'

interface HeatMapProps {
  currentMonth: string
}

interface DroneResponseData {
  StartPoint: {
    lat: number;
    lng: number;
  };
}

const defaultCenter = {
  lat: 36.5040736,
  lng: 127.2494855
}

const defaultMapOptions = {
  center: defaultCenter,
  zoom: 7
}

export const HeatMapTFT: React.FC<HeatMapProps> = (props) => {

  const [droneData, setDroneData] = useState<Position[]>([])

  useEffect(() => {
    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/heatmap/`, {
      params: { 'date': props.currentMonth },
    })
      .then((response) => {
        const data = response.data.map((item: DroneResponseData) => {
          return item.StartPoint
        })
        setTimeout(() => {
          console.log(data)
          setDroneData(data)
        }, 1000)
      })
      .catch(error => {
        buildError(error)
      })
  }, [props.currentMonth])

  return (
    <div>
      <div className='mx-3 p-1 flex justify-between'>
        <div className='text-xl'>비행 히트맵</div>
        {/*<ExternalLink className='place-items-efnd'/>*/}
      </div>
      <img className="vector-dashboard vector-page vector-tft-cal" alt="vector" src={SvgVector}/>

      <img className="map-img" src="http://192.168.0.180:8686/management/static/media/map_bg_03.22021992601fa57c12ce89449a7d339e.svg"
        alt=""/>
    </div>
  )
}

export default HeatMapTFT
