import { format } from 'date-fns';
import CustomInput from '../../components/customInput';
import { studentDataFormFields } from '../../Consts';
import CustomSelect from '../../components/customSelect';

function StudentAbout(props) {
    return (
        <table className="table-info">
            <tbody>
                {Object.keys(props.data).filter(item => (!["group", "verbose", "id"].includes(item))).map(item => 
                    <tr>
                        <th className="body5" scope="row">{props.data["verbose"][`${item}_verbose`]}: </th>
                        <td className="highlight" >
                            {props.isEdit ? (
                                studentDataFormFields[item].type == "select" ?
                                (
                                    <CustomSelect
                                    values={studentDataFormFields[item].values}
                                    onChange={props.callback(item)}
                                    placeholder={props.data.verbose[`${item}_verbose`]}
                                    type={studentDataFormFields[item].type}
                                    name={item} 
                                    selected={item}
                                    id={item} 
                                    value={props.data[item]}/> 
                                ) :
                                (
                                    <CustomInput
                                    containerStyle={{width:"auto"}}
                                    type={studentDataFormFields[item].type}
                                    name={item} 
                                    id={item} 
                                    maxlength={studentDataFormFields[item].max_length}
                                    value={props.data[item]}
                                    defaultChecked={props.data[item]}
                                    onChange={props.callback(item)} />
                                ) 
                            ) : (
                                props.data[item] != null && props.data[item].toString().length > 0 ? (
                                    (
                                        studentDataFormFields[item].type == "date" ?
                                        format(new Date(props.data[item]), "dd.MM.yyyy") : (
                                            studentDataFormFields[item].type == "select" ?
                                            studentDataFormFields[item].values[props.data[item]].label : 
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
        )
}

export {StudentAbout}