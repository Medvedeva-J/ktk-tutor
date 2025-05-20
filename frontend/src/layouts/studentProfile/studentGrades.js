function StudentGrades(props) {
    let keys = ["subject_name", "certification_form", "grade"]
    return (
        props.data ? 
        <table className="body5">
            <thead>
                <tr>
                    {keys.map(column_title => (
                        <th>{column_title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Object.values(props.data).map(value => (
                    <tr>
                        {keys.map(column => (
                            <td>{value[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table> :
        <span className="semi-transparent">Нет информации об оценках</span>
    )
}

export {StudentGrades}