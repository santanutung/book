import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Slider from 'react-slick';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import Layout from '../Layout';

function AppointmentSlot() {
    const [loading, setLoading] = useState(true)

    const params = useParams();
    var settings = {
        dots: true,
        arrows:true,
        infinite: false,
        navigator: true,
        speed: 500,
        slidesToShow: 6,
        // slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    //   slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    //   slidesToScroll: 1
                }
            }
        ]
    };

    const [activeDate, setActiveDate] = useState('')
    const [selectSlot, setSelectSlot] = useState('')

    const [dates, setDates] = useState([])
    const [slots, setSlots] = useState([])

    useEffect(() => {
        centerSlotDates()
    }, [])


    
  function centerSlotDates() {

    axiosBaseUrl.get(`patients/api/center/slot/dates/${params.id}`)
      .then((res) => {
     
        setDates(res.data.data)
        getCurrentDateSlots(res.data.data[0])

      }).catch(error => {
      

      })
  }

    function getCurrentDateSlots(date) {
        setActiveDate(date)
        setSlots([])

        axiosBaseUrl.get(`patients/api/center/slot/dates/${params.id}`,{date:date})
            .then((res) => {
            
                setSlots(res.data.data)
                setLoading(false)


            }).catch(error => {
               
                if (error.response) {
                    Swal.fire(error.response.data.error, '', 'error')


                }
                else if (error.request) {
                    // The request was made but no response was received
               
                } else {
                    // Something happened in setting up the request that triggered an Error
                  
                }
            })
    }


    return (
        <Layout>
            <section id="portfolio-details" className="portfolio-details">
                <div className="container">
                    <Slider {...settings}>
                        {
                            dates.map(date => {
                                return <div>
                                    <h3 className={activeDate == date ? "active" : ""} onClick={e => getCurrentDateSlots(date)}>{date} </h3>
                                </div>
                            })
                        }

                    </Slider>
                </div>
            </section>
        </Layout>
    )
}

export default AppointmentSlot


