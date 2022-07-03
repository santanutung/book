import React from 'react';
import { Modal } from 'react-bootstrap';

function ViewModal(props) {
    const {review, showReviewModal, setShowReviewModal} = props
   return (
    <>
    <Modal show={showReviewModal} onHide={() => { setShowReviewModal(false) }}>
        <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <p className='review-message'>
                    {review.review}
                </p>
               </Modal.Body>
            
            </Modal>
</>
   )
                                    }
export default ViewModal;
