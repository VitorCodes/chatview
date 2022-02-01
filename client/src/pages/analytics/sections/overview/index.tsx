import React, { ReactElement } from 'react'
import styles from './styles.scss'
import {
  formatDate,
  formatDuration,
  withCommas,
} from '../../../../utils/formatters'
import { Date, Duration } from '../../../../utils/types'
import Icon from '../../../../assets/svg'

type OverviewProps = {
  start_date: Date
  end_date: Date
  duration: Duration
  total_messages: number
  total_emojis: number
  total_links_shared: number
  photos: number
  reactions: number
}

const Overview = (props: OverviewProps) => {
  const {
    start_date,
    end_date,
    duration,
    total_messages,
    total_emojis,
    total_links_shared,
    photos,
    reactions,
  } = props

  const entities = [
    { name: 'Messages', total: total_messages, icon: Icon.Chat },
    { name: 'Emojis', total: total_emojis, icon: Icon.Emoji },
    { name: 'Reactions', total: reactions, icon: Icon.Heart },
    { name: 'Photos', total: photos, icon: Icon.Image },
    { name: 'Links', total: total_links_shared, icon: Icon.Link },
  ]

  const renderEntitySummary = (
    entityName: string,
    total: number,
    icon?: string,
  ): ReactElement => {
    return (
      <div
        key={`entity-${entityName}`}
        className={styles['analytics-overview__entities-entity']}
      >
        <img src={icon} />
        <h2>{withCommas(total)}</h2>
        <h3>{entityName}</h3>
      </div>
    )
  }

  return (
    <section className={styles['analytics-overview']}>
      <div className={styles['analytics-overview__chronology']}>
        <h2>
          <span>From </span>
          {formatDate(start_date)}
          <span> to </span>
          {formatDate(end_date)}
        </h2>
        <p>{formatDuration(duration)}</p>
      </div>

      <div className={styles['analytics-overview__entities']}>
        {entities.map(({ name, total, icon }) =>
          renderEntitySummary(name, total, icon),
        )}
      </div>
    </section>
  )
}

export default Overview
