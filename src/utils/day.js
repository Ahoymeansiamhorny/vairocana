import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const startFormat = 'YYYY-MM-DDT00:00:00Z'

const endFormat = 'YYYY-MM-DDT23:59:59Z'

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const DATE_TIME_VALUE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'
export function toDate(timestamp = 0, format = 'YY-MM-DD HH:mm') {
  if (timestamp) {
    return dayjs.unix(timestamp).format(format)
  }
  return '-'
}

export const defaultTime = () => [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]

export const today = () => [dayjs().format(startFormat), dayjs().format(endFormat)]
export const thisMonth = () => [
  dayjs().startOf('month').format(startFormat),
  dayjs().endOf('month').format(endFormat)
]

export const dateShortcuts = () => [
  { text: 'Today', value: today() },
  {
    text: 'Yesterday',
    value: () => today().map((i) => dayjs(i).subtract(1, 'day').format(DATE_TIME_VALUE_FORMAT))
  },
  {
    text: 'This Week',
    value: () => [
      dayjs().startOf('week').format(startFormat),
      dayjs().endOf('week').format(endFormat)
    ]
  },
  { text: 'This Month', value: () => thisMonth() },
  {
    text: 'Last Week',
    value: () => [
      dayjs().subtract(1, 'week').startOf('week').format(startFormat),
      dayjs().subtract(1, 'week').endOf('week').format(endFormat)
    ]
  },
  {
    text: 'Last Month',
    value: () => [
      dayjs().subtract(1, 'month').startOf('month').format(startFormat),
      dayjs().subtract(1, 'month').endOf('month').format(endFormat)
    ]
  }
]
