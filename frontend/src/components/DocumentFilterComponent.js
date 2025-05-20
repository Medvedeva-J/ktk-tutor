import React, { useState } from "react"
import CustomSelect from "./customSelect"
import CustomInput from "./customInput"
import { useFieldChange } from "../hooks/useFieldChange"

const statements = {
    exact: {label: "равно", value: "exact"},
    gt: {label: "больше", value: "gt"},
    lt: {label: "меньше", value: "lt"},
    gte: {label: "больше или равно", value: "gte"},
    lte: {label: "меньше или равно", value: "lte"},
    exclude: {label: "не равно", value: "exclude"},
    icontains: {label: "содержит", value: "icontains"},
}

export default function DocumentFilterComponent (props) {
    const [value, setValue] = useState({
        "field": Object.keys(props.fields)[0],
        "statement": Object.keys(statements)[0],
        "compare-to": ""
    })

    const handleChange = useFieldChange(setValue)

    var fieldSelector = <CustomSelect id="field" name="field" onChange={handleChange('field')} values={props.fields}/>
    const statementSelector = <CustomSelect id="statement" name="statement" onChange={handleChange('statement')} values={statements}/>
    const compareToInput = <CustomInput id="compare-to" name="compare-to" onChange={handleChange('compare-to')} value={value["compare-to"]} hint="Значение" ></CustomInput>

    return (<div onChange={props.onChange(value)} className="document-filter-component-body">
                <div style={{display:"flex", alignItems:"center", gap:"20px"}}>
                    {fieldSelector}
                    {statementSelector}
                    {compareToInput}
                </div>

                <svg onClick={(e) => {props.removeFilter(e, props.uniqid)}} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12" stroke="#1B3B6E" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 4L12 12" stroke="#1B3B6E" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>)
}