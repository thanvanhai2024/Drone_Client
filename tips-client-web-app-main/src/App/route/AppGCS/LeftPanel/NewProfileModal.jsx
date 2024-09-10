import { GCSModal } from '../common/GCSModal'
import { Dialog } from '@headlessui/react'
import GCSInput from '../common/GCSInput'
import { GCSButton } from '../common/GCSButton'
import React from 'react'

export const NewProfileModal = ({ proName, setProName, onAddNewProfile, ...props }) => {

  const handleInputChange = (e) => {
    setProName(e.target.value)
  }

  return (
    <GCSModal {...props}>
      <div className="bg-white p-2">
        <Dialog.Title>
          <h3 className="font-bold text-lg py-1 text-black">Make ProFile </h3>
        </Dialog.Title>
        <GCSInput
          value={proName}
          onChange={handleInputChange}
          type="text"
          label="ProFile Name"
          className="input w-full max-w-xs"
        />
        <div className="modal-action flex flex-row-reverse">
          <GCSButton
            htmlFor="my-modal"
            type="dark"
            onClick={() => {
              onAddNewProfile(proName)
              setProName('')
            }}>
            Make
          </GCSButton>
        </div>
      </div>
    </GCSModal>
  )
}
