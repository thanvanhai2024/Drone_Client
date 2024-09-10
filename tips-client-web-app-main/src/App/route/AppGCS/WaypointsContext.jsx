import React, { useContext, useState } from 'react'
import { SignalRContext } from './DroneRealtime/SignalRContainer'

export const WaypointsContext = React.createContext({})

export const WaypointsContextProvider = ({ children }) => {
  const [selectedWPCluster, setSelectedWPCluster] = useState()
  const { droneDeliveryInfos } = useContext(SignalRContext)
  const value = clusteringWaypoints(droneDeliveryInfos)
  return (
    <WaypointsContext.Provider value={{ ...value, selectedWPCluster, setSelectedWPCluster }}>
      {children}
    </WaypointsContext.Provider>
  )
}

export const compareFloats = (f1, f2) => (Math.abs(f1 - f2) < Number.EPSILON ? 0 : f1 - f2)

const compareWPs = (wp1, wp2) =>
  compareFloats(wp1.WP_S2D_LAT, wp2.WP_S2D_LAT) || compareFloats(wp1.WP_S2D_LON, wp2.WP_S2D_LON)

const clusterWaypoints = waypoints =>
  (waypoints || []).sort(compareWPs).reduce((prev, cur) => {
    if (prev.length === 0 || compareWPs(prev[prev.length - 1][0], cur)) {
      prev.push([{ ...cur, droneId: cur.droneId }])
    } else {
      prev[prev.length - 1].push({ ...cur, droneId: cur.droneId })
    }
    return prev
  }, [])


const clusteringWaypoints = droneDeliveryInfos => {
  const waypointClusters = []
  const waypointIndexToClusterMaps = {}

  Object.keys(droneDeliveryInfos).forEach(droneId => {
    waypointIndexToClusterMaps[droneId] = {}
    const droneDeliveryInfo = droneDeliveryInfos[droneId]
    if (!droneDeliveryInfo) {
      return
    }
    const { Waypoints: _waypoints } = droneDeliveryInfo
    const Waypoints = _waypoints && _waypoints.map(wp => ({ ...wp, droneId }))

    const clusters = clusterWaypoints(Waypoints)
    clusters.forEach((cluster, index) => {
      const clusterWithDroneId = cluster.map(wp => ({ ...wp, droneId }))
      cluster.forEach(wp => {
        waypointIndexToClusterMaps[droneId][wp.WP_S2D_NO] = waypointClusters.length + index
      })

      waypointClusters.push(...clusterWithDroneId)
    })
  })
  return {
    waypointClusters,
    waypointIndexToClusterMaps,
  }
}
