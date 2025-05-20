import CustomInput from "../../components/customInput"
import { format } from 'date-fns';
import { healthFormFields } from "../../Consts";
import CustomSelect from "../../components/customSelect";


function StudentHealth(props) {
    return (
        props.data ?
        <table className="table-info">
            <tbody>
                {Object.keys(props.data).filter(item => (!["verbose", "id", "student"].includes(item))).map(item => 
                    <tr>
                        <th className="body5" scope="row">{props.data["verbose"][`${item}_verbose`]}: </th>
                        <td className="highlight">
                        {props.isEdit ? (
                                healthFormFields[item].type == "select" ?
                                (
                                    <CustomSelect
                                    values={healthFormFields[item].values}
                                    onChange={props.callback(item)}
                                    placeholder={props.data.verbose[`${item}_verbose`]}
                                    type={healthFormFields[item].type}
                                    name={item} 
                                    selected={item}
                                    id={item} 
                                    value={props.data[item]}/> 
                                ) :
                                (
                                    <CustomInput
                                    containerStyle={{width:"auto"}}
                                    type={healthFormFields[item].type}
                                    name={item} 
                                    id={item} 
                                    maxlength={healthFormFields[item].max_length}
                                    value={props.data[item]}
                                    defaultChecked={props.data[item]}
                                    onChange={props.callback(item)} />
                                ) 
                            ) : (
                                props.data[item] != null && props.data[item].toString().length > 0 ? (
                                    (
                                        healthFormFields[item].type == "date" ?
                                        format(new Date(props.data[item]), "dd.MM.yyyy") : (
                                            healthFormFields[item].type == "select" ?
                                            healthFormFields[item].values[props.data[item]].label : 
                                            typeof props.data[item] == "boolean" ? 
                                                (props.data[item] ? "Да" : "Нет") :
                                        props.data[item].toString()
                                        )
                                    )
                                ) :
                                <span className="body5 semi-transparent">Нет информации</span>
                            )
                                
                            }                                          
                        </td>
                    </tr>
                )}    
            </tbody>
        </table>
        : <span className="semi-transparent">Нет информации о здоровье студента</span>
    )
}

export {StudentHealth}