import React from 'react';
import { env } from '../../env';

function ImagePreview(props) {
 const {preview, setPreview, deleteImage, makePrimary} = props

    
  return (
      <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
          <div className="modal-dialog" role="document">
              <form >
                  <div className="modal-content">
                      {/* <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Add Center Time</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setPreview({})}>
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div> */}
                      <div className="modal-body">

                          <img src={env.imageurl+preview.image} width="100%" />
                         

                      </div>
                      <div className="modal-footer">
                      <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => makePrimary(preview._id)}>Make Primary</button>

                      <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => deleteImage(preview._id)}>Delete</button>
                          
                          <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setPreview({})}>Close</button>
                      </div>

                  </div>
              </form>
          </div>
      </div>
  )
}
export default ImagePreview;
