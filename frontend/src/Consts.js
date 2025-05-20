import { fetchChoice } from "./api/api"

const pages = ["profile", "calendar", "documents", "students"]

const personalInfo = ["Фамилия", "Имя", "Отчество",
    "Дата рождения", "Телефон", "Электронная почта", "СНИЛС"]


const monthsGenitiveCase = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

const baseUrl = "http://localhost:8000/" 

const studentDataFormFields = {
    name: {
        type:"text",
        max_length: 100
        },
    lastname: {
        type:"text",
        max_length: 100
        },
    patronymic: {
        type:"text",
        max_length: 100
        },
    birth_date: {
        type:"date"
        },
    registration_address: {
        type:"text",
        max_length: 50
        },
    residential_address: {
        type:"text",
        max_length: 50
        },
    gender: {
        type:"select",
        values: await fetchChoice("Gender")
    },
    email: {
        type:"text",
        max_length: 30
        },
    phone: {
        type:"text",
        max_length: 20
        },
    insurance_number: {
        type:"text",
        max_length: 20
        },
}

const healthFormFields = {
    disability_group: {
        type:"select",
        values: await fetchChoice("DisabilityGroup")
    },
    disability_category: {
        type: "text",
        max_length: 20
    },
    valid_since: {
        type: "date",
    },
    valid_until: {
        type: "date",
    },
    recommendations: {
        type: "text",
        max_length: 100
    },
    adaptive_program: {
        type: "checkbox",
    },
    disabled: {
        type:"checkbox"
        },
}

const familyDataFields = {
    relation: {
        type:"select",
        values: await fetchChoice("Relation")
    },
    full_name: {
        type: "text",
        max_length: 100
    },
    phone: {
        type: "text",
        max_length: 20
    },
    occupation: {
        type: "text",
        max_length:100
    },
}

const tutorFormFields = {
    name: {
        type:"text",
        max_length: 100
    },
    lastname: {
        type:"text",
        max_length: 100
    },
    patronymic: {
        type:"text",
        max_length: 100
    },
}

const eventFormFields = {
    name: {
        type:"text",
        max_length: 100
    },
    date: {
        type:"date",
    },
    time: {
        type:"time",
    },
    event_type: {
        type:"select",
        values: await fetchChoice("EventType")
    },
    group: {
        type: "select",
        values: []
    },
    student: {
        type: "input-select"
    }
}

export {
    pages, personalInfo, monthsGenitiveCase, baseUrl,
    studentDataFormFields,
    healthFormFields,
    tutorFormFields,
    familyDataFields,
    eventFormFields
}