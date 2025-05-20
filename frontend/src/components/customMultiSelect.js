import { Checkbox } from "@mui/material";
import CustomInput from "./customInput";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useFieldChange } from "../hooks/useFieldChange";

function CustomMultiSelect(props) {
    const [data, setData] = useState({search:"", checked:[], current:[...Object.keys(props.data)]})
    const [showOptions, setShowOptions] = useState(false)
    const handleChange = useFieldChange(setData)
    const containerRef = useRef(null)

    useEffect(() => {
        handleChange("current")(Object.keys(props.data).filter(i => 
            props.data[i].label.startsWith(data.search)))
    }, [data.search])

    useEffect(() => {
        props.getSelectedCallback(data.checked)
    }, [data.checked])
    

    const handleBlur =(e) => {
        if (e.currentTarget.contains(e.relatedTarget)
            || e.currentTarget == e.relatedTarget) {
            setShowOptions(true)
        } else {
            setShowOptions(false)
        }
    }

    const handleFocus =(e) => {
        if (containerRef.current.contains(e.currentTarget) 
            || containerRef.current == e.currentTarget) {
            setShowOptions(true)
        }
    }

    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            handleChange("checked")([...data.checked, e.target.id])
        } else {
            handleChange("checked")(data.checked.filter((i) => i != e.target.id))
        }
    }

    const deleteChip = (chip) => {
        handleChange("checked")(data.checked.filter((i) => i != chip))
    }

    return (
        <div className="multiselect-body" ref={containerRef}
        onBlur={handleBlur} onFocus={handleFocus}>
            <label for="chips-input" class="chips-container">
                {data.checked.map((item) => 
                    <div className="chip">
                        <span>{props.data[item].label}</span>
                        <button onClick={() => deleteChip(item)}>x</button>
                    </div>
                    )
                }

                <input className="chips-input" value={data.search} id="chips-input"
                    onChange={(e) => handleChange("search")(e.target.value)}/>
            </label>

            { showOptions ? <div className="multiselect-options-container" >
                { data.current.length > 0 ? 
                    data.current.map(item => 
                    <div className="multiselect-option" tabIndex="0">
                        <input type="checkbox" onChange={handleCheckboxChange}
                            checked={data.checked.includes(item) ? true : false} id={item}/>
                        <label for={item}>{props.data[item].label}</label>
                    </div>
                ) : <span style={{color:"var(--grey3)"}}>{"Таких полей не нашлось :("}</span>}
            </div> : <></>}
        </div>
    )
}

export default CustomMultiSelect