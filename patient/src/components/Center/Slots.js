import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import Swal from 'sweetalert2';
import axiosBaseUrl from '../../axiosBaseUrl';
import AppointmentModal from './AppointmentModal';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProcessLoader from '../../ReusableComponents/ProcessLoader';
import { socket } from '../../context/sokcet';
import useGlobalContexts from '../../context/GlobalContext';

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

    const { loginState, setLoginState } = useGlobalContexts();
    const { centerId, } = props
    const [loading, setLoading] = useState(true)
    const [showAppointmentModal, setShowAppointmentModal] = useState(false)

    const [activeDate, setActiveDate] = useState('')

    const [dates, setDates] = useState([])
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState('')
    const [uploadDocumentForm, setUploadDocumentForm] = useState()
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
                  
                } else {
                    // Something happened in setting up the request that triggered an Error
                  
                }
            })
    }


    function selectSlotHandler(id) {
        if (localStorage.getItem('activeUser') !== undefined && localStorage.getItem('activeUser') !== null) {
            setSelectedSlot(id)
            setShowAppointmentModal(true)
        }
        else {
            
            setLoginState(true)
         
        }

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
                                                <h3 className={activeDate == date ? "active appointment-slot" : "appointment-slot"} onClick={e => { getCurrentDateSlots(date); setSelectedSlot('') }}>{moment(date, 'DD-MM-YYYY').format('DD/MM/YYYY')} </h3>
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
                                                            <a style={{ cursor: "pointer" }} onClick={() => selectSlotHandler(slot._id)} className={selectedSlot == slot._id ? `button-time` : `button-time-2`}>{slot.start_time + " - " + slot.end_time + "( beds " + slot.left_bed + ")"}</a>
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


            {
                showAppointmentModal ?
                    <AppointmentModal setShowAppointmentModal={setShowAppointmentModal} selectedSlot={selectedSlot} getCurrentDateSlots={getCurrentDateSlots} centerId={centerId} />
                    : ''
            }
        </>
    )
}

export default Slots
