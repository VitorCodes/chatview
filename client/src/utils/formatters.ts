import { Date, Duration } from './types'

export const withCommas = (number: number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const daySuffix = (day: number): string => {
  if (day > 3) return 'th'

  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export const formatDate = (date: Date): string => {
  const { year, month, day } = date
  const monthString = new Date(year, month - 1, day).toLocaleString('default', {
    month: 'long',
  })
  return `${monthString} ${day}${daySuffix(day)} ${year}`
}

export const formatDateString = (
  date: string,
  sourceDelimiter: string = '-',
  targetDelimiter: string = '/',
): string => {
  const split = date.split(sourceDelimiter)
  const temp = split[0]

  // Swap year with day
  split[0] = split[2]
  split[2] = temp

  // Adds leading zeros to day and month
  if (Number(split[0]) < 10) split[0] = `0${split[0]}`
  if (Number(split[1]) < 10) split[1] = `0${split[1]}`

  return `${split.join(targetDelimiter)}`
}

export const shortenName = (fullName: string) => {
  const split = fullName.split(' ')
  const name = split[0]
  const surnameInitial =
    split.length > 1 ? `${split[split.length - 1][0]}.` : ''
  return `${name} ${surnameInitial}`
}

export const firstName = (fullName: string) => {
  return fullName.split(' ')[0]
}

export const firstAndLastName = (fullName: string) => {
  const split = fullName.split(' ')
  const name = split[0]
  const surname = split.length > 1 ? split[split.length - 1] : ''
  return `${name} ${surname}`
}

export const formatDuration = (duration: Duration): string => {
  const { years, months, days, hours, minutes, seconds } = duration
  return `(${years} years, 
        ${months} months,
        ${days} days,
        ${hours} hours,
        ${minutes} minutes,
        ${seconds} seconds)`
}

export const timestampToDate = (
  timestamp: number,
  breakLine: boolean = true,
): string => {
  const date = new Date(timestamp)
  const splitDate = date.toISOString().split('T')[0].split('-')
  const year = splitDate[0]
  const month = date.toLocaleString('default', { month: 'short' })
  let day = `${Number(splitDate[2])}`
  day = day.length === 1 ? `0${day}` : day
  return `${day} ${month}${breakLine ? '\n' : ''}${year}`
}

export const formatHour = (hour: number): string => `${hour}h`

export const withKs = (value: number): string => {
  if (value >= 1000) {
    let withDecimals = (value / 1000).toFixed(1)

    if (withDecimals[withDecimals.length - 1] === '0') {
      withDecimals = withDecimals.substr(0, withDecimals.length - 2)
    }

    return `${withDecimals}k`
  }

  return `${value}`
}
