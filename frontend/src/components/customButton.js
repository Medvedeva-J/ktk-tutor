import { useLocation, useNavigate } from "react-router-dom"

export default function CustomButton(props) {
        return (
            <div className={"custom-button-div " + props.className} style={props.containerStyle}>
                <button type={props.type} form={props.form} onClick={props.onClick} style={props.style}>{props.text}
                    {props.icon? props.icon : null}
                </button>
                <div className="button-overlay"/>
            </div>
            )
}