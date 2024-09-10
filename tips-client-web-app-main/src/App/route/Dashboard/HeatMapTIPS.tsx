import React, { useEffect, useState } from 'react'
import GoogleMapReact, { Position } from 'google-map-react'
import SvgVector from '../../../resources/tft/VectorShort.svg'
import Map from '../../../resources/tips/map.png'
import { axiosCredentials } from '../../Auth/AuthorizedRoute'
import { BREAKDOWN_SERVICE_URL } from '../common/path'
import { buildError } from '../common/ErrorMessage'
import { ExternalLink } from 'lucide-react'


const tipsmapStyle = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#FFFFFF'
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#27264e'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#FFFFFF'
      }
    ]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#8c89b4'
      }
    ]
  },
  {
    'featureType': 'administrative.country',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#3e3d6d'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'administrative.locality',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#4b4b99'
      }
    ]
  },
  {
    'featureType': 'administrative.neighborhood',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#27264e'
      }
    ]
  },
  {
    'featureType': 'poi.business',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e6e6e6'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#1d1d41'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry.fill',
    'stylers': [
      {
        'color': '#f2f2f2'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#8a8a8a'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e6e6e6'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#d4d4d4'
      }
    ]
  },
  {
    'featureType': 'road.highway.controlled_access',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#c2c2c2'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#27264e'
      }
    ]
  },
  {
    'featureType': 'transit',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#27264e'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#1d1d41'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#27264e'
      }
    ]
  }
]




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
  // lat: 36.5040736,
  // lng: 127.2494855
  lat: 36.5,
  lng: 127.75
}

const defaultMapOptions = {
  center: defaultCenter,
  zoom: 8.5,
  restriction: {
    latLngBounds: {
      north: 38, // Northern limit
      south: 33, // Southern limit
      west: 124, // Western limit
      east: 132 // Eastern limit
    },
    strictBounds: true
  }
}

export const HeatMapGoogle:React.FC<HeatMapProps> = (props) =>{

  const [droneData, setDroneData] = useState<Position[]>([])


  useEffect(() => {

    axiosCredentials.get(`${BREAKDOWN_SERVICE_URL}/heatmap/`,
      {
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
    <div className={'p-2.5 pb-20'} style={{ height: '100vh', width: '100%' }}>
      <div className='flex justify-between'>
        <div className='dashboard-header-text'>비행 히트맵</div>
        <ExternalLink className='place-items-efnd'/>
      </div>
      <GoogleMapReact
        defaultZoom={defaultMapOptions.zoom}
        defaultCenter={defaultMapOptions.center}
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
          libraries: ['visualization'],
          language: 'ko',
          region: 'KR'
        }}
        heatmap={{ positions: droneData, options: { radius: 20, opacity: 1, } }}
        options={{ styles: tipsmapStyle }}
      >
      </GoogleMapReact>
    </div>
  )
}

export default HeatMapGoogle
