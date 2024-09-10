import React, { useContext } from 'react'
import styled, { css } from 'styled-components'
import { SystemThemeContext } from '../../AppWrapper'

const DroneGaugeComponent = styled.div`
    border-radius: 105px;
    border-color: #2E2D5D;
    background: #272727;
    padding: 10px;
    height: 230px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: linear-gradient(336.45deg, #002262 14.46%, #00328C 85.85%);    
`


const calculateRadLine = (r1, r2, angel, x, y) => {
  // a = tan(angel) * b
  const x1 = x - Math.cos(angel) * r1
  const y1 = y - Math.sin(angel) * r1
  const x2 = x - Math.cos(angel) * r2
  const y2 = y - Math.sin(angel) * r2
  return { x1, y1, x2, y2 }
}

const DroneGaugeChart = ({ size = 100, droneState = {} }) => {

  const background = { start: '#4C77BA', stop: '#4C77BA' }
  const pitchColor = { start: '#6EAB33', stop: '#497C11' }

  if (!droneState) {
    return <div />
  }

  const roll = (-(droneState.DR_ROLL || 0) * 180) / Math.PI
  const pitch = (-(droneState.DR_PITCH || 0) * 180) / Math.PI
  const yaw = ((droneState.DR_YAW || 0) * 180) / Math.PI

  const r1 = (0.8 * size) / 2
  const r2 = (0.9 * size) / 2
  const cr1 = (0.85 * size) / 2
  const cr1l = (0.8 * size) / 2
  const cr2 = (0.95 * size) / 2

  const droneSvgPoints = [
    size / 2,
    size / 4,
    (size * 2) / 3,
    (size * 2) / 3,
    size / 2,
    (size * 1.8) / 3,
    (size * 1) / 3,
    (size * 2) / 3
  ]

  const trianglePoints = [
    size / 2 - 2,
    size / 20,
    size / 2 + 2,
    size / 20,
    size / 2,
    size / 20 + 8
  ]
  return (
    <DroneGaugeComponent>
      <svg width={size} height={size}>
        <defs>
          <linearGradient
            id="greenGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={background.start} stopOpacity={1} />
            <stop
              offset={`${size / 2 - ((pitch / 45) * size) / 2}%`}
              stopColor={background.stop}
              stopOpacity={1}
            />
            <stop
              offset={`${size / 2 - ((pitch / 45) * size) / 2}%`}
              stopColor={pitchColor.start}
              stopOpacity={1}
            />
            <stop offset="100%" stopColor={pitchColor.stop} stopOpacity={1} />
          </linearGradient>
        </defs>
        <g transform={`rotate(${roll} ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2}
            fill="url(#greenGradient)"
          />
          {[...Array(5).keys()].map(value => (
            <line
              key={value}
              x1={(size / 12) * (value % 2 === 0 ? 5 : 5.5)}
              x2={(size / 12) * (value % 2 === 0 ? 7 : 6.5)}
              y1={size / 2 + ((value - 2) * size) / 10}
              y2={size / 2 + ((value - 2) * size) / 10}
              strokeWidth={1}
              stroke="white"
            />
          ))}
          {[...Array(9).keys()].map(value => {
            const { x1, y1, x2, y2 } = calculateRadLine(
              r1,
              r2,
              Math.PI / 6 + (Math.PI / 12) * value,
              size / 2,
              size / 2
            )
            return (
              <line
                key={value}
                x1={x1}
                x2={x2}
                y1={y1}
                y2={y2}
                strokeWidth={2}
                stroke="white"
              />
            )
          })}
        </g>
        <circle cx={size / 2} cy={size / 2} r={2} fill="red" />
        <line
          x1={(size / 12) * 2}
          x2={(size / 12) * 3.5}
          y1={size / 2}
          y2={size / 2}
          stroke="red"
          strokeWidth={1}
        />
        <line
          x1={(size / 12) * 8.5}
          x2={(size / 12) * 10}
          y1={size / 2}
          y2={size / 2}
          stroke="red"
          strokeWidth={1}
        />
        <polygon points={trianglePoints} fill="red" />
      </svg>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={size / 2} fill="#000000" />
        {[...Array(36).keys()].map(value => {
          const { x1, y1, x2, y2 } = calculateRadLine(
            value % 3 === 0 ? cr1l : cr1,
            cr2,
            (Math.PI / 18) * value,
            size / 2,
            size / 2
          )
          return (
            <line
              key={value}
              x1={x1}
              x2={x2}
              y1={y1}
              y2={y2}
              strokeWidth={value % 3 === 0 ? 1 : 0.5}
              stroke="white"
            />
          )
        })}
        <polygon
          transform={`rotate(${yaw} ${size / 2} ${size / 2})`}
          points={droneSvgPoints}
          fill="#FF4502"
        />
      </svg>
    </DroneGaugeComponent>
  )
  // }
}

export default DroneGaugeChart
