export default function CustomInput(props) {
    return (
    <div className="custom-input-div" style={props.containerStyle}>
        <input {...props} 
            style={props.type == "checkbox" ? {width:"fit-content"}: props.style}
            onChange={e => 
            props.type == "checkbox" ? 
            props.onChange(e.target.checked) : 
            props.onChange(e.target.value)} placeholder={props.placeholder} className="body5"></input>
        <p className="body6">{props.placeholder}
        </p>
    </div>)
}