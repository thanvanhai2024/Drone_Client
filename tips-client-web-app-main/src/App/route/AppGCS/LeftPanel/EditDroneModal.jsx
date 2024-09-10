import React, { useEffect, useState } from 'react'
import { GCSModal } from '../common/GCSModal'
import { GCSSelect } from '../common/GCSSelect'
import GCSInput from '../common/GCSInput'
import { GCSButton } from '../common/GCSButton'

export const EditDroneModal = ({ onEditDrone, onDisconnectionDrone, editingDroneId, droneState, ...props }) => {
  const [droneInput, setDroneInput] = useState({})
  useEffect(() => {
    if (droneState?.CommunicationLink?.ConnectionProtocol) {
      const tokens = droneState.CommunicationLink.Address.split(':')
      setDroneInput({
        ConnectionProtocol: droneState.CommunicationLink.ConnectionProtocol,
        Address: droneState.CommunicationLink.Address,
        localAddress: droneState.CommunicationLink.localAddress,
        serialPort: droneState.CommunicationLink.ConnectionProtocol === 'SERIAL' ? tokens[0] : undefined,
        baudrate: droneState.CommunicationLink.ConnectionProtocol === 'SERIAL' ? tokens[1] : undefined,
        cameraAddress1: droneState.CameraURL1,
        cameraAddress2: droneState.CameraURL2,
        cameraIframe: droneState.CameraIframe,
        cameraMasking: droneState.CameraMasking,
        cameraControlAddress: droneState.CameraIP,
        cameraType: droneState.CameraProtocolType,
      })
    }
  }, [
    droneState.CommunicationLink.ConnectionProtocol,
    droneState.CommunicationLink.Address,
    droneState.CommunicationLink.localAddress,
    droneState.CameraIP,
    droneState.CameraURL1,
    droneState.CameraURL2,
    droneState.CameraProtocolType,
    droneState.CameraIframe,
    droneState.CameraMasking
  ] )
  return (

    <GCSModal
      ariaHideApp={false}
      style={{
        overlay: { zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.4)' },
        content: { width: 300, left: 'calc(50% - 150px)', height: 'fit-content' },
      }}
      {...props}>
      <div className="w-[600px] bg-white p-4 rounded">
        <h3 className="font-bold text-lg text-black mb-2">Edit Drone Connection</h3>
        <GCSSelect
          disabled
          value={droneInput.ConnectionProtocol}
          options={[
            {
              value: droneInput.ConnectionProtocol,
              label: droneInput.ConnectionProtocol,
            },
          ]}
          onChange={v => setDroneInput(old => ({ ...old, connectionLink: v.target.value }))}
        />
        {droneInput.protocol === 'SERIAL' ? (
          <>
            <select className="select w-full max-w-xs" value={droneInput.serialPort} disabled>
              <option disabled selected>
                {droneInput.serialPort}
              </option>
            </select>
            <select className="select w-full max-w-xs" value={droneInput.baudrate}>
              <option disabled selected>
                {droneInput.baudrate}
              </option>

              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(pow => (
                <option
                  selected={Math.pow(2, pow) * 300 === droneInput.baudrate}
                  key={pow}
                  value={Math.pow(2, pow) * 300}>
                  {Math.pow(2, pow) * 300}
                </option>
              ))}
            </select>
          </>
        ) : (
          <GCSInput
            value={droneInput.localAddress || ''}
            disabled
            type="text"
            label="Address"
            className="input w-full max-w-xs"
          />
        )}
        <GCSSelect
          label="Camera protocol"
          value={droneInput.cameraType}
          options={[
            {
              value: 'Cam1',
              label: '30X Camera',
            },
            {
              value: 'Cam2',
              label: '10X Camera',
            },
          ]}
          onChange={v => setDroneInput(old => ({ ...old, cameraType: v.target.value }))}
        />

        <GCSInput
          value={droneInput.cameraControlAddress || ''}
          onChange={v => setDroneInput(old => ({ ...old, cameraControlAddress: v.target.value }))}
          type="text"
          label="Camera Control Address"
          className="input w-full max-w-xs"
        />
        <GCSInput
          value={droneInput.cameraAddress1 || ''}
          onChange={v => setDroneInput(old => ({ ...old, cameraAddress1: v.target.value }))}
          type="text"
          label="Camera Address 1 (RTSP only)"
          className="input w-full max-w-xs"
        />
        <GCSInput
          value={droneInput.cameraAddress2 || ''}
          onChange={v => setDroneInput(old => ({ ...old, cameraAddress2: v.target.value }))}
          type="text"
          label="Camera Address 2 (RTSP only)"
          className="input w-full max-w-xs"
        />
        <GCSInput
          value={droneInput.cameraIframe || ''}
          onChange={v => setDroneInput(old => ({ ...old, cameraIframe: v.target.value }))}
          type="text"
          label="Camera Iframe "
          className="input w-full max-w-xs"
        />
        <GCSInput
          value={droneInput.cameraMasking || ''}
          onChange={v => setDroneInput(old => ({ ...old, cameraMasking: v.target.value }))}
          type="text"
          label="Camera Masking "
          className="input w-full max-w-xs"
        />
        <div className="modal-action flex justify-between">
          <GCSButton

            htmlFor="my-modal"
            type="danger"
            onClick={() => {
              onDisconnectionDrone()
            }}>
            Disconnect
          </GCSButton>
          <GCSButton
            htmlFor="my-modal"
            type="light"
            onClick={() => {
              onEditDrone({
                cameraControlAddress: droneInput.cameraControlAddress,
                cameraAddress1: droneInput.cameraAddress1,
                cameraAddress2: droneInput.cameraAddress2,
                cameraIframe: droneInput.cameraIframe,
                cameraMasking: droneInput.cameraMasking,
                cameraType: droneInput.cameraType,
              })
              setDroneInput({})
            }}>
            Update
          </GCSButton>
        </div>
      </div>
    </GCSModal>
  )
}
