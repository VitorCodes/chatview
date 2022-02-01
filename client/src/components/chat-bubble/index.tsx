import React, { ReactNode } from 'react'
import styles from './styles.scss'

type Variant = 'primary' | 'secondary'
type ArrowDirection = 'right' | 'left'
type Mode = 'filled' | 'outline'

type ChatBubbleProps = {
  children?: ReactNode
  variant: Variant
  arrowDirection: ArrowDirection
  scale?: number
  mode: Mode
}

const ChatBubble = (props: ChatBubbleProps) => {
  const { variant, arrowDirection, scale, mode } = props
  const baseBubbleClass = 'chat-bubble__bubble'

  return (
    <div className={styles['chat-bubble']}>
      <div
        className={`
					${styles[baseBubbleClass]} 
					${styles[`${baseBubbleClass}-variant-${variant}`]}
					${styles[`${baseBubbleClass}-${arrowDirection}`]} 
					${styles[`${baseBubbleClass}-${mode}`]}
				`}
        style={{ transform: `scale(${scale})` }}
      />

      <div className={styles['chat-bubble__content']}>{props.children}</div>
    </div>
  )
}

ChatBubble.defaultProps = {
  variant: 'primary',
  arrowDirection: 'right',
  scale: 1,
  mode: 'filled',
}

export default ChatBubble
