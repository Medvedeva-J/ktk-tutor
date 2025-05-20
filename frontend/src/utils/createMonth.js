import { createDate } from "./createDate.js"

function createMonth(params) {
    const date = params?.date ?? new Date()
    const locale = params?.locale ?? "default"

    const d = createDate({date, locale})
    const {month: monthName, year, monthNumber, monthIndex} = d
    
    const getDay = (dayNumber) => {
        return createDate({date: new Date(year, monthIndex, dayNumber), locale: locale})
    }

    const createMonthDays = () => {
        const days = [];
        for (let i = 0; i <= getMonthLength(monthIndex, year) - 1; i += 1) {
            days[i] = getDay(i + 1)
        }
        return days
     };

     return {
        getDay,
        monthName,
        monthIndex, 
        monthNumber,
        year,
        createMonthDays
     }
}

function getMonthLength(monthIndex, yearNumber = new Date().getFullYear()) {
    return new Date(yearNumber, monthIndex + 1, 0).getDate()
}

export {
    createMonth,
    getMonthLength
}