import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Popover from 'react-popover'
import markerImgStandard from '../../../../resources/marker_normal.png'
import markerImgSatellite from '../../../../resources/marker_satellite.png'
import { MissionContext } from '../components/MissionContext'


const MarkerStyled = styled.div`
    position: absolute;
    transform: translate(-50%, -100%);
    height: 35px;
`

const MarkerImg = styled.img`
    height: 100%;

    :hover {
        cursor: pointer; /* 마우스 커서를 포인터로 변경 */
        filter: brightness(1.5); /* 이미지 밝기를 1.2배로 조정하여 빨간색 효과 적용 */
    }
`

const PopoverDiv = styled.div`
    width: auto;
    height: auto;
    background: #000000;
    padding: 0.5em;
    border-radius: 5px;
    color: #00ffff;
    opacity: 0.8;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
`

const PopoverTitleSpan = styled.span`
    padding: 0 0 2px 5px;
`

const PopoverInput = styled.input`
    width: 80px;
`
const WaypointNumber: any = styled.div`
    position: absolute;
    width: 50px;
    top: -14px;
    //right: -5px;
    left: -4px;
    color: ${(props: any) => (props.selected ? 'red' : 'black')};
    //font-weight: bold;
    font-size: 12px;
`

const MarkerAnnotationTS = (props: any) => {

  const { waypointCluster, lat, lng, alt, waypointNumber, droneId, type, selectedDroneId } = props

  const [aaa, setAaa] = useState<any>({
    heights: (waypointCluster || []).map((waypoint: any) => waypoint.WP_S2D_ALT),
    //droneidw: (waypointCluster || []).map(waypoint => waypoint.droneId),
    droneId: droneId,
    lat: lat,
    lng: lng,
    alt: alt,
    Wpnum: waypointNumber,
    type: type,
    selecrDrone: selectedDroneId,
  })

  useEffect(() => {
    setAaa({ lat: props.lat, lng: props.lng })
  }, [props.lat, props.lng])


  // const handleOnChangeHeight = index => e => {
  //   const newHeight = this.state.heights.map((height, i) => (i === index ? e.target.value : height))
  //   this.setState({ heights: newHeight })
  // }
  //
  // const handleClosePopup = () => {
  //   const { onClosePopup, onChange, waypointCluster } = this.props
  //   onChange(
  //     this.state.heights.map(height => parseFloat(height)),
  //     waypointCluster,
  //   )
  //   onClosePopup()
  // }
  //
  // const handleonMouseDown = () => {
  //   console.log('Maker Img Down 이벤트 실행')
  //   //const { setAddingWaypointMode, setDragWaypointMode } = this.context
  //   //setAddingWaypointMode(false)
  //   //setDragWaypointMode(true)
  //   console.log(this.state)
  // }
  //
  //
  // const handleonMouseLeave = () => {
  //   const { dragwaypointMode } = this.context
  //   if (!dragwaypointMode) {
  //     //setAddingWaypointMode(true)
  //     //setDragWaypointMode(false)
  //   }
  //   console.log(dragwaypointMode)
  //   console.log(this.state)
  // }
  //
  // const handleonMouseHover = () => {
  //
  // }
  //
  // const heights = this.state ? this.state.heights : []

  return (
    <div>asdfasdf</div>
    // <Popover
    //   target={this}
    //   isOpen={popover}
    //   body={
    //     <PopoverDiv>
    //       {(waypointCluster || []).map((waypoint, index) => (
    //         <React.Fragment key={index}>
    //           <PopoverTitleSpan>{` ${waypoint.WP_S2D_NO}번 고도`}</PopoverTitleSpan>
    //           <PopoverInput
    //             placeholder="Input customize latitude"
    //             value={heights[index]}
    //             onChange={this.handleOnChangeHeight(index)}
    //           />
    //         </React.Fragment>
    //       ))}
    //     </PopoverDiv>
    //   }
    //   onOuterAction={this.handleClosePopup}>
    //
    //   <MarkerStyled>
    //
    //
    //     <MarkerImg
    //       src={standardMap ? markerImgStandard : markerImgSatellite}
    //       // Wpnum={`Wp ${waypointNumber}`}
    //       //alt="waypoint"
    //       onMouseDown={this.handleonMouseDown}
    //       onMouseLeave={this.handleonMouseLeave}
    //
    //     />
    //     {
    //       waypointNumber && (
    //         <WaypointNumber selected={selectedDroneId === droneId}>
    //           {selectedDroneId === droneId ? `${waypointNumber}` : `${droneId}-${waypointNumber}`}
    //         </WaypointNumber>
    //       )
    //     }
    //   </MarkerStyled>
    // </Popover>
  )
}


export default MarkerAnnotationTS
