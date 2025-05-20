function Modal (props) {
    return props.overlay? (
        <div className="modal-overlay">
            <div {...props} className="modal shadow">
                {props.content}
            </div>
        </div>
    ) :
    <div {...props} className="modal shadow">
        {props.content}
    </div>

}

export {Modal}
