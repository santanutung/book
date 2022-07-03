import axios from 'axios';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { env } from '../../../env';

function ImageList(props) {
    const {images, setImages, gallery} = props
    // const [images, setImages] = React.useState([]);
    const [loaded, setIsLoaded] = React.useState(false);
  
    React.useEffect(() => {
    //   fetchImages();
    }, []);
  
  function deleteImage(id) {
    Swal.fire({
        title: 'Are You Sure?',
        showCancelButton: true,
        confirmButtonText: `Delete`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {

            axiosBaseUrl.delete(`private/upload-gallery/${id}`)
                .then((res) => {

                    Swal.fire('Delete!', 'Image is successfully deleted', 'success')
                    gallery()


                }).catch(error => {
                    console.log(error)

                })




        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
        }
    });
  }
  
    return (
      <div className="hero is-fullheight is-bold is-info">
        <div className="hero-body">
          
  
            <InfiniteScroll
              dataLength={images}
              next={() => gallery()}
              hasMore={true}
           
            >
              <div className="image-grid" style={{ marginTop: "30px" }}>
                { images.map((image, index) => (
                    <>
                    <div className='relative'>
                      <img
                        src={env.imageurl+image.image}
                      />
                      
                          <button className='btn btn-sm btn-danger delete-gallery' onClick={() => deleteImage(image._id)}>Delete</button>
                      </div>
                      </>
                    ))
                 }
              </div>
            </InfiniteScroll>
          </div>
       
      </div>
    );
  };

export default ImageList;
