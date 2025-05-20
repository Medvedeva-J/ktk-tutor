import React, { useEffect } from "react";
import CustomButton from "../../components/customButton";
import CustomToggleGroup from "../../components/customToggleGroup";
import { useParams } from "react-router-dom";
import { StudentAbout } from "./studentAbout";
import { StudentGrades } from "./studentGrades";
import { StudentHealth } from "./studentHealth";
import { StudentFamily } from "./studentFamily";
import { useState } from "react";
import { fetchFamily, fetchHealth, fetchStudent, isValid, putFamily, putHealth, putStudent, updateStudentProfile } from "../../api/api";
import router from "../../AppRoutes";
import { useFieldChange } from "../../hooks/useFieldChange";
import Icons from "../../icons/icons";
import { Modal } from "../../components/Modal";
import useGlobal from "../../store";

function StudentProfile() {
    const [globalState, globalActions] = useGlobal()
    const toggleData = [
        {   id: "about",
            name: "О студенте"
        },
        {   id: "health",
            name: "Здоровье"
        },
        {   id: "family",
            name: "Семья"
        },
        {   id: "grades",
            name: "Успеваемость"
        },
    ]

    const {id}= useParams()
    const [isEdit, setIsEdit] = useState(false)
    const [studentData, setStudentData] = useState({})
    const [familyData, setFamilyData] = useState(null)
    const [healthData, setHealthData] = useState(null)
    const [profilePage, setProfilePage] = useState("about")
    const [showError, setShowError] = useState(false)
    const [errors, setErrors] = useState()
    const [fullName, setFullName] = useState("") 

    const handleChange = (e) => {
        setProfilePage(e.target.value)
    }

    const handleStudentChange = useFieldChange(setStudentData)
    const handleHealthChange = useFieldChange(setHealthData)

    useEffect(() => {
        async function setupStudent(){
            const student = await fetchStudent(id);
            setStudentData(
                student
            )
            setFullName(`${student.name} ${student.lastname}`)
            const fam = await fetchFamily(id)
            setFamilyData(fam)

            const health = await fetchHealth(id)
            setHealthData(health[0])
         }
         setupStudent();
         
    }, [])

    useEffect(() => {
        if (showError) {
            setTimeout(() => setShowError(false), 3000)
        }
    }, [showError]);


    const handleSubmit = async () => {

        setShowError(false)
            const oldData = {...studentData}
            const data = Object.fromEntries(
            Object.entries(studentData).filter(([key]) => key !== "verbose")
            );

            const famData = familyData.map(item => (
                Object.fromEntries(
                    Object.entries(item).filter(([key]) => key !== "verbose")
                    )
                ))

            let health = null
            if (healthData != null) {
                health = Object.fromEntries(
                Object.entries(healthData).filter(([key]) => key !== "verbose")
                );
            }   
            
            try {
                await updateStudentProfile(data.id, data, famData, health)
                setIsEdit(false)
                setFullName(`${data.name} ${data.lastname}`)
                setErrors(null)
            } catch (error) {
                const data = await error
                setErrors(data.errors)
            }
    }

    

    return (
        <div className="app-body">
            <div className="body-header">
                <CustomButton style={{padding:"5px"}} onClick={() => router.navigate(-1)} className="transparent"
                icon={<Icons name="chevronLeft" size={24} color="var(--dark-blue)" className="big"/>}/>
                <h1 className="header3">{fullName}</h1>

                {isEdit ? 
                <CustomButton onClick={() => {handleSubmit()}} className="primary body5" text="Сохранить"></CustomButton> : 
                <CustomButton onClick={() => (setIsEdit(true))} className="secondary body5" text="Редактировать"></CustomButton>
            }    
            </div>

            <div style={{display:"flex", flexDirection:"column", justifySelf:"stretch", height:"100%", minWidth:"fit-content", width:"auto"}}>
                <CustomToggleGroup value={profilePage} data={toggleData} exclusive onChange={handleChange}/>

                <div className="several-pages-body">
                    {profilePage == "about"? <StudentAbout data={studentData} isEdit={isEdit} callback={handleStudentChange}/> : <></>}
                    
                    {profilePage == "grades"? <StudentGrades data={studentData.id} isEdit={isEdit}/> : <></>}

                    {profilePage == "health" ? <StudentHealth data={healthData} isEdit={isEdit} callback={handleHealthChange}/> : <></>}

                    { profilePage == "family" ? <StudentFamily data={familyData} isEdit={isEdit} callback={setFamilyData} studentId={studentData.id}/> : <></> }
                </div>

            </div>

           { errors ? 
                <Modal style={{zIndex:"10000", position:"fixed", right:"20px", bottom:"20px"}}
                content={
                    <div>
                        {Object.keys(errors).map((key) => 
                        <p>
                            <span className='highlight'>{key}</span>
                            : {errors[key]}
                        </p>)}
                    </div>
                }/> :
                null
            }          
        </div>
    )
}



export {StudentProfile}