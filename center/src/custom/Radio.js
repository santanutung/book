import React from 'react'

function Radio(props) {
    const {select, setSelect, id, value} = props
    return (
        <div onClick={e => setSelect(id)} id={id} > {select === id ? <i class="fas fa-circle mr-2"></i> : <i class="far fa-circle mr-2"></i>}{value}
                                        </div>
    )
}

export default Radio
