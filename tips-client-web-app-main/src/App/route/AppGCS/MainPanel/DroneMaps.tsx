import React, { useContext, useEffect, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import GoogleMapReact, { MapOptions } from 'google-map-react'
import { SignalRContext } from '../DroneRealtime/SignalRContainer'
import { compareFloats, WaypointsContext } from '../WaypointsContext'
import { MissionContext } from '../components/MissionContext'
import droneImgBlue from '../../../../resources/blue.png'
import droneImgRed from '../../../../resources/red.png'
import { SystemThemeContext } from '../../AppWrapper'
import MarkerAnnotation from './MarkerAnnotation'
import { useSubscribe } from '../../common/useRxjs'

const createMapOptions = (): MapOptions => ({
  mapTypeControl: true,
  mapTypeId: 'hybrid',
  rotateControl: false,
  scaleControl: true,
  gestureHandling: 'greedy',
  // overviewMapControl: true,
  streetViewControl: true,
})

export const DroneMaps = ({ updateWaypoints, onClick, onChildClick }: any) => {
  const [standardMap, setStandardMap] = useState(false)
  const [mapApiLoaded, setMapApiLoaded] = useState(false)
  const [heading, setHeading] = useState(0)
  const [zoom, setZoom] = useState(15)
  const [mapTypeId, setmapTypeId] = useState('hybrid')
  const [center, setCenter] = useState({ lat: 36.40504746, lng: 126.43858747 })
  const [pendingCenter, setPendingCenter] = useState<any>()
  const [droneAnnotations, setDroneAnnotations] = useState([])
  const [selectedWPCluster, setSelectedWPCluster] = useState<any>()
  const [centeredCount, setCenteredCount] = useState(-1)
  const [draggable, setdragable] = useState(true)
  const [polygonPoints, setPolygonPoints] = useState<any>([]) //Survey Polygon
  const [polygonPath, setPolygonPath] = useState<any>(false) //polygon 경로 재 생성

  const {
    droneDeliveryInfos,
    selectedDroneId,
    handleUpdateDroneSelectedId,
    centeringDroneId,
    selectedCount,
    gotoHereMode,
    setGotoHereMode,
    fixDroneMap,
    baseDroneStatesObservable,
  }: any = useContext(SignalRContext)
  const { waypointClusters }: any = useContext(WaypointsContext)

  const [droneStates] = useSubscribe(baseDroneStatesObservable, {})

  const {
    setMap: missionContextSetMap,
    missionItems,
    addWaypoint,
    dragWaypoint,
    addingWaypointMode,
    dragwaypointMode,
    setDragWaypointMode,
    setGotoHereLocation,
    gotoHereLocation,
    AllmissionItems,
    subMode,
    drawingPolygon,
  }: any = useContext(MissionContext)

  const deliveryLines: any = useRef()
  const trailsPathRef: any = useRef()
  const missionItemsLines: any = useRef()
  const map: any = useRef()
  const maps: any = useRef()

  useEffect(() => {
    // console.log('useEffect 2')
    if (deliveryLines.current) {
      deliveryLines.current.forEach((flightPath: any) => flightPath.setMap(null))
    }
    if (trailsPathRef.current) {
      trailsPathRef.current.setMap(null)
    }
    deliveryLines.current = []
    const droneAnnotationsRaw: any = []

    Object.keys(droneStates).forEach(droneId => {
      const droneState = droneStates[droneId]
      const { DroneRawState, DroneTrails, FlightId } = droneState || {}
      const lat = DroneRawState && DroneRawState.DR_LAT
      const lng = DroneRawState && DroneRawState.DR_LON
      const yaw = Math.round(DroneRawState && ((DroneRawState.DR_YAW || 0) * 180) / Math.PI)

      const droneAvailable = droneState && droneState.IsOnline
      droneAnnotationsRaw.push({
        id: droneState.DroneId,
        lat,
        lng,
        yaw,
        droneAvailable,
        rawState: DroneRawState,
        flightId: FlightId,
      })

      if (mapApiLoaded && maps.current && map.current) {
        Object.keys(AllmissionItems).forEach(droneId => {
          const deliveryPath = AllmissionItems
            ? AllmissionItems[droneId]
              .map((item: any) =>
                item.type !== 'START'
                  ? {
                    lat:
                          item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH'
                            ? AllmissionItems[droneId][1].latitude
                            : item.latitude,
                    lng:
                          item.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH'
                            ? AllmissionItems[droneId][1].longitude
                            : item.longitude,
                  }
                  : [],
              )
              .reduce((acc: any, path: any) => acc.concat(path), [])
            : []
          const linecolor = AllmissionItems[droneId][0]?.droneId === selectedDroneId ? '#f50057' : '#00ffff'
          const lineWeight = AllmissionItems[droneId][0]?.droneId === selectedDroneId ? 4 : 2
          const flightPath = new maps.current.Polyline({
            path: deliveryPath,
            geodesic: true,
            strokeColor: linecolor,
            strokeOpacity: 1.0,
            strokeWeight: lineWeight,
          })
          flightPath.setMap(map.current)
          deliveryLines.current.push(flightPath)
        })

        if (selectedDroneId === droneId) {
          const trailsPath = DroneTrails
            ? DroneTrails.map((trail: any) => ({
              lat: trail.m_dLatitude,
              lng: trail.m_dLongitude,
            })).reduce((acc: any, path: any) => acc.concat(path), [])
            : []
          const trails = new maps.current.Polyline({
            path: trailsPath,
            strokeWeight: 4,
          })
          trails.setMap(map.current)
          trailsPathRef.current = trails
        }
      }
      setDroneAnnotations(droneAnnotationsRaw)
    })
  }, [mapApiLoaded, standardMap, droneDeliveryInfos, droneStates, selectedDroneId, AllmissionItems])

  useEffect(() => {
    // console.log('useEffect 3')
    if (missionItemsLines.current) {
      missionItemsLines.current.setMap(null)
    }
    //if (DroneAnnotation) { DroneAnnotation.style.transform = `rotate(${head}deg)`}
    if (mapApiLoaded && missionItems.length > 2) {
      const waypoints = missionItems.slice(1)
      missionItemsLines.current = new maps.current.Polyline({
        geodesic: true,
        path: waypoints.map((waypoint: any) => ({
          lat: waypoint.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? waypoints[0].latitude : waypoint.latitude,
          lng: waypoint.type === 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? waypoints[0].longitude : waypoint.longitude,
        })),
        strokeColor: '#f50057',
        strokeOpacity: 1.0,
        strokeWeight: 4,
      })
      missionItemsLines.current.setMap(map.current)
    }
  }, [mapApiLoaded, missionItems, standardMap, selectedDroneId])

  useEffect(() => {
    // console.log('useEffect 4')
    const deliveryInfo = droneDeliveryInfos[selectedDroneId]
    if (deliveryInfo && deliveryInfo.Waypoints != null && deliveryInfo.Waypoints.length > 0) {
      if (mapApiLoaded) {
        setCenter({
          lat: deliveryInfo.Waypoints[0].WP_S2D_LAT,
          lng: deliveryInfo.Waypoints[0].WP_S2D_LON,
        })
      } else {
        setPendingCenter({
          lat: deliveryInfo.Waypoints[0].WP_S2D_LAT,
          lng: deliveryInfo.Waypoints[0].WP_S2D_LON,
        })
      }
    }
  }, [selectedDroneId, droneDeliveryInfos, mapApiLoaded])

  useEffect(() => {
    // console.log('useEffect 5')
    const centeringDroneState = droneStates[centeringDroneId]
    if (!fixDroneMap) {
      if (
        centeredCount !== selectedCount &&
        //centeredCount !== selectedCount &&
        centeringDroneState?.DroneRawState?.DR_LAT &&
        centeringDroneState?.DroneRawState?.DR_LON
      ) {
        setCenter({
          lat: centeringDroneState.DroneRawState.DR_LAT,
          lng: centeringDroneState.DroneRawState.DR_LON,
          //lat: 36.40504746,
          //lng: 126.43858747.
        })
        setCenteredCount(selectedCount)
      }
    } else {
      if (centeringDroneState?.DroneRawState?.DR_LAT && centeringDroneState?.DroneRawState?.DR_LON) {
        setCenter({
          lat: centeringDroneState.DroneRawState.DR_LAT,
          lng: centeringDroneState.DroneRawState.DR_LON,
        })
        setCenteredCount(selectedCount)
      }
    }
  }, [centeringDroneId, selectedCount, droneStates, centeredCount, fixDroneMap])

  const handleMapTypeIdChange = (type: any) => {
    if (type === 'satellite' || type === 'hybrid') {
      setStandardMap(false)
    } else {
      setStandardMap(true)
    }
  }

  const handleMapChange = ({ center, zoom, mapTypeId, heading, draggable }: any) => {
    setCenter(center)
    setZoom(zoom)
    setmapTypeId(mapTypeId)
    setHeading(heading)
    setdragable(draggable)
  }

  const handleGoogleApiLoaded = useCallback(
    ({ map: mapIns, maps: mapsIns }: any) => {
      maps.current = mapsIns
      map.current = mapIns

      missionContextSetMap(mapIns, mapsIns)

      setMapApiLoaded(true)
      if (pendingCenter) {
        setPendingCenter(null)
        setCenter(pendingCenter)
      }
    },
    [missionContextSetMap, pendingCenter],
  )

  const onWaypointClusterHeightChange = (heights: any, waypointCluster: any) => {
    const changes = waypointCluster
      .map((waypoint: any, index: any) => ({ waypoint, index }))
      .filter((waypointWithIndex: any) =>
        compareFloats(waypointWithIndex.waypoint.WP_S2D_ALT, heights[waypointWithIndex.index]),
      )
      .map((waypointWithIndex: any) => ({
        height: heights[waypointWithIndex.index],
        waypointNumber: waypointWithIndex.waypoint.WP_S2D_NO,
      }))
    if (changes.length > 0) {
      updateWaypoints(waypointCluster[0].droneId, changes)
    }
  }

  const onMarkerInteractionMouseDown = (Key: any, icon_Info: any, current_Info: any) => {
    //console.log('웨이포인트에서 마우스 Down. ')
    console.log('카악  key : ', Key, 'icon_INFO : ', icon_Info, ' current_info : ', current_Info)
    if ((!selectedDroneId || icon_Info.droneId === selectedDroneId) && icon_Info.type !== 'drone') {
      setdragable(false)
      setDragWaypointMode(true)
      console.log('카악  key : ', Key, 'Wp_INFO : ', icon_Info, ' current_info : ', current_Info)
    } else if (icon_Info.type === 'gotohere') {
      setDragWaypointMode(true)
    } else if (icon_Info.type === 'drone' && selectedDroneId !== icon_Info.droneId) {
      handleUpdateDroneSelectedId(icon_Info.droneId)
    }
  }

  const onMarkerInteractionMouseUp = (index: any, Wp_Info: any, current_Info: any) => {
    setdragable(true)
    setDragWaypointMode(false)
  }

  const onMarkerInteractionMouseMove = (Key: any, Wp_Info: any, current_Info: any) => {
    if (!draggable && dragwaypointMode) {
      dragWaypoint({
        index: Wp_Info.waypointNumber,
        latitude: current_Info.lat,
        longitude: current_Info.lng,
      })
    }
  }

  const handleMapCenter = (map: any) => {
    setCenter({
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng(),
    })
  }

  useEffect(() => {
    console.log('mapApiLoaded {{{{{{')
    if (mapApiLoaded) {
      ;['click'].forEach(eventName => maps.current.event.clearListeners(map.current, eventName))
      map.current.addListener('click', (e: any) => {
        if (onClick) {
          onClick(e)
        }

        if (addingWaypointMode) {
          //console.log('waypoint', '  위도 : ', e.latLng.lat(), '경도 : ', e.latLng.lng())
          addWaypoint({
            droneId: selectedDroneId,
            type: 'MAV_CMD_NAV_WAYPOINT',
            longitude: e.latLng.lng(),
            latitude: e.latLng.lat(),
          })
        }
        if (gotoHereMode) {
          setGotoHereLocation({
            droneId: selectedDroneId,
            type: 'gotohere',
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          })
        }
      })
    }
  }, [
    onClick,
    onChildClick,
    mapApiLoaded,
    addWaypoint,
    addingWaypointMode,
    gotoHereMode,
    setGotoHereMode,
    setGotoHereLocation,
    selectedDroneId,
  ])

  // 마우스 클릭 이벤트 핸들러
  const handleMapClick = (e: any) => {
    if (subMode === 'mission')
      if (drawingPolygon) {
        if (typeof e.lat === 'number' && typeof e.lng === 'number') {
          const newPoint = { lat: e.lat, lng: e.lng }
          setPolygonPoints((polygonPoints: any) => [...polygonPoints, newPoint])
        } else {
          console.error('유효하지 않은 좌표:', e)
        }
      }
  }

  useEffect(() => {
    console.log('useEffect')
    if (maps.current && map.current) {
      if (drawingPolygon) {
        if (polygonPath) {
          polygonPath.setMap(null) // 이전에 생성된 다각형 제거
        }
        const newPolygon = new maps.current.Polygon({
          paths: polygonPoints,
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.2,
        })

        newPolygon.setMap(map.current)

        // 다각형 재 설정(다각형 중복 생성 제거)
        setPolygonPath(newPolygon)
      }
    }
  }, [polygonPoints, drawingPolygon, polygonPath])

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
        libraries: ['visualization'],
      }}
      zoom={zoom}
      draggable={draggable}
      onChildClick={key => setSelectedWPCluster(key)}
      onClick={handleMapClick}
      yesIWantToUseGoogleMapApiInternals={true}
      onGoogleApiLoaded={handleGoogleApiLoaded}
      options={createMapOptions}
      onMapTypeIdChange={handleMapTypeIdChange}
      center={center}
      onDragEnd={handleMapCenter}
      onChildMouseDown={onMarkerInteractionMouseDown}
      onChildMouseUp={onMarkerInteractionMouseUp}
      onChildMouseMove={onMarkerInteractionMouseMove}
      onChange={handleMapChange}>
      {waypointClusters.map((waypointCluster: any, index: any) => (
        <MarkerAnnotation
          key={`${waypointCluster[0].droneId}-${index}`}
          waypointCluster={waypointCluster}
          waypointNumber={waypointCluster.waypoint.WP_S2D_NO}
          type={waypointCluster.waypoint.WP}
          lat={waypointCluster[0].WP_S2D_LAT}
          lng={waypointCluster[0].WP_S2D_LON}
          droneId={waypointCluster[0].droneId}
          selectedDroneId={selectedDroneId}
          onChange={onWaypointClusterHeightChange}
          popover={parseInt(selectedWPCluster) === index}
          onClosePopup={() => setSelectedWPCluster(-1)}
          standardMap={standardMap}
        />
      ))}

      {Object.keys(AllmissionItems).map(droneId => {
        //const droneAnnotation = droneAnnotations.find(d => d.id === droneId)]
        if (!droneStates[droneId] || !droneStates[droneId]?.IsOnline) {
          if (droneId !== 'undefined') {
            return null
          }
        }
        return AllmissionItems[droneId].map((item: any, index: number) =>
          item.type !== 'START' && item.type !== 'MAV_CMD_NAV_RETURN_TO_LAUNCH' ? (
            <MarkerAnnotation
              key={`${item.droneId}-${index}`}
              droneId={droneStates[item.droneId].DroneName.slice(-4)}
              waypointNumber={index}
              type={item.type}
              lat={item.latitude}
              lng={item.longitude}
              alt={item.altitude}
              selectedDroneId={selectedDroneId}
            />
          ) : null,
        )
      })}
      {droneAnnotations.map(({ lat, lng, yaw, droneAvailable, rawState, id, flightId }) =>
        droneStates[id]?.IsOnline || droneStates[id] ? (
          <DroneAnnotation
            key={id}
            droneId={id}
            selectedDroneId={selectedDroneId}
            type={'drone'}
            lat={lat}
            lng={lng}
            rotation={yaw}
            droneStates={droneStates}
            droneState={rawState}
            droneAvailable={droneAvailable}
            standardMap={standardMap}
            flightId={flightId}
          />
        ) : null,
      )}
      {gotoHereLocation ? (
        <MarkerAnnotation
          droneId={gotoHereLocation.droneId}
          type={gotoHereLocation.type}
          lat={gotoHereLocation.lat}
          lng={gotoHereLocation.lng}
        />
      ) : null}
    </GoogleMapReact>
  )
}

