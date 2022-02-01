import React, { useRef } from 'react'
import styles from './styles.scss'
import globalStyles from '../../styles/globals.scss'
import { useHistory } from 'react-router-dom'
import Sections from './sections'
import html2canvas, { Options } from 'html2canvas'
import FileSaver from 'file-saver'

const Analytics = () => {
  const history = useHistory()
  const locationState = history.location.state
  const reportRef = useRef()
  const verticalPadding = 50

  if (!locationState) {
    history.replace('/')
    return <></>
  }

  const data = locationState.data

  const download = () => {
    const report: HTMLElement = reportRef.current
    const options: Partial<Options> = {
      y: verticalPadding,
      height: report.clientHeight,
      backgroundColor: null,
    }

    html2canvas(reportRef.current, options).then((canvasElement) => {
      canvasElement.toBlob((blob) => {
        FileSaver.saveAs(blob, 'chat-report.png')
      })
    })
  }

  return (
    <section
      className={styles['analytics']}
      style={{ padding: `${verticalPadding}px 0` }}
    >
      <section className={styles['analytics__customize']} />
      <section ref={reportRef} className={styles['analytics__report']}>
        <Sections.Header participants={data.participants} />

        <Sections.Overview
          start_date={data.start_date}
          end_date={data.end_date}
          duration={data.duration}
          total_messages={data.total_messages}
          total_emojis={data.total_emojis}
          total_links_shared={data.total_links_shared}
          photos={data.photos}
          reactions={data.reactions}
        />

        <Sections.ParticipantMessages
          participants={data.participants}
          total_messages={data.total_messages}
        />

        <Sections.Emojis
          top_emojis={data.top_emojis}
          different_emojis_used={data.different_emojis_used}
        />

        <Sections.DateTimeMessages
          avg_messages_per_day={data.avg_messages_per_day}
          top_messages_per_day={data.top_messages_per_day}
          weekday_messages={data.weekday_messages}
          hour_messages={data.hour_messages}
        />
      </section>

      <section className={styles['analytics__checkout']}>
        <section className={styles['analytics__checkout-fixed']}>
          <button className={globalStyles['main-cta']} onClick={download}>
            Download
          </button>
        </section>
      </section>
    </section>
  )
}

export default Analytics
