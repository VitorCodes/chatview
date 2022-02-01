import React, { ReactNode } from 'react'
import styles from './styles.scss'

type WaveFill = {
  baseWave?: string
  lowWave?: string
  midWave?: string
  topWave?: string
}

type WaveProps = {
  style?: any
  fill: WaveFill
}

const Waves = (props: WaveProps) => (
  <div>
    <svg
      className={styles['waves']}
			style={props.style}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g className={styles['waves__parallax']}>
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="0"
          fill={props.fill.topWave}
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="3"
          fill={props.fill.midWave}
        />
        <use
          xlinkHref="#gentle-wave"
          x="48"
          y="5"
          fill={props.fill.lowWave}
        />
        <use xlinkHref="#gentle-wave" x="48" y="7" fill={props.fill.baseWave} />
      </g>
    </svg>
  </div>
)

Waves.defaultProps = {
  fill: {
    baseWave: '#fff',
    lowWave: 'rgba(255, 255, 255, 0.2)',
    midWave: 'rgba(208, 104, 208, 0.5)',
    topWave: 'rgba(9, 169, 200, 0.8)',
  },
}

export default Waves
