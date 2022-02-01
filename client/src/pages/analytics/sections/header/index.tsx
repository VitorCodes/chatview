import React from 'react'
import styles from './styles.scss'
import Ribbon from '../../../../components/ribbon'
import { Participant } from '../../../../utils/types'

type HeaderProps = {
  participants: Array<Participant>
}

const Header = (props: HeaderProps) => {
  const { participants } = props
  const participantA = participants[0].name
  const participantB = participants[1].name

  return (
    <section className={styles['analytics-header']}>
      <h2>The beautiful story of</h2>
      <div className={styles['analytics-header__participants']}>
        <Ribbon>
          <h1>
            {participantA}
            <span> and </span>
            {participantB}
          </h1>
        </Ribbon>
      </div>
    </section>
  )
}

export default Header
