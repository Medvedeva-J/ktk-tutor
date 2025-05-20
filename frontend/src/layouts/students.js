import React, { useState, useEffect, useContext } from "react";
import {UserContext} from '../App';
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CustomInput from '../components/customInput';
import CustomToggleGroup from '../components/customToggleGroup';
import {StudentProfile} from "./studentProfile/studentProfile";
import CustomButton from '../components/customButton';
import { baseUrl } from '../Consts';
import { fetchGroups, fetchMajor, fetchStudents } from "../api/api";
import useGlobal from "../store";
import router from "../AppRoutes";

export default function Students() {
    return (
        <>
        <Routes>
                <Route path="student/:id" element={<StudentProfile/>} />
                <Route path="" element={StudentsList()} />
        </Routes></>
    )
}

function StudentsList() {
    const [globalState, globalActions] = useGlobal()

    
    const [students, setStudents] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState("")
    const [majorName, setMajorName] = useState(null)

    async function setupGroups(){
        const groups = await fetchGroups(globalState.user);
        setGroups(groups)
        const group = groups[0]? groups[0] : null
        setSelectedGroup(group)
        let major = group? await fetchMajor(group.major) : null
        setMajorName(major?.name)
    }
    
    async function setupStudents(group){
        const students = group ? await fetchStudents({"group": group.id}): null;
        setStudents(
            students
        );
    }

    useEffect(() => {
         if (globalState.user != null){
            setupGroups();
        }
    }, [globalState.user])

    useEffect(() => {
        setupStudents(selectedGroup)
    }, [selectedGroup])

    const handleChange = (event, newValue) => {
        if (newValue != null) {
            setSelectedGroup(groups.filter((item) => item.id == newValue)[0])
        }
    }

    return (
        <div className="app-body">
            <h1 className="header1" style={{whiteSpace:"nowrap"}}>Мои студенты</h1>

            { groups.length > 0 ?
                (<div style={{display:"flex", flexDirection:"column", height:"100%", width:"auto"}}>
                    
                    <CustomToggleGroup value={selectedGroup.id} data={groups} exclusive onChange={handleChange}/>
                    <div className="several-pages-body">
                        <div style={{display:"flex", gap:"20px", justifyContent:"space-between", alignItems:"baseline"}}>
                            <h2 style={{margin:"0"}} className="body2">{selectedGroup.name}</h2>
                            <h3 style={{margin:"0", whiteSpace:"nowrap"}} className="body5">{majorName}</h3>
                        </div>

                        <div className="body5" style={{width:"100%", backgroundColor:"var(--grey2)", display:"flex",
                            gap:"2px", flexDirection:"column", borderRadius:"10px", overflow:"clip"}}>
                                {students.filter((student) => student.group == selectedGroup.id).map((student, i) => (
                                    <CustomButton onClick={() => router.navigate(`/student/${student.id}`, {replace:false, data:student})} 
                                    text={`${student.lastname} ${student.name} ${student.patronymic}`} className="list-item"/>
                                ))}
                        </div>
                    </div>
                </div>)
                
                : (<p>Вам не назначено академических групп</p>) 
            }
        </div>
    )
}