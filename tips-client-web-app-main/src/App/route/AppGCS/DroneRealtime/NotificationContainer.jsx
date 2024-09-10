// import React, { useState, useContext, useEffect, createContext, useReducer } from 'react'
// import { HubConnectionBuilder } from '@microsoft/signalr'
// import { toast } from 'react-toastify'
// import { baseGCSPath } from '../../common/path'
// import alertSound from '../../../../resources/simple-notification.mp3'
// import { SignalRContext } from './SignalRContainer'
//
// export const NotificationContext = createContext({})
//
// export const NotificationProvider = ({ children }) => {
//   const { handleSendDroneMissionStart } = useContext(SignalRContext)
//
//   const [reload, toogleReload] = useReducer(
//     reload => !reload, true
//   )
//
//   useEffect(() => {
//     console.log('const connection = new HubConnectionBuilder()')
//     const connection = new HubConnectionBuilder()
//       .withUrl(`${baseGCSPath}/notification-hub`)
//       .build()
//
//     connection.on('ReceiveNotification', (message) => {
//       if (message === '새로운 배송 미션이 도착했습니다!'){
//         const audio = new Audio(alertSound)
//         audio.play()
//       }
//       else if (message === 'COMPONENT_ARM Accepted') {
//         // setTimeout(() => {
//         //   handleSendDroneMissionStart()
//         // }, 1000)
//         handleSendDroneMissionStart()
//
//       }
//       toogleReload()
//       toast.info(message)
//       // toast(success_meg({ message: message }), basic_config)
//     })
//
//     connection.start().catch(err => { console.log(err) })
//
//     return () => {
//       connection.stop()
//     }
//   }, [handleSendDroneMissionStart])
//
//   return (
//     // eslint-disable-next-line no-sequences
//     <NotificationContext.Provider value={{ reload, toogleReload }}>
//       {children}
//     </NotificationContext.Provider>
//   )
// }
//
// const success_meg = ({ message }) => (
//   <div>
//     <div style={{ color: 'grary' }}>
//       <br /> {/* 한 줄 띄우기 */}
//       {message}
//     </div>
//   </div>
// )
//
// const basic_config = {
//   type: 'success',
//   pauseOnFocusLoss: false,
//   draggable: false,
//   pauseOnHover: false,
//   closeOnClick: true,
// }
