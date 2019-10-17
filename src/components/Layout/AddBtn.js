import React from 'react'

const AddBtn = () => {
    return (
        <div className='fixed-action-btn'>
            <a href="#add-restaurant-modal" className="btn-floating btn-large #ffa726 orange lighten-1 modal-trigger">
                <i className="large material-icons">add</i>
            </a>
            <ul>
                <li>
                    <a href='#add-restaurant-modal' className="btn-floating #e65100 orange modal-trigger">
                        <i className="material-icons">restaurant</i>
                    </a>
                </li>
            </ul>
        </div>
    )
}

export default AddBtn
