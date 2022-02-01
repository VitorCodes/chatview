import React from 'react'
import styles from './styles.scss'
import Sections from './sections'

const Home = () => (
  <section className={styles['home']}>
    <Sections.Hero />
    <Sections.GetStarted />
    <Sections.Footer />
  </section>
)

export default Home
