import React, { useContext } from 'react'
import { RealTimeFormProps, RealTimePageType } from './RealTime.type'
import { useFormData } from './RealTimeHooks'
import { SignalRContext } from '../../AppGCS/DroneRealtime/SignalRContainer'
import { useSubscribe } from '../../common/useRxjs'

const RealTimeDroneForm = (props: RealTimeFormProps) => {
  const { formData, handleChange } = useFormData({
    DroneId: props.selectedValue as string,
    FlightId: '',
    periodFrom: '',
    periodTo: '',
  })
  const { baseDroneStatesObservable } = useContext<RealTimePageType>(SignalRContext)
  const [droneStates] = useSubscribe(baseDroneStatesObservable, {})

  return (
    <div className="">
      <div className="w-full">
        <form>
          <label>
            <select
              className="real-time-drone-button-design wrapper-border-radius"
              name={'DroneId'}
              value={formData.DroneId ? formData.DroneId : props.selectedValue}
              onChange={handleChange}>
              {props.droneIds
                .filter(item => !!droneStates[item])
                .map((item, index) => (
                  <option className="popup-btn" value={item} key={index} label={`${droneStates[item].DroneName}`}>
                    {item}
                  </option>
                ))}
            </select>
          </label>
        </form>
      </div>
    </div>
  )
}

export default RealTimeDroneForm
