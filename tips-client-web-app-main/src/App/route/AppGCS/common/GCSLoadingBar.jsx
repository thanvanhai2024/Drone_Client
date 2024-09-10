import React from 'react'

export const GCSLoadingBar = ({ percentage, isThin }) => {
  return (
    <div className={`w-full bg-gray-200 ${isThin ? 'h-1' : 'h-2.5 rounded-full'} dark:bg-gray-700 mb-2`}>
      <div className={`bg-[#6359E9] ${isThin ? 'h-1' : 'h-2.5 rounded-full'}`}
        style={{ width: `${percentage}%` }}></div>
    </div>
  )
}
