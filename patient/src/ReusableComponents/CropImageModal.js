import React, { useCallback, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Cropper from 'react-easy-crop'
function CropImageModal(props) {
    const {showCropImageModal, setShowCropImageModal, image, sendImage} = props
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels)
    }, [])
    return (
        <Modal  show={showCropImageModal} onHide={() => setShowCropImageModal(false)}>
             <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </Modal.Body>
        </Modal>
    )
}

export default CropImageModal