import { useEffect, useState } from 'react'
import { useSubscription } from 'react-stomp-hooks'
import { toast } from 'react-toastify'
import { TypeOptions } from 'react-toastify/dist/types'

export interface WsMessageProps {
  resultType: string,
  sendFrom: string,
  sendTo: string,
  taskName: string,
  text: string,
  data: string,
}
const NotificationService = () => {
  const [message, setMessage] = useState<WsMessageProps>()

  useSubscription('/all/messages', (msg) => {
    console.log('received from all: ' + msg)
    setMessage(JSON.parse(msg.body))
  })
  useSubscription('/user/specific', (msg) => {
    console.log('received private: ' + msg)
    setMessage(JSON.parse(msg.body))
  })

  useEffect(() => {
    if (message) {
      // toast(`${message?.sendFrom} to ${message?.sendTo}: ${message?.text}`,
      toast(`${message?.text}`,
        { type: message!.resultType as TypeOptions })
      console.log(message)
    }
  }, [message])
  
  return (
    <></>
  )
}

export default NotificationService