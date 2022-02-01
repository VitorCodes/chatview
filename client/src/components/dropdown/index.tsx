import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.scss'

type DropdownOption = {
  icon?: string
  text: string
  enabled: boolean
}

type DropdownProps = {
  options: DropdownOption[]
  selectedOption?: DropdownOption
}

const Dropdown = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(
    props.options[0],
  )
  const dropdownRef = useRef<HTMLUListElement>()

  useEffect(() => {
    document.addEventListener('mousedown', clickOutsideHandler)
    return () => document.removeEventListener('mousedown', clickOutsideHandler)
  }, [isOpen])

  const clickOutsideHandler = (e: MouseEvent) =>
    isOpen &&
    dropdownRef.current &&
    !dropdownRef.current.contains(e.target as Node) &&
    setIsOpen(false)

  const setOption = (option: DropdownOption) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  const onOptionClick = (option: DropdownOption) =>
    option.enabled && setOption(option)

  return (
    <div className={styles['dropdown']}>
      <div
        className={styles['dropdown__btn']}
        onClick={setIsOpen.bind(this, true)}
      >
        {selectedOption.icon && <img src={selectedOption.icon} />}
        <span>{selectedOption.text}</span>
        <div className={styles['arrow-down']} />
      </div>
      {isOpen && (
        <ul className={styles['dropdown__menu']} ref={dropdownRef}>
          {props.options.map((option, index) => (
            <li
              key={`${option.text}-${index}`}
              onClick={onOptionClick.bind(this, option)}
              className={
                styles[
                  !option.enabled
                    ? 'dropdown__menu--option-disabled'
                    : 'dropdown__menu--option-enabled'
                ]
              }
            >
              {option.icon && <img src={option.icon} />}
              <span>{option.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
