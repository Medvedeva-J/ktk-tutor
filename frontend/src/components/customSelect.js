export default function CustomSelect(props) {
    return (
        <select 
        onChange={e => props.onChange(e.target.value)}
        value={props.value}
        name={props.name} {...props}>
            {Object.keys(props.values).map(item => (
                <option value={item}>
                    {props.values[item].label}
                </option>
            ))}
        </select>
    )
}