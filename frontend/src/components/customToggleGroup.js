import { ToggleButton, ToggleButtonGroup } from "@mui/material"
import * as React from "react"

export default function CustomToggleGroup(props) {
    return (
        <ToggleButtonGroup value={props.value} exclusive
        onChange={props.onChange} className="custom-toggle-group-container">
            {props.data.map((item, i) => (
                <ToggleButton disableRipple id="mui-toggle-button" value={item.id}>
                    {item.name}
                </ToggleButton>))}
        </ToggleButtonGroup>
    )
}