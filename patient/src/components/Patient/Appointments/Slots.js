import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../../axiosBaseUrl';
import { socket } from '../../../context/sokcet';
import ProcessLoader from '../../../ReusableComponents/ProcessLoader';

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 4
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
    }
};

function Slots(props) {

    const { centerId, selectedslot, setSelectedslot} = props
    const [loading, setLoading] = useState(true)

    const [activeDate, setActiveDate] = useState('')

    const [dates, setDates] = useState([])
    const [slots, setSlots] = useState([])
    // const [selectedSlot, setSelectedSlot] = useState('')

    useEffect(() => {
        centerSlotDates()

        socket.on(centerId + '-book-slot', (date) => {
            getCurrentDateSlots(date)
            // alert(date)
        });
    }, [])



    function centerSlotDates() {

        axiosBaseUrl.get(`patients/api/center/slot/dates/${centerId}`)
            .then((res) => {
            
                setDates(res.data.data)
                getCurrentDateSlots(res.data.data[0])

            }).catch(error => {
                console.log(error)

            })
    }

    function getCurrentDateSlots(date) {
        setActiveDate(date)
        setSlots([])
        setLoading(true)

        axiosBaseUrl.get(`patients/api/center/slot/dates/${centerId}?date=${date}`)
            .then((res) => {
              
                setSlots(res.data.data)
                setLoading(false)


            }).catch(error => {
            
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


    function selectSlotHandler(id) {
        setSelectedslot(id)
        // alert(id)
    }



    return (
        <>


        {
            dates.length == 0 ?

                <section id='appointment-section'>
                    <div className='text-center'>
                        <h5>Slots not Available</h5>
                    </div>
                </section>
                :

                <section id='appointment-section'>
                    <div className="container">
                        <div>
                            <Carousel responsive={responsive}>
                                {
                                    dates.map(date => {
                                        return <div key={date}>
                                            <h3 className={activeDate == date ? "active appointment-slot" : "appointment-slot"} onClick={e => { getCurrentDateSlots(date); setSelectedslot('') }}>{moment(date, 'DD-MM-YYYY').format('DD/MM/YYYY')} </h3>
                                        </div>
                                    })
                                }
                            </Carousel>
                           
                        </div>
                        <div className="row mt-5">
                            {
                                loading ?
                                    <ProcessLoader />
                                    :
                                    slots.map((slot, index) => {
                                        return slot.left_bed > 0 ?
                                            (
                                                <div key={index} className="col-md-4 text-center">
                                                    <div className="btn-ap">
                                                        <a style={{ cursor: "pointer" }} onClick={() => selectSlotHandler(slot._id)} className={selectedslot == slot._id ? `button-time` : `button-time-2`}>{slot.start_time + " - " + slot.end_time}</a>
                                                    </div>
                                                </div>
                                            )
                                            :
                                            ''
                                    })
                            }
                          
                        </div>
                    </div>

                </section>

        }


       
    </>
    )
}

export default Slots
