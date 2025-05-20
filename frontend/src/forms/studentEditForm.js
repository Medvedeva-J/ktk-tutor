import React, { useState } from "react";
import CustomButton from "../components/customButton";
import CustomInput from "../components/customInput";
import useGlobal from "../store";
import { useFieldChange } from "../hooks/useFieldChange";
import { putStudent } from "../api/api";

export default function StudentEditForm(props) {
  const [ globalState, globalActions ] = useGlobal();

  const [isError, setIsError] = useState(false)
  const [studentData, setStudentData] = useState(props.studentData)


  function handleSubmit(e) {
      e.preventDefault()
      putStudent(studentData)
  }

  const handleChange = useFieldChange(setStudentData)

  return(
    <form className="student-edit-form">
        <CustomInput
        placeholder="Имя" 
        type="text" 
        name="name" 
        id="name" 
        value={studentData.name}
        onChange={handleChange('name')}    
        />

        <CustomInput
        placeholder="Фамилия"
        type="text" 
        name="lastname" 
        id="lastname" 
        value={studentData.lastname}
        onChange={handleChange('lastname')}  
        />

        <CustomButton className="primary" style={{justifyContent:"center", width:"400px"}} text='Сохранить' onClick={handleSubmit}  />
      </form>
  )
}
