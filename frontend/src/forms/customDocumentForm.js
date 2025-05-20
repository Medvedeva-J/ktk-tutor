import React, { useEffect, useId, useState } from "react";
import CustomButton from "../components/customButton";
import useGlobal from "../store";
import { useFieldChange } from "../hooks/useFieldChange";
import DocumentFilterComponent from "../components/DocumentFilterComponent";
import CustomMultiSelect from "../components/customMultiSelect";
import { createPdf, fetchStudents } from "../api/api";
import { baseUrl } from "../Consts";

const statementFields = {
    name: {label: "Имя", value: "name"},
    lastname: {label: "Фамилия", value: "lastname"},
    patronymic: {label: "Отчество", value: "patronymic"},
    age: {label: "Возраст", value: "age"},
    group: {label: "Группа", value: "group"},
    gender: {label: "Пол", value: "gender"},
}

export default function CustomDocumentForm(props) {
    const documentFields = {
        name: {label: "Имя", value: "name"},
        lastname: {label: "Фамилия", value: "lastname"},
        patronymic: {label: "Отчество", value: "patronymic"},
        birth_date: {label: "Дата рождения", value: "birth_date"},
        group: {label: "Группа", value: "group"},
        age: {label: "Возраст", value: "age"},
        email: {label: "E-mail", value: "email"},
        phone: {label: "Телефон", value: "phone"},
        is_disabled: {label: "Является ли инвалидом", value: "is_disabled"},
        disability_group: {label: "Группа инвалидности", value: "disability_group"},
        disability_category: {label: "Категория инвалидности", value: "disability_category"},
    }
    
    const [ globalState, globalActions ] = useGlobal();
    const [filtersData, setFiltersData] = useState({})
    const [children,setChildren] = useState([]);
    const [nextId,setnextId] = useState(0);
    const [selectedFields, setSelectedeFields] = useState([])

    const handleChange = useFieldChange(setFiltersData)
   
    function handleSubmit(e) {
        e.preventDefault()
        const a = fetchStudents({fields: selectedFields, filters: filtersData}).then(res => {
            createPdf(res).then(blob => {
                const url = URL.createObjectURL(blob);
                props.setPdfUrl(url);
              });
        })
        
    }

    function addFilter(e) {
        e.preventDefault()
        setChildren(old => [...old, 
            <DocumentFilterComponent onChange={handleChange(nextId)} key={nextId} uniqid={nextId} name={Object.values(statementFields)[0].label} removeFilter={removeFilter} fields={statementFields}/>
        ])
        setnextId(nextId + 1)
    }

    function removeFilter(e, id) {
        e.preventDefault()
        setChildren(old => [...old.filter(item => item.key != id)])
    }

  return (
    <form style={{display:"flex", flexDirection:"column", gap:"10px", width:"100%"}}>
        <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"100%"}}>
                <h2 className="header4" style={{margin:"0",  whiteSpace:"nowrap"}}>Включить в отчет поля</h2>
                <CustomMultiSelect getSelectedCallback={setSelectedeFields} data={documentFields}/>
            </div>
        <div style={{display:"flex", height:"fit-content", alignItems:"center", gap:"20px",boxSizing:"border-box"}}>
            <h2 className="header4" style={{margin:"0", whiteSpace:"nowrap"}}>Проверка значений</h2>
            <CustomButton onClick={(e) => addFilter(e)} style={{width:"fit-content", fontWeight:"800", fontSize:'16px'}} text="+"/>
        </div>
        {children.map((child, key) => child)}

        <CustomButton type="submit" onClick={handleSubmit} className="primary" containerStyle={{alignSelf:"flex-end"}} text="Сформировать отчет"></CustomButton>

    </form>
    
  )
}
