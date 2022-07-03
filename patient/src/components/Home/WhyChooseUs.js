import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';
import { WhyChooseUsData } from '../../rawData/WHyChooseUsData'
import WhyCHooseUsModal from './WhyCHooseUsModal'

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 767 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 767, min: 0 },
        items: 1
    }
};


function WhyChooseUs() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState({})
    // alert(show)
    function handleShow() {

    }
    return (
        <>
            <section id="services" className="services why-choose-us">
                <div className="container">

                    <div className="section-title" data-aos="fade-up">
                        <h2>Why Choose Us</h2>

                    </div>

                    <div className="row">

                        <Carousel responsive={responsive}>

                            {
                                WhyChooseUsData.map((x, index) => {
                                    return (
                                        <div className="item" key={index}>
                                            <div className="d-grid align-items-stretch mb-5 pointer" onClick={() => { setShow(true); setData(x) }}>
                                            <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                                                <img src={x.image} className="img-desc" alt={x.title} />
                                                <h4 className="title"><a>{x.title}</a></h4>
                                                <p className="description"> {x.short_description}</p>
                                            </div>
                                            </div>
                                        </div>

                                        // <div className="col-lg-4 col-md-6 d-grid align-items-stretch mb-5 pointer" onClick={() => { setShow(true); setData(x) }}>
                                        //     <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                                        //         <img src={x.image} className="img-desc" alt={x.title}/>
                                        //         <h4 className="title"><a>{x.title}</a></h4>
                                        //         <p className="description"> {x.short_description}</p>
                                        //     </div>
                                        // </div>

                                    )
                                })
                            }


                          
                        </Carousel>


                        {/* {
                            WhyChooseUsData.map((x, index) => {
                                return (
                                    <div className="col-lg-4 col-md-6 d-grid align-items-stretch mb-5 pointer" onClick={() => { setShow(true); setData(x) }}>
                                        <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                                            <img src={x.image} className="img-desc" alt={x.title} />
                                            <h4 className="title"><a>{x.title}</a></h4>
                                            <p className="description"> {x.short_description}</p>
                                        </div>
                                    </div>

                                )
                            })
                        } */}

                        {/* <div className='col-md-6 offset-md-3 mt-5'>
                        <div className='row'>
                            {
                                WhyChooseUsData.slice(4, 6).map((x, index) => {
                                    return (
                                        <div className="col-md-6 col-lg-6 col-6 d-flex align-items-stretch mb-5 mb-lg-0 pointer" onClick={() => { setShow(true); setData(x) }}>
                                            <div className="icon-box" data-aos="fade-up" data-aos-delay="100">

                                                <h4 className="title"><a href="">{x.title}</a></h4>
                                                <p className="description">{x.short_description}</p>
                                                {show}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div> */}







                    </div>
                    <Modal show={show} onHide={() => setShow(false)}>
                        <Modal.Header closeButton>
                            {/* <Modal.Title>{data.title}</Modal.Title> */}
                        </Modal.Header>
                        <Modal.Body>
                            {/* <p>{data.short_description}</p>
                        <p>{data.description}</p> */}

                            <div className="align-items-stretch blog-modal">
                                <div className="icon-box" data-aos="fade-up" data-aos-delay="100">
                                    <img src={data.image} className="img-desc" alt={data.title} />
                                    <h4 className="title">{data.title}</h4>
                                    <p className="description"> {data.short_description}</p>
                                    <p className="description"> {data.description}</p>
                                </div>
                            </div>
                        </Modal.Body>

                    </Modal>

                </div>



            </section>

            {/* <WhyCHooseUsModal show={show} setShow={setShow} data={data} /> */}

        </>
    )
}

export default WhyChooseUs
