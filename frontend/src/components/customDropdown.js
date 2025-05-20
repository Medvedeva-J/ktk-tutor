import React from "react"
import Icons from "../icons/icons"
import { familyDataFields } from "../Consts"


export default function CustomDropdown(props) {
    const [showInfo, setShowInfo] = React.useState(false)
    const onClick = () => setShowInfo(!showInfo)
    return (
        <div className="dropdown-container">
            <div className="dropdown-header body5" onClick={onClick}>
                <Icons name="chevronLeft" size={14} color="var(--dark-blue)" className={"small " + (showInfo ? "dropdown-icon-opened" : "dropdown-icon-closed")}/>
                <span style={{width:"100%"}}>
                    {familyDataFields.relation.values[props.member.relation].label}: {props.member.full_name}
                </span>
            </div>
            {
                showInfo ? <div className="dropdown-body body5">
                            <span style={{justifySelf:"stretch"}}>
                            Телефон:
                                <span className="highlight"> {props.member.phone}</span>
                            </span>
                            <span style={{justifySelf:"stretch"}}>
                            Место работы:
                                <span className="highlight"> {props.member.occupation}</span>
                            </span>
                        </div> : null
            }
        </div>
    )
}