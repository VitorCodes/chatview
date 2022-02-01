import React from 'react'
import styles from './styles.scss'
import Waves from '../../components/waves'

const NotFound = () => {
  return (
    <section className={styles['not-found']}>
      <h1>404</h1>
			<h3>Page Not Found</h3>
			<Waves style={{ minHeight: '20vh' }} />
    </section>
  )
}

export default NotFound
