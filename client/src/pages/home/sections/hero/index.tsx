import React, { useState, useRef } from 'react'
import styles from './styles.scss'
import globalStyles from '../../../../styles/globals.scss'
import axios, { AxiosRequestConfig } from 'axios'
import { useHistory } from 'react-router-dom'
import Dropdown from '../../../../components/dropdown'
import Icon from '../../../../assets/svg'
import Loader from '../../../../components/loader'
import toast, { Toaster } from 'react-hot-toast'
import Waves from '../../../../components/waves'
import { socialNetworkDropdownOptions } from '../../../../constants/social-network'

type ToastId = {
  [id: string]: string
}

const Hero = () => {
  const [files, setFiles] = useState(Array<File>())
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [toastId, setToastId] = useState<ToastId>({})
  const fileInputRef = useRef<HTMLInputElement>()
  const history = useHistory()

  const uploadFiles = () => fileInputRef.current.click()

  const onLoadFiles = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFiles(Array.from(event.target.files))

  const generateAnalytics = () => {
    files.length
      ? postAnalytics()
      : displayErrorToast('You must import at least one file')
  }

  const displayErrorToast = (message: string) => {
    const id = toast.error(message, {
      position: 'top-center',
      duration: 3000,
      style: {
        fontSize: '.9rem',
        fontWeight: 300,
      },
    })
    toastId[message] && toast.remove(toastId[message])
    toastId[message] = id
    setToastId(toastId)
  }

  const postAnalytics = () => {
    const data: FormData = new FormData()
    files.forEach((file: File) => data.append('files', file))

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/api/chat',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    setIsFetching(true)
    axios
      .request(config)
      .then((res) => history.push('/analytics', { data: res.data }))
      .catch(() => displayErrorToast('An error occurred, please try again'))
      .finally(() => setIsFetching(false))
  }

  const formatSelectedFilesLabel = () => {
    switch (files.length) {
      case 0:
        return 'Import files...'
      case 1:
        return `${files.length} file selected`
      default:
        return `${files.length} files selected`
    }
  }

  return (
    <section className={styles['hero']}>
      <Waves />
      <div className={styles['hero-title-container']}>
        <img src={Icon.Chats} />
        <h1>CHATVIEW</h1>
      </div>
      <p>
        Have you ever wanted to get insights of your conversations?
        <br />
        <strong>ChatView</strong> provides data visualizations of your social
        media chat history.
      </p>

      <div className={styles['cta-wrapper']}>
        <div
          className={styles['file-upload-btn-wrapper']}
          onClick={uploadFiles}
        >
          <button className={styles['file-upload-btn']} type="button">
            <span
              className={!files.length && styles['file-upload-placeholder']}
            >
              {formatSelectedFilesLabel()}
            </span>
            <img src={Icon.Upload} />
          </button>
        </div>
        <div className={styles['dropdown-wrapper']}>
          <Dropdown
            options={socialNetworkDropdownOptions}
            selectedOption={socialNetworkDropdownOptions[0]}
          />
        </div>
        <button
          className={globalStyles['main-cta']}
          type="submit"
          onClick={generateAnalytics}
        >
          {isFetching ? <Loader size={2} /> : 'Generate'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        className={styles['hidden']}
        type="file"
        accept="application/JSON"
        multiple
        onChange={onLoadFiles}
      />
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  )
}

export default Hero
