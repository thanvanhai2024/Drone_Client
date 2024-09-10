import React from 'react'

const MissionMenuComponents = ({ topOffset, zIndex, label, children }) => {
  return (
    <div className={`absolute w-[60px] top-[${topOffset}px] pt-1 pb-1 left-[10px] z-${zIndex} rounded-lg flex 
    flex-col space-y-1 bg-white/70 items-center text-black`}>
      <label className="font-bold text-base">{label}</label>
      {children}
    </div>
  )
}

export default MissionMenuComponents