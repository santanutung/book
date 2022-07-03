import React, { useState, useEffect } from 'react'

function Pagination(props) {
    const { callbackFunction, totalPages, setCurrentPage, currentPage } = props

  const [pageArray, setPageArray] = useState([])
  // const [currentPage, setCurrentPage] = useState(1)

  // alert(currentPage)

  useEffect(() => {
    //  changePage(currentPage)
    getPageList(currentPage)
  }, [])




  function getPageList(page) {
    var list = "";
    let temp_pages = [];
    var i = page
    var status = false;
    if(totalPages > 5) {
      for (let count = 1; count <= 5; count++) {
     
        if(i> totalPages && totalPages > 5) {
        console.log(i+">"+ totalPages)
          status = true;
        }
        temp_pages.push(i)
        i++;
      }

    }
    else {
      for (let count = 1; count <= totalPages; count++) {
     
      
        temp_pages.push(count)
      }
    }
   
    if(status == false ) {
      console.log(temp_pages)
      setPageArray(temp_pages)
    }
    
   
  }



  return (
    <nav aria-label="Page navigation example mt-3">
      <ul className="pagination justify-content-end">
        <li className={currentPage == 1 ? 'page-item disabled' : 'page-item'}>
          <a className="page-link" onClick={e => { callbackFunction(currentPage - 1); setCurrentPage(currentPage - 1); getPageList(currentPage - 1) }}>
            Previous
          </a>
        </li>
        {
         pageArray.map(pageNumber => {

            return pageNumber <= totalPages ?
              <li className="page-item" key={pageNumber}>
                <a className={currentPage == pageNumber ? "page-link active" : "page-link"} onClick={e => { callbackFunction(pageNumber); setCurrentPage(pageNumber); getPageList(pageNumber) }}>
                  {pageNumber}
                </a>
              </li>
              :
              ""
          })

        }

        {

          (parseInt(totalPages) - parseInt(currentPage)) >= 5 ?
            <li className={currentPage == totalPages ? 'page-item disabled' : 'page-item'} >
              <a className="page-link" onClick={e => { callbackFunction(currentPage + 1); setCurrentPage(currentPage + 1); getPageList(currentPage + 1) }}>
                Next
              </a>
            </li>
            :
            ''
        }



      </ul>
    </nav>
  );
};


export default Pagination
