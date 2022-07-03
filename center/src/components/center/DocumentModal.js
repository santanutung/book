import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl'

function DocumentModal(props) {

  const { showDocumentModal, setShowDocumentModal, getDocuments } = props
  const [documentData, setDocumentData] = useState({ 'title': "", 'document': {} });
  const [otherDocument, setOtherDocument] = useState(false);
  const [documentTitle, setDocumentTitle] = useState([]);
  const [documentErrors, setDocumentErrors] = useState({});

  const handleChangeDocumentInput = (e) => {
    const newData = { ...documentData }
    if (e.target.name == 'document_name') {

      if(e.target.value == 'other') {
        setOtherDocument(true)
      }
      else {
        // setOtherDocument(false)
        newData['title'] = e.target.value
        setDocumentData(newData)
      }

    }
    else {

      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = function () {
          // const newData = { ...editData }
          newData['document'] = reader.result
          // setEditData(newData)
          setDocumentData(newData)
          console.log(reader.result);//base64encoded string
      };

      console.log(newData)


      // newData['document'] = e.target.files[0]
      // setDocumentData(newData)


    }


  }

  useEffect(() => {
    getDocumentCategory()
  }, [])
  function getDocumentCategory() {
    axiosBaseUrl.get(`private/center-document-category`)
      .then((res) => {

        // console.log(res.data.data)
        setDocumentTitle(res.data.data)



      }).catch(error => {
        console.log(error)

      })
  }


  const submitCenterDocument = (e) => {
    e.preventDefault()
    // Swa.fire({
    //   title: 'Do you want to save the changes?',
    //   showDenyButton: true, showCancelButton: true,
    //   confirmButtonText: `Save`,
    //   denyButtonText: `Don't save`,
    // }).then((result) => {
    //   if (result.isConfirmed) {

    // console.log(documentData)
    let formData = new FormData();
    formData.append('document_typeId', documentData.title)
    formData.append('document', documentData.document)
    console.log(documentData)


    axiosBaseUrl.post(`private/center/document`, documentData)
      .then((res) => {
        // console.log(res)
        Swal.fire('Centre Document is successfully added!', '', 'success')
        getDocuments()
        setDocumentData({ 'title': "", 'document': {} })
        setShowDocumentModal("")

      }).catch(error => {
        // console.log(error.response)
        if (error.response) {
          Swal.fire(error.response.data.error, '', 'error')



        }
        else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      })


  }

  return (
    <div class="modal fade show modal-show" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  >
      <div className="modal-dialog" role="document">
        <form onSubmit={submitCenterDocument}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Upload Document</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowDocumentModal('')}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <lable className="mb-2p">Document Name</lable>
                
                {
                  otherDocument ? <><input className='form-control' name="document_name" value={documentData.title} onChange={(e) => handleChangeDocumentInput(e)} /> <a  onClick={() => setOtherDocument(false)} >Remove</a> </>: 
                  <select
                  className="form-control document_name"
                  name="document_name"
                  type="text"
                  id="document_name"
                  onChange={(e) => handleChangeDocumentInput(e)}
                >
                  <option value="">Select Document Name</option>

                  {
                    documentTitle.map((x) => {

                      return (
                        <option value={x.title}>{x.title}</option>


                      )
                    })
                  }

                  <option value="other">Other</option>

                </select>
                }
                
                <span className="form-errors">{documentErrors.document}</span>
              </div>

              <div className="form-group">
                <lable className="mb-2p">Document</lable>
                <input
                  className="form-control"
                  name="document"
                  type="file"
                  id="document"
                  onChange={(e) => handleChangeDocumentInput(e)}
                />
                <span className="form-errors">{documentErrors.document}</span>
              </div>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowDocumentModal('')}>Close</button>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

export default DocumentModal
