import React, { useEffect, useState } from 'react'
import styles from './styles.scss'
import analyticsStyles from '../../styles.scss'
import chroma from 'chroma-js'
import { Chart, Interval, Tooltip, Axis, Coordinate, Legend } from 'bizcharts'
import { withCommas } from '../../../../utils/formatters'

type EmojisProps = {
  top_emojis: Array<Array<any>>
  different_emojis_used: number
}

const Emojis = (props: EmojisProps) => {
  const [parentWidth, setParentWidth] = useState(0)
  const { top_emojis, different_emojis_used } = props

  useEffect(() => {
    const offsetWidth = document.getElementById(styles['analytics-emojis'])?.offsetWidth
    offsetWidth && setParentWidth(offsetWidth)
  }, [document.getElementById(styles['analytics-emojis'])])

  const arraysToDataset = (arrays, sum?: number) => {
    return arrays.map((array) => ({
      item: array[0],
      value: array[1],
      percent: array[1] / sum,
    }))
  }

  const renderChart = (dataset, height: number = parentWidth / 3) => {
    const colorScale = chroma.scale([
      '#09A9C8',
      '#067593',
      '#055772',
      '#001F3D',
    ])
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
      fill: 'rgb(230, 230, 230)',
      fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
    }

    return (
      <Chart height={height} data={dataset} scale={cols} autoFit>
        <Coordinate type="theta" radius={0.75} />
        <Tooltip showContent={false} />
        <Axis visible={false} />
        <Interval
          position="percent"
          adjust="stack"
          color={[
            'item',
            (item) =>
              colorScale(
                dataset.find((value) => value.item === item).percent,
              ).hex(),
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
              content: ({ item, value, percent }) =>
                `${item} ${withCommas(value)} (${(percent * 100).toFixed(1)}%)`,
            },
          ]}
        />
        <Legend visible={false} />
      </Chart>
    )
  }

  const hasEmojis = () => top_emojis.length && top_emojis[0].length

  return hasEmojis() && (
    <section
      id={styles['analytics-emojis']}
      className={styles['analytics-emojis']}
    >
      <div className={styles['analytics-emojis__title-container']}>
        <h2 className={analyticsStyles['section-headline']}>
          And we don't only express ourselves verbally...
        </h2>
        <p>
          In our conversation, we used
          <span> {different_emojis_used} </span>
          different Emojis
        </p>
      </div>

      <div className={styles['content-details']}>
        <div className={styles['analytics-emojis__chart']}>
          {renderChart(
            arraysToDataset(
              top_emojis,
              top_emojis.reduce((acc, emoji) => acc + emoji[1], 0),
            ),
          )}
        </div>
        <div className={styles['analytics-emojis__fav-emoji']}>
          <p>
            With
            <span> {withCommas(top_emojis[0][1])} </span>
            appearances:
          </p>
          <h1>{top_emojis[0][0]}</h1>
          <p>
            was our
            <span> favourite </span>
            Emoji
          </p>
        </div>
      </div>
    </section>
  )
}

export default Emojis
