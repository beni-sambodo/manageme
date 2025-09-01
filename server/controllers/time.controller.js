class timeController {
  async getCurrentMonthDates(dates) {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const currentMonthDates = dates.filter((dateString) => {
      const date = new Date(dateString)
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      )
    })

    return currentMonthDates
  }

  async totalDates(dates) {
    const today = new Date()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1)

    const filteredDates = dates.filter((dateStr) => {
      const date = new Date(dateStr)
      return date >= today && date <= endOfMonth
    })

    return filteredDates
  }

  async endDates(dates) {
    const now = new Date()

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return dates.filter((dateStr) => {
      const date = new Date(dateStr)

      return date >= startOfMonth && date <= endOfMonth && date < now
    })
  }
}

const TimeController = new timeController()

export default TimeController
