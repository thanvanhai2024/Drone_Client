import React from 'react'


export const GCSSelect = ({ options, className, label, ...props }) => {
  return (
    <div className="flex justify-left">
      <div className="mb-3" style={{ width: '100%' }}>
        {label && (
          <label form="exampleFormControlInput1" className="form-label inline-block mb-2 text-gray-700">
            {label}
          </label>
        )}

        <select
          className={`form-select appearance-none
            block
            w-full
            pr-8
            pl-3
            py-1.5
            text-lg
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none ${className || ''}`}
          {...props}>
          {options.map(option => (
            <option
              style={{ fontSize: '1em', fontWeight: 'bold' }}
              selected={option.value === props.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
