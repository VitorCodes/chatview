import React, { ReactNode } from 'react'
import styles from './styles.scss'

type RibbonProps = {
  children?: ReactNode
}

const Ribbon = (props: RibbonProps) => (
  <div className={styles['ribbon']}>
    <div className={styles['ribbon__container']}>
      <div className={styles['ribbon__container-inner']}>{props.children}</div>
    </div>
  </div>
)

export default Ribbon
