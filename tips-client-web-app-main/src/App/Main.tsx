import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import ImageAnalysis from './route/MediaProcessing/ImageAnalysis'
import RealtimeMonitor from './route/MediaProcessing/RealtimeMonitor'
import VideoAnalysis from './route/MediaProcessing/VideoAnalysis'
import Register from './Auth/Register'
import Dashboard from './route/Dashboard'
import { RealtimeMonitoring } from './route/PredictionService/RealtimeMonitoring'
import { Login } from './Auth/Login'
import MediaWrapper from './route/MediaProcessing/MediaWrapper'
import UserInfoPage from './Auth/UserInfoPage'
import ServiceProviders from './components/ServiceProviders'
import AppWrapper from './route/AppWrapper'
import AppGCSWrapper from './route/AppGCS/AppGCSWrapper'
import RealtimeMonitorMulti from './route/MediaProcessing/RealtimeMonitor/RealtimeMonitorMulti'



const Main = () => {
  return (
    <ServiceProviders>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          {/* <Route element={<AuthorizedRoute />}> */}
            <Route element={<AppWrapper />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/auth/user-info" element={<UserInfoPage />} />
              <Route path="/drone-monitor" element={<AppGCSWrapper />} />
              <Route element={<MediaWrapper />}>
                <Route path="/image-processing" element={<ImageAnalysis />} />
                <Route path="/video-analysis" element={<VideoAnalysis />} />
                <Route path="/realtime-monitor" element={<RealtimeMonitor />} />
                <Route path="/realtime-monitor-multi" element={<RealtimeMonitorMulti />} />
              </Route>
              <Route path="/realtime-monitoring" element={<RealtimeMonitoring/>}/>
            </Route>
          {/* </Route> */}
        </Routes>
      </Router>
    </ServiceProviders>
  )
}

export default Main
