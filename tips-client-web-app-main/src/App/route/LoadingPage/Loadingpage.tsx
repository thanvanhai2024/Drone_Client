import './Loadingpage.scss'
import { useEffect, useState } from 'react'
import { TbDrone } from 'react-icons/tb'
import { FaFighterJet, FaGamepad, FaImage, FaVideo, FaRocket, FaMapMarkedAlt } from 'react-icons/fa'
import React from 'react'

// icon rotate, add diff icon(include drone icon)
const LoadingPage1: React.FC = () => {
  const [counter, setCounter] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevCounter => (prevCounter === 8 ? 0 : prevCounter + 1))
    }, 3000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  const images: JSX.Element[] = [
    <TbDrone />,
    <FaFighterJet />,
    <FaGamepad />,
    <FaImage />,
    <FaVideo />,
    <FaRocket />,
    <FaMapMarkedAlt />,
    <TbDrone />,
    <FaFighterJet />,
    <FaGamepad />,
    <FaImage />,
    <FaVideo />,
    <FaRocket />,
    <FaMapMarkedAlt />
  ]
  
  return (
    <>
      <div className="icon-loading-page">
        <div className="icon-loader">
          <div className="icon-image">
            {images[counter]}
          </div>
        </div>
        <span className='loading-message'>LOADING .. </span>
      </div>
    </>
  )
}

// loading circle
export const LoadingPage2: React.FC = () => {
  return (
    <>
      <section className="loading-circle">
        <span className="loading__author"> LOADING ..</span>
        <span className="loading__anim"></span>
      </section>
    </>
  )
}

// dot animation
export const LoadingPage3: React.FC = () => {
  return (
    <div className="screen">
      <div className="dot-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  )
}

// loading bar and loading message
export const LoadingPage4: React.FC = () => {
  return (
    <div className="box">
      <div className="L">L</div>
      <div className="O">O</div>
      <div className="A">A</div>
      <div className="D">D</div>
      <div className="I">I</div>
      <div className="N">N</div>
      <div className="G">G</div>
      <div className="underline"></div>
    </div>
  )
}

// drone icon and loading message
export const LoadingPage5: React.FC = () => {
  return (
    <div id="pre-loader">
      <div className="loadingGraphics">
        <svg className="drone-icon" fill='lightgray' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20,7H18V5h2a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2h2V7H8V5h2a1,1,0,0,0,0-2H4A1,1,0,0,0,4,5H6V7H4a3,3,0,0,0,0,6H6.1a4.955,4.955,0,0,0,.99,2.092A5,5,0,0,0,3,20a1,1,0,0,0,2,0,3,3,0,0,1,3-3h3v2a1,1,0,0,0,2,0V17h3a3,3,0,0,1,3,3,1,1,0,0,0,2,0,5,5,0,0,0-4.091-4.908A4.955,4.955,0,0,0,17.9,13H20a3,3,0,0,0,0-6Zm0,4H17a1,1,0,0,0-1,1,3,3,0,0,1-3,3H11a3,3,0,0,1-3-3,1,1,0,0,0-1-1H4A1,1,0,0,1,4,9H20a1,1,0,0,1,0,2Zm-6,1a2,2,0,0,1-4,0,1.929,1.929,0,0,1,.1-.581A1,1,0,1,0,11.417,10.1,1.978,1.978,0,0,1,12,10,2,2,0,0,1,14,12Z"/>
        </svg>
        <div className='under-drone-box'>
          <div className="L">L</div>
          <div className="O">O</div>
          <div className="A">A</div>
          <div className="D">D</div>
          <div className="I">I</div>
          <div className="N">N</div>
          <div className="G">G</div>
        </div>
      </div>
    </div>
  )
}
