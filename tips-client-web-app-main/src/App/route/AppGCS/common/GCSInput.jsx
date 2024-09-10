import React from 'react'

const GCSInput = ({ className, label, ...props }) => {
  return (
    <div className="flex justify-left">
      <div className="mb-3" style={{ width: '100%' }}>
        <label for="exampleFormControlInput1" className="form-label inline-block mb-2 text-gray-700">
          {label}
        </label>
        <input
          type="text"
          className={`form-control
            block 
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${props.className || ''}`}
          {...props}
        />
      </div>
    </div>
  )
}

export default GCSInput
