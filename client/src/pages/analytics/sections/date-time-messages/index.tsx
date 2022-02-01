import React from 'react'
import styles from './styles.scss'
import analyticsStyles from '../../styles.scss'
import { Chart, Interval, Tooltip, Axis, Coordinate } from 'bizcharts'
import { Padding, TimeMessage } from '../../../../utils/types'
import {
  withCommas,
  timestampToDate,
  withKs,
  formatHour,
  formatDateString,
} from '../../../../utils/formatters'

type DateTimeMessagesProps = {
  avg_messages_per_day: number
  top_messages_per_day: Array<Array<any>>
  weekday_messages: TimeMessage
  hour_messages: TimeMessage
}

const DateTimeMessages = (props: DateTimeMessagesProps) => {
  const {
    top_messages_per_day,
    avg_messages_per_day,
    weekday_messages,
    hour_messages,
  } = props

  const daysToDataset = (days) => {
    return days
      .map((array) => ({
        day: array[0],
        messages: array[1],
      }))
      .sort(
        (dayA, dayB) =>
          new Date(dayA.day).getTime() - new Date(dayB.day).getTime(),
      )
  }

  const weekdayMessagesToDataset = (weekdayMessages) => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return Object.keys(weekdayMessages).map((weekdayMessage, index) => ({
      weekday: weekdays[weekdayMessage],
      messages: weekdayMessages[index],
    }))
  }

  const hourMessagesToDataset = (hourMessages) => {
    return Object.keys(hourMessages).map((hour, index) => ({
      hour,
      messages: hourMessages[index],
    }))
  }

  const renderBarChart = (
    dataset,
    xKey: string,
    yKey: string,
    transpose: boolean,
    tickInterval?: number,
    height: number = 300,
    width: number = 400,
    padding?: Padding,
  ) => {
    const anchorSize = transpose ? height : width
    const intervalSize = Math.trunc((anchorSize / dataset.length) * 0.9)
    const axisStyle = {
      fontSize: 12,
      fill: '#fff',
      fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
    }

    const intervalStyle = {
      fill: '#09A9C8',
    }

    const tooltipStyle = {
      'g2-tooltip-title': { color: '#333', fontWeight: 'bold' },
      'g2-tooltip-name': { color: '#333' },
      'g2-tooltip-value': { color: '#aa3aff', fontWeight: 'bold' },
      'g2-tooltip-marker': { display: 'none' },
    }

    return (
      <Chart
        height={height}
        width={width}
        data={dataset}
        autoFit
        padding={padding}
        scale={{
          messages: {
            formatter: (data: number) => withKs(data),
            type: 'linear',
            tickInterval,
          },
          hour: {
            formatter: (data: number) => formatHour(data),
          },
          day: {
            type: 'timeCat',
            formatter: (data: number) => timestampToDate(data),
          },
        }}
      >
        <Coordinate transpose={transpose} />
        <Tooltip showTitle={true} domStyles={tooltipStyle} />
        <Interval
          size={intervalSize}
          position={`${xKey}*${yKey}`}
          style={intervalStyle}
        />
        <Axis name={xKey} label={{ style: axisStyle }} />
        <Axis name={yKey} label={{ style: axisStyle }} />
      </Chart>
    )
  }

  const renderBusiestHour = () => {
    let max = {
      hour: null,
      messages: null,
    }

    for (let i = 0; i < Object.keys(hour_messages).length; i++) {
      const hour = Object.keys(hour_messages)[i]
      const messages = hour_messages[Object.keys(hour_messages)[i]]

      if (!max.messages || max.messages < messages) {
        max = { hour, messages }
      }
    }

    if (max.hour < 10) max.hour = `0${max.hour}`
    return (
      <>
        <h1>{max.hour}:00</h1>
        <h2>is the busiest hour with</h2>
        <h2>
          <span>{withCommas(max.messages)} </span>
          messages
        </h2>
      </>
    )
  }

  const renderAvgMessages = () => (
    <>
      <h1>{avg_messages_per_day}</h1>
      <h2>average messages sent</h2>
      <h2>on a daily basis</h2>
    </>
  )

  const renderBusiestDay = () => {
    let max = {
      date: null,
      messages: null,
    }

    for (let i = 0; i < top_messages_per_day.length; i++) {
      const date = formatDateString(top_messages_per_day[i][0])
      const messages = top_messages_per_day[i][1]

      if (!max.messages || max.messages < messages) {
        max = { date, messages }
      }
    }

    return (
      <>
        <h1>{max.date}</h1>
        <h2>was the busiest day with</h2>
        <h2>
          <span> {withCommas(max.messages)} </span>messages
        </h2>
      </>
    )
  }

  return (
    <section
      id="analytics-date-time-messages"
      className={styles['analytics-date-time-messages']}
    >
      <h2 className={analyticsStyles['section-headline']}>
        When do we chat the most?
      </h2>
      <div className={styles['analytics-date-time-messages__content-details']}>
        <div className={styles['analytics-date-time-messages__summary']}>
          {renderAvgMessages()}
        </div>
        <div className={styles['analytics-date-time-messages__chart']}>
          {renderBarChart(
            weekdayMessagesToDataset(weekday_messages),
            'weekday',
            'messages',
            true,
            null,
            200,
            500,
          )}
        </div>
      </div>
      <div className={styles['analytics-date-time-messages__content-details']}>
        <div className={styles['analytics-date-time-messages__summary']}>
          {renderBusiestHour()}
        </div>
        <div className={styles['analytics-date-time-messages__chart']}>
          {renderBarChart(
            hourMessagesToDataset(hour_messages),
            'hour',
            'messages',
            false,
            null,
            300,
            500,
          )}
        </div>
      </div>
      <div className={styles['analytics-date-time-messages__content-details']}>
        <div className={styles['analytics-date-time-messages__summary']}>
          {renderBusiestDay()}
        </div>
        <div className={styles['analytics-date-time-messages__chart']}>
          {renderBarChart(
            daysToDataset(top_messages_per_day),
            'day',
            'messages',
            false,
            null,
            200,
            500,
          )}
        </div>
      </div>
    </section>
  )
}

export default DateTimeMessages
