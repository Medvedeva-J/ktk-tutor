import React, { useState, useEffect } from "react"
import CustomDropdown from "../../components/customDropdown"
import CustomInput from "../../components/customInput"
import CustomButton from "../../components/customButton"
import CustomSelect from "../../components/customSelect"
import { familyDataFields } from "../../Consts"

function StudentFamily(props) {
    const [data, setData] = useState(props.data || [])
    useEffect(() => {
        props.callback(data)
    }, [data])

    const handleChange = (key, newValue, field_name) => {
        setData(prevState => ([
            ...prevState.slice(0, key),
            {...prevState[key], [field_name]: newValue},
            ...prevState.slice(key + 1)
        ]));
    }

    const addMember = () => {
        setData([...data, {
            "full_name":null,
            "phone":null,
            "relation":Object.keys(familyDataFields.relation.values)[0],
            "occupation":null,
            "student": props.studentId,
            "verbose": {
                "full_name_verbose": "ФИО",
                "phone_verbose": "Телефон",
                "relation_verbose": "Родство",
                "occupation_verbose": "Место работы"
            }
        }])
    }

    const deleteMember = (memberIndex) => {
        setData([...data.slice(0, memberIndex),
            ...data.slice(memberIndex + 1)
        ])
    }

    if (!props.isEdit) {
        return (
            props.data.length > 0 ? <div style={{display: "flex", flexDirection:"column", gap: "10px"}}>
                {
                    props.data.map(member => (
                        <CustomDropdown member={member}/>
                    ))
                }
            </div> : <span className="semi-transparent">Нет информации о составе семьи</span>
        )
    } else {

        return (
            <div style={{display: "flex", flexDirection:"column", gap:"10px", alignItems:"stretch"}}>
                {
                    data.map(member => (
                        <table className="table-info table-info-family">
                            <tbody>
                                {Object.keys(member).filter(key => !(["student", "verbose", "id"].includes(key))).map(item => (
                                    <tr>
                                        <th className="body5">{member.verbose[`${item}_verbose`]}</th>
                                        <td>
                                            { familyDataFields[item].type == "select" ?

                                                <CustomSelect
                                                values={familyDataFields[item].values}
                                                onChange={(value)=>{
                                                    handleChange(data.indexOf(member), value, item)}}
                                                placeholder={member.verbose[`${item}_verbose`]}
                                                type={familyDataFields[item].type}
                                                name={item} 
                                                selected={item}
                                                id={item} 
                                                value={member[item]}/> :

                                                <CustomInput
                                                containerStyle={{width:"auto"}}
                                                type={familyDataFields[item].type}
                                                name={item} 
                                                id={item} 
                                                maxlength={familyDataFields[item].max_length}
                                                value={member[item]}
                                                defaultChecked={member[item]}
                                                onChange={(value)=>{handleChange(data.indexOf(member), value, item)}} />
                                            }
                                        </td>
                                    </tr>
                                ))}
                                <tr className="family-edit-tr">
                                    <td colSpan="2" className="family-edit-td">
                                        <CustomButton className="red-button" text="Удалить" onClick={() => {deleteMember(data.indexOf(member))}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ))
                }

                <CustomButton text="Добавить" containerStyle={{width:"auto"}} style={{width:"100%",display:"block", textAlign:"center"}} className="primary" onClick={() => {addMember()}}/>

            </div>
        )
    }
}

export {StudentFamily}

