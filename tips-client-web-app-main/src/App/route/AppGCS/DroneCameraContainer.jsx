import React, { useState } from 'react'

export const DroneCameraContext = React.createContext({})

export const DroneCameraContainer = ({ children }) => {
  const [onTrackSelected, setOnTrackSelected] = useState(false)
  return (
    <DroneCameraContext.Provider
      value={{
        onTrackSelected,
        setOnTrackSelected,
      }}>
      {children}
    </DroneCameraContext.Provider>
  )
}
