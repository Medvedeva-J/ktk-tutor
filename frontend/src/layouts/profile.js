import CustomButton from "../components/customButton";
import CustomInput from "../components/customInput";
import { fetchTutor } from "../api/api";
import { format } from "date-fns";
import CustomSelect from "../components/customSelect";
import { useEffect, useState } from "react";
import useGlobal from "../store";
import { tutorFormFields } from "../Consts";
import { putTutor } from "../api/api";
import { Modal } from "../components/Modal";
import { useFieldChange } from "../hooks/useFieldChange";

export default function Profile() {
    const [tutorData, setTutorData] = useState(null)
    const [globalState, globalActions] = useGlobal()
    const [isEdit, setIsEdit] = useState(false)
    const [errors, setErrors] = useState(null)

    const handleChange = useFieldChange(setTutorData)

    useEffect(() => {
        if (globalState.user != null) {
            async function setupTutor(){
                const tutor = await fetchTutor(globalState.user);
                setTutorData(tutor)
            }
            setupTutor()
        }
        }, [globalState.user])

    const submitForm = async() => {
        try {
            putTutor(tutorData, globalState.user)
            setIsEdit(false)
        } catch (errors) {
            console.log(errors)
            let data = await errors
            setErrors(data.errors)
        }
    }
    
    

    return (
        <div className="app-body">
            <div className="body-header">
                <h1 className="header1">Личный кабинет</h1>
                { isEdit ? 
                <CustomButton onClick={submitForm} className="primary body5" text="Сохранить"></CustomButton> : 
                <CustomButton onClick={() => setIsEdit(!isEdit)} className="secondary body5" text="Редактировать"></CustomButton>
                }
            </div>

            { tutorData != null ?
                <table className="table-info">
                <tbody>
                    {Object.keys(tutorData).filter(key => !(['verbose'].includes(key))).map(item => 
                        <tr>
                            <th className="body5" scope="row">{tutorData["verbose"][`${item}_verbose`]}: </th>
                            <td className="highlight" >
                                {isEdit ? (
                                    tutorFormFields[item].type == "select" ?
    
                                    <CustomSelect
                                    values={Object.values(tutorFormFields[item].values)}
                                    onChange={handleChange(item)}
                                    type={tutorFormFields[item].type}
                                    name={item} 
                                    id={item} 
                                    value={tutorData[item]}/> :
    
                                    <CustomInput
                                    containerStyle={{width:"auto"}}
                                    type={tutorFormFields[item].type}
                                    name={item} 
                                    id={item} 
                                    maxlength={tutorFormFields[item].max_length}
                                    value={tutorData[item]}
                                    defaultChecked={tutorData[item]}
                                    onChange={handleChange(item)} />) :
                                    ((tutorData[item] || typeof tutorData[item] == "boolean") ? 
                                    (tutorFormFields[item].type == "date" ? 
                                        format(new Date(tutorData[item]), "dd.MM.yyyy") : tutorData[item].toString()): 
                                    <span className="body5 semi-transparent">Нет информации</span>)}
                            </td>
                        </tr>
                    )}    
                </tbody>
            </table> : null
            }

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

