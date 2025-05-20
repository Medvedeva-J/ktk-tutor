export function createDate(params) {
    const locale = params?.locale ?? "default"
    
    const date = params?.date ?? new Date()
    const day = date.getDate()
    const weekday = date.toLocaleDateString(locale, {weekday: "long"})
    const weekdayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
    const weekdayShort = date.toLocaleDateString(locale, {weekday: "short"})
    const year = date.getFullYear()
    const yearShort = date.toLocaleDateString(locale, {year: "2-digit"})
    const month = date.toLocaleDateString(locale, {month: "long"})
    const monthShort = date.toLocaleDateString(locale, {month: "short"})
    const monthNumber = date.getMonth() + 1
    const monthIndex = date.getMonth()
    const timeStamp = date.getTime()
    const week = getWeekNumber(date)

    return {
        date,
        day,
        weekday,
        weekdayIndex,
        weekdayShort,
        year,
        yearShort,
        month,
        monthShort,
        monthNumber,
        monthIndex,
        timeStamp,
        week
    }
}

function getWeekNumber(d) {
    const firstDay = new Date(d.getFullYear(), 0, 1)
    const pastDays = (d.getTime() - firstDay.getTime()) / 86400000;
    return Math.ceil(pastDays + firstDay.getDay() + 1)
}