// If drone has FlightId, drone status is now flying
// If drone don't has FlightId, drone status is now ready for flight
const DroneAnnotation = ({
  standardMap,
  rotation,
  droneId,
  selectedDroneId,
  droneStates,
  droneState,
  flightId,
}: any) => {
  const isSelected = droneId === selectedDroneId
  const { themeName } = useContext(SystemThemeContext)
  const className = themeName === 'tips' ? 'drone-info tips' : 'drone-info tft'
  const droneName = droneStates[droneId].DroneName
  return (
    <DroneAnnotationStyled>
      <div className={`drone-wrapper ${isSelected ? 'selected' : ''}`}>
        {/*<div className="drone-text">{droneId}</div>*/}
        <div>
          <img
            src={flightId === 'NONE' ? droneImgRed : droneImgBlue}
            alt="drone"
            style={{
              width: '70px',
              transform: `rotate(${rotation}deg)`,
              position: 'relative',
              //,border: (isSelected ? '2px solid #A1F805' : 'none')
              //,borderRadius: (isSelected ? '10%' : 'none')
              //,outline: (isSelected ? '2px solid #A1F805' : 'none')
              //,outlineOffset: '2px'
            }}
          />
        </div>
        <div className={className}>
          <div className="drone-info">
            <div className="drone-altitude">ID: {droneName}</div>
            <div className="drone-altitude">고도: {droneState?.DR_ALT / 1000 || 'N/A'} m</div>
            <div className="drone-altitude">속도 : {droneState?.DR_SPEED.toFixed(2) || 'N/A'} m/s</div>
          </div>
        </div>
      </div>
    </DroneAnnotationStyled>
  )
}

const DroneAnnotationStyled = styled.div`
  position: absolute;
  transform: translate(-26%, -26%);

  :hover {
    cursor: pointer; /* 마우스 커서를 포인터로 변경 */
    filter: brightness(1.5); /* 이미지 밝기를 1.2배로 조정하여 빨간색 효과 적용 */
  }

  .drone-wrapper {
    position: relative;
  }

  .drone-text {
    color: red;
    font-size: 18px;
    font-weight: bold;
    float: right;
  }

  .drone-info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: white;
    font-size: 14px;
    font-weight: bold;
    width: 120px;
    padding: 3px;
    padding-left: 2px;
    border-radius: 10px;
  }
  .tips {
    background: rgba(99, 89, 233, 0.8); //tips col
  }
  .tft {
    background: rgba(48, 100, 254, 0.8); // tft col
  }

  .drone-altitude {
    margin-top: 5px;
  }
`
