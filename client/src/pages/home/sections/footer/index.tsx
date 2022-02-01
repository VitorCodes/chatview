import React from 'react'
import styles from './styles.scss'

const GITHUB_URL = 'https://github.com/VitorCodes'
const LINKEDIN_URL = 'https://www.linkedin.com/in/vitorcodes/'
const DONATE_URL = 'https://github.com/VitorCodes/chat-view#-donate'

const Footer = () => {
  return (
    <footer className={styles['footer']}>
      Copyright © {new Date().getFullYear()}, Vitor Silva
      <div>
        <a href={GITHUB_URL}>GitHub</a>
        <span>•</span>
        <a href={LINKEDIN_URL}>LinkedIn</a>
        <span>•</span>
        <a href={DONATE_URL}>Donate ❤️</a>
      </div>
    </footer>
  )
}

export default Footer
