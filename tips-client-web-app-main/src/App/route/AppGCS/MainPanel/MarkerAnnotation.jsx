import React from 'react'
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
const WaypointNumber = styled.div`
    position: absolute;
    width: 50px;
    top: -14px;
    //right: -5px;
    left: -4px;
    color: ${(props) => (props.selected ? 'red' : 'black')};
    //font-weight: bold;
    font-size: 12px;
`

class MarkerAnnotation extends React.PureComponent {
  static contextType = MissionContext

  componentDidMount() {
    console.log('componentDidMount')
    const { waypointCluster, lat, lng, alt, waypointNumber, droneId, type, selectedDroneId } = this.props
    this.setState({
      heights: (waypointCluster || []).map(waypoint => waypoint.WP_S2D_ALT),
      //droneidw: (waypointCluster || []).map(waypoint => waypoint.droneId),
      droneId: droneId,
      lat: lat,
      lng: lng,
      alt: alt,
      Wpnum: waypointNumber,
      type: type,
      selecrDrone: selectedDroneId,
    })
  }

  // TODO: Check performance or structure
  componentDidUpdate(prevProps) {
    // console.log('componentDidUpdate')

    // lat 또는 lng props가 변경되었는지 확인
    if (this.props.lat !== prevProps.lat || this.props.lng !== prevProps.lng) {
      // 상태 업데이트
      this.setState({ lat: this.props.lat, lng: this.props.lng })
    }
  }

  handleOnChangeHeight = index => e => {
    console.log('index', index)
    console.log('eeee', e)
    const newHeight = this.state.heights.map((height, i) => (i === index ? e.target.value : height))
    this.setState({ heights: newHeight })
  }

  handleClosePopup = () => {
    const { onClosePopup, onChange, waypointCluster } = this.props
    onChange(
      this.state.heights.map(height => parseFloat(height)),
      waypointCluster,
    )
    onClosePopup()
  }

  handleonMouseDown = () => {
    console.log('Maker Img Down 이벤트 실행')
    //const { setAddingWaypointMode, setDragWaypointMode } = this.context
    //setAddingWaypointMode(false)
    //setDragWaypointMode(true)
    console.log(this.state)
  }


  handleonMouseLeave = () => {
    const { dragwaypointMode } = this.context
    if (!dragwaypointMode) {
      //setAddingWaypointMode(true)
      //setDragWaypointMode(false)
    }
    console.log(dragwaypointMode)
    console.log(this.state)
  }

  handleonMouseHover = () => {

  }

  render() {
    const { popover, standardMap, waypointCluster, waypointNumber, droneId, selectedDroneId, alt } = this.props
    // console.log(popover)
    // console.log(standardMap)
    const heights = this.state ? this.state.heights : []

    return (
      <Popover
        target={this}
        isOpen={popover}
        body={
          <PopoverDiv>
            {(waypointCluster || []).map((waypoint, index) => (
              <React.Fragment key={index}>
                <PopoverTitleSpan>{` ${waypoint.WP_S2D_NO}번 고도`}</PopoverTitleSpan>
                <PopoverInput
                  placeholder="Input customize latitude"
                  value={heights[index]}
                  onChange={this.handleOnChangeHeight(index)}
                />
              </React.Fragment>
            ))}
          </PopoverDiv>
        }
        onOuterAction={this.handleClosePopup}>

        <MarkerStyled>
          <MarkerImg
            src={standardMap ? markerImgStandard : markerImgSatellite}
            // Wpnum={`Wp ${waypointNumber}`}
            //alt="waypoint"
            onMouseDown={this.handleonMouseDown}
            onMouseLeave={this.handleonMouseLeave}
          />
          {
            waypointNumber && (
              <WaypointNumber selected={selectedDroneId === droneId}>
                {selectedDroneId === droneId ? `${waypointNumber}` : `${droneId}-${waypointNumber}`}
              </WaypointNumber>
            )
          }
        </MarkerStyled>
      </Popover>
    )
  }
}

export default MarkerAnnotation
