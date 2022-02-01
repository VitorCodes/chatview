import React, { useEffect, useState } from 'react'
import styles from './styles.scss'
import analyticsStyles from '../../styles.scss'
import chroma from 'chroma-js'
import { Chart, Interval, Tooltip, Axis, Coordinate, Legend } from 'bizcharts'
import { Participant } from '../../../../utils/types'
import { withCommas, shortenName } from '../../../../utils/formatters'
import ChatBubble from '../../../../components/chat-bubble'

type ParticipantMessagesProps = {
  participants: Array<Participant>
  total_messages: number
}

const ParticipantMessages = (props: ParticipantMessagesProps) => {
  const [parentWidth, setParentWidth] = useState(0)
  const { participants, total_messages } = props
  const participantA = {
    name: participants[0].name,
    messages: participants[0].total_messages_sent,
  }
  const participantB = {
    name: participants[1].name,
    messages: participants[1].total_messages_sent,
  }
  const topParticipantMessagesDataset = participants.map((participantData) => ({
    item: participantData.name,
    value: participantData.total_messages_sent,
    percent: participantData.total_messages_sent / total_messages,
  }))

  useEffect(() => {
    const offsetWidth = document.getElementById(
      styles['analytics-participant-messages'],
    ).offsetWidth
    offsetWidth && setParentWidth(offsetWidth)
  }, [document.getElementById(styles['analytics-participant-messages'])])

  const renderParticipantMessagesChart = (
    dataset,
    height: number = parentWidth / 4,
  ) => {
    const colorScale = chroma.scale(['#09A9C8', '#067593'])
    const cols = {
      percent: {
        formatter: (val) => {
          val = val * 100 + '%'
          return val
        },
      },
    }
    const labelLineStyle = {
      lineWidth: 1,
      stroke: '#ffffff44',
    }
    const intervalStyle = {
      fontSize: 11,
      fontWeight: 400,
      fill: 'rgb(240, 240, 240)',
      fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
    }

    return (
      <Chart height={height} data={dataset} scale={cols} autoFit>
        <Coordinate type="theta" radius={1} />
        <Tooltip showContent={false} />
        <Axis visible={false} />
        <Interval
          position="percent"
          adjust="stack"
          color={[
            'item',
            (item) => {
              const i = dataset.findIndex((value) => value.item === item)
              const scaleValue = i / (dataset.length - 1)
              return colorScale(scaleValue).hex()
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: '#055772',
          }}
          label={[
            'value',
            {
              offset: 20,
              labelLine: {
                style: labelLineStyle,
              },
              style: intervalStyle,
              content: ({ item, _, percent }) =>
                `${shortenName(item)}\n${(percent * 100).toFixed(1)}%`,
            },
          ]}
        />
        <Legend visible={false} />
      </Chart>
    )
  }

  const renderTitle = () => {
    let balanceOpinion = ''
    const ratio = topParticipantMessagesDataset
      .map(
        (participantMessages) =>
          `${Math.trunc(participantMessages.percent * 100).toFixed(1)}%`,
      )
      .join(' - ')
    const percent =
      topParticipantMessagesDataset[0].percent < 0.5
        ? 1 - topParticipantMessagesDataset[0].percent
        : topParticipantMessagesDataset[0].percent

    if (percent <= 0.2) balanceOpinion = ` someone's been quiet lately...`
    else if (percent <= 0.4) balanceOpinion = ` someone's clearly taking over.`
    else balanceOpinion = ` we're in perfect balance and harmony!`

    return (
      <div
        className={styles['analytics-participant-messages__title-container']}
      >
        <h2 className={analyticsStyles['section-headline']}>
          How balanced is our communication?
        </h2>
        <p>
          Considering our
          <span> {ratio} </span>
          ratio, I'd say that
          {balanceOpinion}
        </p>
      </div>
    )
  }

  return (
    <section
      id={styles['analytics-participant-messages']}
      className={styles['analytics-participant-messages']}
    >
      {renderTitle()}
      <div className={styles['content-details']}>
        <div className={styles['analytics-participant-messages__summary']}>
          <div
            className={styles['analytics-participant-messages__summary__upper']}
          >
            <ChatBubble variant="primary" arrowDirection="left">
              <p>
                {participantA.name} <span>sent</span>
              </p>
              <h4>{withCommas(participantA.messages)}</h4>
              <span>messages</span>
            </ChatBubble>
          </div>
          <div
            className={styles['analytics-participant-messages__summary__lower']}
          >
            <ChatBubble variant="primary" arrowDirection="right" mode="outline">
              <p>
                {participantB.name} <span>sent</span>
              </p>
              <h4>{withCommas(participantB.messages)}</h4>
              <span>messages</span>
            </ChatBubble>
          </div>
        </div>
        <div className={styles['analytics-participant-messages__chart']}>
          {renderParticipantMessagesChart(topParticipantMessagesDataset)}
        </div>
      </div>
    </section>
  )
}

export default ParticipantMessages
