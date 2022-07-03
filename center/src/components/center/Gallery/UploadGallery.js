import React from 'react';

function UploadGallery(props) {
    const { convertedFiles, setConvertedfiles, submit, setGalleryModal } = props

    function imageChange(e) {
    

        var data = convertedFiles.filter((image, index) => {
            if (e.target.value == index ) {
              
                
                image['is_primary'] = 1
            }
            else {
                image['is_primary'] = 0
            }
            return image
        })
        console.log(data)

        setConvertedfiles(data)
    }
return (
    <div
        className="modal fade show"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
    // style={{ display: 'none' }}
    >
        <div className="modal-dialog login-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <a
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => {setGalleryModal(false)}}
                    >
                        <i className='fa fa-times-circle'></i>
                    </a>
                </div>
                <div className="modal-body">
                    <form id="Login">
                        <div className="row">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Upload Image
                            </h5>

                        </div>
                        
                        <div className="image-grid" style={{ marginTop: "30px" }}>
                            {convertedFiles.map((image, index) => (
                                <>
                                    <div className='card mr-2' key={index+"image"}>
                                        <img src={image.image} style={{ width: "100%" }} />
                                        <div className='card-body'>
                                        <input type="checkbox" className='mt-3' value={index} onChange={(e) => imageChange(e)}  checked={image.is_primary == 1 ? true : false} /> primary image
                                        </div>
                                    </div>
                                </>
                            ))
                            }
                        </div>

                        {/* <div className='row'>
                    {
                        convertedFiles.map((image, index) => {
                            console.log(image);
                            return (
                                <div className="col-md-3">
                                    <img src={image.image} style={{width:"100%"}} />
                                    <input type="radio" value={index} onChange={(e) => imageChange(e)}/> primary image
                                </div>
                            )
                        })
                    }
                </div> */}



                    </form>
                </div>
                <div className="modal-footer text-center">

                    <button onClick={(e) => submit(e)} type="button" className="btn btn-primary">
                        Upload
                    </button>
                </div>
            </div>
        </div>
    </div>
);
}

export default UploadGallery;
