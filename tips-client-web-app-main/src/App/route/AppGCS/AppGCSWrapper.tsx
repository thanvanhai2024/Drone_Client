import React from 'react'
import { WaypointsContextProvider } from './WaypointsContext'
import { DroneCameraContainer } from './DroneCameraContainer'
import AppGCSJ from './App'

const AppGCSWrapper = () => (
  <WaypointsContextProvider>
    <DroneCameraContainer>
      <AppGCSJ />
    </DroneCameraContainer>
  </WaypointsContextProvider>
)

export default AppGCSWrapper
