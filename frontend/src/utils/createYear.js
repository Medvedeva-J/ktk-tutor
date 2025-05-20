import { createDate } from "./createDate"
import { createMonth } from "./createMonth"

export function createYear(params) {
    const locale = params?.locale ?? "default"

    const monthCount = 12
    const today = createDate()
    
    const year = params?.year ?? today.year;
    const monthNumber = params?.monthNumber ?? today.monthNumber;
    const month = createMonth({date: new Date(year, monthNumber - 1), locale: locale})

    const getMonthDays = (monthIndex) => {
        return createMonth({date: new Date(year, monthIndex), locale: locale}).createMonthDays()
    }

    const createAllMonths = () => {
        const months = []
        for (let i = 0; i < monthCount; i += 1) {
            months[i] = getMonthDays(i)
        }

        return months
    }

    return {
        createAllMonths,
        month, 
        year,
        today
    }
}