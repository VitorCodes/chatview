import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.scss'

type LoaderProps = {
  size: number
}

const Dropdown = (props: LoaderProps) => 
  <div className={styles['loader']} style={{  fontSize: `${props.size}px`}} />

Dropdown.defaultProps = {
	size: 2
}

export default Dropdown
