import React, { useState } from 'react'
import styles from './styles.scss'
import Steps, { StepImagePosition } from './steps'

const GetStarted = () => {
  const [selectedStep, setSelectedStep] = useState(0)

  const getImgPositionStyle = (imagePosition: StepImagePosition) => {
    switch (imagePosition) {
      case 'top-left':
        return {
          top: 0,
          left: 0,
        }
      case 'top-right':
        return {
          top: 0,
          right: 0,
        }
      case 'top-center':
        return {
          top: 0,
          left: 0,
          right: 0,
          margin: 'auto',
        }
      case 'center-right':
        return {
          top: 0,
          bottom: 0,
          right: 0,
        }
      case 'bottom-left':
        return {
          bottom: 0,
          left: 0,
        }
      case 'bottom-right':
        return {
          bottom: 0,
          right: 0,
        }
      case 'bottom-center':
        return {
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
        }
      default:
        return {}
    }
  }

  return (
    <>
      <section className={styles['get-started']}>
        <section className={styles['get-started__illustrations']}>
          {Steps.messenger[selectedStep].images.map((img, index) => {
            return (
              <img
                key={`s-${selectedStep}-${index}`}
                src={img.url}
                style={{
                  position: 'absolute',
                  width: img.width,
                  height: img.height,
                  ...getImgPositionStyle(img.position),
                  ...img.customStyle,
                }}
              />
            )
          })}
        </section>

        <section className={styles['get-started__steps']}>
          <h3>HOW IT WORKS</h3>
          <h2>Get started easily.</h2>

          <ol>
            {Steps.messenger.map((step, index) => {
              return (
                <li
                  key={`step-${index}`}
                  onClick={() => setSelectedStep(index)}
                  className={
                    styles[
                      index === selectedStep
                        ? 'get-started__steps__step-container--selected'
                        : 'get-started__steps__step-container'
                    ]
                  }
                >
                  <button>
                    <span>{index + 1}</span>
                  </button>
                  <span>{step.text}</span>
                </li>
              )
            })}
          </ol>
        </section>
      </section>
    </>
  )
}

export default GetStarted
