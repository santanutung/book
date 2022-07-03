// import { Button, Modal } from '@material-ui/core';
import React, { useState } from 'react'

import { Button, Modal } from 'react-bootstrap';

function WhyCHooseUsModal(props) {
    const [show, setShow, data] = props;

  
    return (
        <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{data.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <div className="col-lg-4 col-md-6 d-grid align-items-stretch mb-5">
                                        <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                                            <img src={data.image} className="img-desc" alt={data.title}/>
                                            <h4 className="title"><a href="">{data.title}</a></h4>
                                            <p className="description"> {data.short_description}</p>
                                        </div>
                                    </div>
                    {/* {data.description} */}
                </Modal.Body>

            </Modal>
    )
}

export default WhyCHooseUsModal
