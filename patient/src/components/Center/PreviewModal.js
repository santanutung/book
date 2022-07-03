import React from 'react';
import { Modal } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import { env } from '../../env';
import "react-multi-carousel/lib/styles.css";
const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

function PreviewModal(props) {
    const {showModal, setShowModal, center} = props
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title></Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <Carousel responsive={responsive}>
                                       

                                       {center.images ?
                                       center.images.map((image, index) => {
                                           return (
                                               <>
                                                   <div className="item">
                                                       <img src={env.imageurl+image.image} width="100%" />
                                                   </div>
                                               </>
                                           );
                                       })
                                    : ''}


                                   </Carousel>


            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>


        </Modal>
    );
}

export default PreviewModal;
