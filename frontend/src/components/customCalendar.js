import { datesAreEqual } from "../layouts/calendarPage.js"
import { createDate } from "../utils/createDate.js"
import { createMonth, getMonthLength } from "../utils/createMonth.js"
import "../components/Components.css"
import React, { useState } from "react"
import Icons from "../icons/icons.js"
import CustomButton from "./customButton.js"

function CustomCalendar(props) {
    const useC = props.useC
    const events = props.events
    return (
        <div className="calendar">
            <div style={{display:"flex", flexDirection:"row", gap:"20px"}}>
                <h1 className="header1">Календарь</h1>
                <div className="calendar-header">
                    <CustomButton onClick={() => useC.prevMonth()} className="transparent"
                        icon={<Icons name="chevronLeft" size={16} color="var(--dark-blue)" className="small"/>}/>
                    <span style={{width:"140px", textAlign:"center"}}>{useC.selectedMonth.monthName} {useC.selectedYear}</span>
                    <CustomButton onClick={() => useC.nextMonth()} className="transparent"
                        icon={<Icons name="chevronLeft" size={16} style={{transform:"rotate(180deg)"}} color="var(--dark-blue)" className="small"/>}/>
                </div>
            </div>

            <div className="weekdays-names">
                {useC.weekdaysNames.map(item => (
                    <span>{item.weekdayShort}</span>))}
            </div>

            <div ref={props.ref} className="calendar-body">
                {useC.calendarDays.map((day, i) => (
                    <div onClick={() => useC.handleClick(day.date)}
                    className={"calendar-tile " + (
                        day.monthIndex != useC.selectedMonth.monthIndex ? "tile-secondary" : "")}>
                        <span className="body6">{day.day}</span>

                        <div className="tile-events-div">
                            {events.filter((event, i) => datesAreEqual(event.date, day.date)).map((event, i) => (
                                <div className="tile-event-item body6" onClick={() => {
                                    props.setEventData(event)
                                    props.setModalIsOpen(true)
                                }}>
                                    <span>{event.name}</span>
                                    <span>{event.time.slice(0, -3)}</span>
                                </div>))}</div>
                    </div>))}
            </div>
        </div>)
}

function useCalendar(date, locale, firstWeekdayIndex=0) {
    const [selectedDay, setSelectedDate] = useState(createDate({date: date}))
    const [selectedMonth, setMonth] = useState(createMonth(new Date(selectedDay.year, selectedDay.monthIndex)))
    const [selectedYear, setYear] = useState(selectedDay.year)

    const monthsNames = React.useMemo(() => getMonthNames(locale), [])
    const weekdaysNames = React.useMemo(() => getWeekdaysNames(firstWeekdayIndex, locale), [])
    const days = React.useMemo(() => selectedMonth.createMonthDays(), [selectedMonth, selectedYear])
    const calendarDays = React.useMemo(() => {
        const daysinMonth = getMonthLength(selectedMonth.monthIndex)
        
        const prevMonthDays = createMonth({ date: new Date(selectedYear, selectedMonth.monthIndex - 1)}).createMonthDays()
        const nextMonthDays = createMonth({date: new Date(selectedYear, selectedMonth.monthIndex + 1)}).createMonthDays()

        const firstDay = days[0]
        const lastDay = days[daysinMonth - 1]

        const daysInPrevMonth = firstDay.weekdayIndex - firstWeekdayIndex < 0 ? 7 - (firstWeekdayIndex - firstDay.weekdayIndex) : firstDay.weekdayIndex - firstWeekdayIndex
        const daysInNextMonth = 7 - (lastDay.weekdayIndex + 1)

        const result = []
        for (let i = 0; i < daysInPrevMonth; i += 1) {
            result.push(prevMonthDays[prevMonthDays.length - daysInPrevMonth + i])
        }
        for (let i = 0; i < days.length; i += 1) {
            result.push(days[i])
        }
        for (let i = 0; i < daysInNextMonth; i += 1) {
            result.push(nextMonthDays[i])
        }
        return result
    }, [selectedMonth.year, selectedMonth.monthIndex, selectedYear])

    const nextMonth = () => {
        if (selectedMonth.monthIndex == 11) {
            setYear(selectedYear + 1)
            setMonth(createMonth({date: new Date(selectedMonth.year, 0)}))
        } else {
            setMonth(createMonth({date: new Date(selectedMonth.year, selectedMonth.monthIndex + 1)}))
        }
        setSelectedDate(createDate({date: new Date(selectedYear, selectedMonth.monthIndex, 1)}))

    }

    const prevMonth = () => {
        if (selectedMonth.monthIndex == 0) {
            setYear(selectedYear - 1)
            setMonth(createMonth({date: new Date(selectedMonth.year, 11)}))
        } else {
            setMonth(createMonth({date: new Date(selectedMonth.year, selectedMonth.monthIndex - 1)}))
        }
        setSelectedDate(createDate({date: new Date(selectedYear, selectedMonth.monthIndex, 1)}))

    }

    const handleClick = (newDate) => {
        setSelectedDate(createDate({date: newDate}))
    }

    return {
        prevMonth,
        nextMonth,
        handleClick, 
        selectedMonth,
        selectedDay,
        selectedYear,
        weekdaysNames,
        monthsNames,
        calendarDays
    }
}

function getMonthNames() {
    const monthsNames = Array.from({length:12})

    const d = new Date()
    monthsNames.forEach((_, i) => {
        const { month, monthIndex, monthShort, date } = createDate({
            locale:"default",
            date: new Date(d.getFullYear(), d.getMonth() + i, 1)
          });
      
        monthsNames[monthIndex] = { month, monthIndex, monthShort, date };
    })

    return monthsNames
}

function getWeekdaysNames(firstWeekday) {
    const weekdaysNames = Array.from({length:7})

    const d = new Date()
    weekdaysNames.forEach((_, i) => {
        const { weekday, weekdayIndex, weekdayShort} = createDate({
            date: new Date(d.getFullYear(), d.getMonth(), d.getDay() + i)
          });
      
        weekdaysNames[weekdayIndex] = { weekday, weekdayIndex, weekdayShort };
    })

    return [...weekdaysNames.slice(firstWeekday), ...weekdaysNames.slice(0, firstWeekday)]
}

export {CustomCalendar, useCalendar}