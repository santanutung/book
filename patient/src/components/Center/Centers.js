import axios from 'axios'
import React, { useState, useEffect } from 'react'
import axiosBaseUrl from '../../axiosBaseUrl'
import PriceSlider from '../../ReusableComponents/PriceSlider'
import ProcessLoader from '../../ReusableComponents/ProcessLoader'
import Layout from '../Layout'
import WebCenterCard from './WebCenterCard'
import Pagination from '../../ReusableComponents/Pagination'
import ContactForm from '../Home/ContactForm'
import { price_range } from '../../rawData/DataSet'
import { Link } from 'react-router-dom'
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars'
import moment from 'moment-timezone'
function Centers() {

    // const [search, setSearch] = useState("")
    const [cities, setCities] = useState([])
    const [searchData, setSearchData] = useState({ search: '', rating: '', location: '', price: '', from_price: 0, to_price: '', date: "" })
    const [filterList, setFilterList] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalCenter, setTotalCenter] = useState(0)

    const limit = 10;

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {

        centerList(1)
        getCities()
    }, [searchData])



    // const centersRawData = CenterListData;
    const [centerListData, setCenterListData] = useState([]);



    function searchCenter(e) {


        const filterData = centerListData?.filter((x) => {
            // alert(searchData.location)
            // alert(searchData.price )
            if (searchData.search === "" && searchData.rating === "" && searchData.location === "" && searchData.price === "") return x;

            else if (searchData.search !== "" && searchData.rating !== "" && searchData.location !== "" && searchData.price !== "") {
                // alert(searchData.rating)
                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    parseInt(x.rating.split('.')[0]) == searchData.rating &&
                    x.city.includes(searchData.location) &&
                    (parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price))
                ) {
                    return x;
                }

            }


            else if (searchData.search !== "" && searchData.rating !== "" && searchData.location !== "") {
                // alert(searchData.rating)
                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    parseInt(x.rating.split('.')[0]) == searchData.rating &&
                    x.city.includes(searchData.location)
                ) {
                    return x;
                }

            }
            else if (searchData.search !== "" && searchData.location !== "" && searchData.price !== "") {

                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    x.city.includes(searchData.location.toLowerCase()) &&
                    (parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price))

                ) {
                    return x;
                }

            }

            else if (searchData.search !== "" && searchData.rating !== "" && searchData.price !== "") {

                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    parseInt(x.rating.split('.')[0]) == searchData.rating &&
                    (parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price))
                ) {
                    return x;
                }

            }

            else if (searchData.location !== "" && searchData.rating !== "" && searchData.price !== "") {

                if (parseInt(x.rating.split('.')[0]) == searchData.rating && x.city.includes(searchData.location.toLowerCase()) && (parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price))) {
                    return x;
                }

            }

            else if (searchData.search !== "" && searchData.price !== "") {

                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    (parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price))

                ) {
                    return x;
                }

            }

            else if (searchData.location !== "" && searchData.price !== "") {
                // alert((parseFloat(x.charges) <= parseFloat(searchData.to_price)))
                if (((parseFloat(x.charges) >= parseFloat(searchData.from_price)) && (parseFloat(x.charges) <= parseFloat(searchData.to_price))) && x.city.includes(searchData.location.toLowerCase())) {
                    return x;
                }

            }

            else if (searchData.rating !== "" && searchData.price !== "") {

                if ((parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price)) && parseInt(x.rating.split('.')[0]) == searchData.rating) {
                    return x;
                }

            }



            else if (searchData.search !== "" && searchData.location !== "") {

                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    x.city.includes(searchData.location.toLowerCase())
                ) {
                    return x;
                }

            }

            else if (searchData.search !== "" && searchData.rating !== "") {

                if (
                    (x.name
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()) ||
                        x.address
                            .toLowerCase()
                            .includes(searchData.search.toLowerCase())) &&
                    parseInt(x.rating.split('.')[0]) == searchData.rating
                ) {
                    return x;
                }

            }

            else if (searchData.location !== "" && searchData.rating !== "") {

                if (parseInt(x.rating.split('.')[0]) == searchData.rating && x.city.includes(searchData.location.toLowerCase())) {
                    return x;
                }

            }
            else if (searchData.location !== "" && x.city.includes(searchData.location.toLowerCase())) {
                return x;
            }

            else if (searchData.rating !== "" && parseInt(x.rating.split('.')[0]) == searchData.rating) {
                return x;
            }

            else if (searchData.price !== "" && searchData.price != NaN) {

                if ((parseFloat(x.charges) >= parseFloat(searchData.from_price) && parseFloat(x.charges) <= parseFloat(searchData.to_price))) {

                    return x;
                }
            }

            else if (searchData.search !== "" &&
                (x.name
                    .toLowerCase()
                    .includes(searchData.search.toLowerCase()) ||
                    x.address
                        .toLowerCase()
                        .includes(searchData.search.toLowerCase()))
            )
                // if(searchData.rating == x.service_rating) return x;
                return x;
        });
        setFilterList(filterData)


        // alert(e.target.value)

    }

    function handleSearchInput(e) {
        const newData = { ...searchData }


        newData[e.target.name] = e.target.value
        if (e.target.name === 'price') {
            var price = price_range[e.target.value];
            newData['from_price'] = price['from_price']
            newData['to_price'] = price['to_price']
        }
        setSearchData(newData)
    }


    function centerList(page, type = null) {
        setLoading(true)

        var url = `patients/api/all-center?page=${page}&limit=8&verify_status=approved&status=active`;
        if (type !== 'reset') {
            if (searchData.search != "") {
                url += `&search=${searchData.search}`
            }
            if (searchData.rating != "") {
                url += `&rating=${searchData.rating}`
            }
            if (searchData.from_price != "") {
                url += `&price_from=${searchData.from_price}`
            }
            if (searchData.to_price != "") {
                url += `&price_to=${searchData.to_price}`
            }
            if (searchData.location != "") {
                url += `&city=${searchData.location}`
            }
            if (searchData.date != "") {
                url += `&date=${searchData.date}`
            }
        }
        // navigator.geolocation.getCurrentPosition((position) => {


        //     url += `&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`


        axiosBaseUrl.get(url)
            .then((res) => {

                setCenterListData(res.data.data.docs)
                // setFilterList(res.data.data)
                setTotalPages(res.data.data.totalPages)
                setLoading(false)

            }).catch(error => {


            })


        // })




    }

    function getCities() {
        axios
            .post("https://countriesnow.space/api/v0.1/countries/cities", { country: 'India' })
            .then((res) => {

                setCities(res.data.data)
            })
            .catch(() => {
            });
    }


    function reset() {
        setSearchData({ search: '', rating: '', location: '', price: '', from_price: 0, to_price: '', date: "" })
        centerList(1, 'reset')
    }


   
     
    return (
        <Layout>
            <>
                <div className='center-list'>
                    <section className="form-section ">
                        <div className="container">
                            <div className="row relative mt-5">
                                <Link to="/"><i className="fa fa-chevron-left back" /></Link>
                                <div className="col-md-10 offset-md-1">
                                    <div className="form-sec">

                                        <div className="expanding-search-form relative">
                                            <i className="fa fa-search" aria-hidden="true" />
                                            <i className="fa fa-chevron-down" />
                                            <i className="fa fa-chevron-up" />
                                            <input type="text" name="search" placeholder="Search.." value={searchData.search} onChange={(e) => handleSearchInput(e)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-md-10 offset-md-1">
                                    <div className="row">
                                        <div className="col-6 col-md-3 col-lg-2-5">
                                            <select
                                                className="form-select form-control"
                                                aria-label="Default select example"
                                                name="price"
                                                value={searchData.price}
                                                onChange={(e) => handleSearchInput(e)}
                                            >
                                                <option selected="">Price</option>
                                                {
                                                    price_range.map((range, index) => {
                                                        return (<option value={index}>{range.lable}</option>)
                                                    })
                                                }
                                                {/* <option value={1}>One</option>
                                    <option value={2}>Two</option>
                                    <option value={3}>Three</option> */}
                                            </select>
                                        </div>
                                        <div className="col-6 col-md-3  col-lg-2-5">

                                            <select type="text" name="location" className='form-select form-control' value={searchData.location} onChange={(e) => handleSearchInput(e)}>
                                                <option value="">Location</option>
                                                {
                                                    cities.map((city, index) => {

                                                        return (
                                                            <option value={city.toLowerCase()}>{city}</option>
                                                        )
                                                    })
                                                }
                                            </select>


                                        </div>
                                        <div className="col-6 col-md-3  col-lg-2-5">

                                            <select type="text" name="rating" className='form-select form-control' value={searchData.rating} onChange={(e) => handleSearchInput(e)}>
                                                <option value="">Rating</option>
                                                <option value="-1">Hight To Low</option>
                                                <option value="1">Low To High</option>

                                            </select>


                                        </div>
                                        <div className='col-6 col-md-3  col-lg-3' key="date">

                                            <h5 className='service-date'>

                                                <label htmlFor="tab4 relative">
                                                    <i className="fa fa-calendar " aria-hidden="true" />
                                                    <span className="select-date">{searchData.date ? moment(searchData.date, 'YYYY-MM-DD').format('DD MMM ‘YY') : 'Select a date'}</span>

                                                    <DatePickerComponent

                                                        min={new Date()}
                                                        onChange={(e) => {


                                                            const newData = { ...searchData }
                                                            newData['date'] = moment(e.target.value).format('YYYY-MM-DD')

                                                            setSearchData(newData)
                                                        }

                                                        }

                                                        id="datepicker" placeholder="Enter date"
                                                    />
                                                </label>
                                            </h5>

                                            {/* <img className="date-tab-1 hide" src="img/second-tab.png" /> */}




                                            {/* <div className='form-group'> */}
                                            {/* <input type="date" name="date" className='form-select form-control' value={searchData.date} onChange={(e) => handleSearchInput(e)} /> */}

                                            {/* </div> */}
                                        </div>


                                        <div className="col-lg-1">
                                            <div className="reset-p">
                                                <p className='pointer' onClick={() => reset()}>Reset</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="service-sec">
                        <div className="container">
                            {

                                loading ?
                                    <div className='text-center'>
                                        <ProcessLoader />
                                    </div>
                                    :
                                    centerListData.length == 0 ?

                                        <div className='text-center mt-5 mb-5'>
                                            <h5 className='text-center text-theme-color'>Centres are not available</h5>
                                        </div>


                                        :

                                        <WebCenterCard centerListData={centerListData} searchData={searchData} setTotalCenter={setTotalCenter} />
                            }


                        </div>

                        <div>

                            {
                                totalPages > 1 ?
                                    <Pagination callbackFunction={centerList} totalPages={totalPages} setCurrentPage={setCurrentPage} currentPage={currentPage} />
                                    : ''
                            }
                        </div>
                    </section>
                </div>
            </>



            {/* <ContactForm /> */}
        </Layout >
    )
}

export default Centers