import React, { useEffect, useState } from "react";
import { PartnerData } from "../../rawData/PartnerData";
import { useDispatch, useSelector } from "react-redux";
import axiosBaseUrl from "../../axiosBaseUrl";
import { env } from "../../env";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Carousel from "react-multi-carousel";
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
function Partners(props) {
  // const dispatch = useDispatch();
  // const [partners, setPartners] = useState([]);
  // const { setShowModal } = props;

  // function getPartnerApi() {
  //   axiosBaseUrl
  //     .get(`patients/api/partner/`)
  //     .then((res) => {
  //       setPartners(res.data.data.docs);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  const [centerListData, setCenterListData] = useState([]);
  function centerList(search = null) {
    axiosBaseUrl.get(`patients/api/all-center?verify_status=approved&status=active`)
      .then((res) => {

        setCenterListData(res.data.data.docs.slice(0, 5))

      }).catch(error => {
        console.log(error)

      })
  }

  useEffect(() => {
    // getPartnerApi();
    centerList()
  }, []);
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Our partnered centres</h2>
        </div>

        <div className="row" data-aos="fade-up" data-aos-delay="300">


          <Carousel responsive={responsive}>

            {centerListData.map((center, index) => {
              return (
                <>
                  <div className="item" key={index+'partner'}>
                    <Link to={`/centre/${center._id}`} key={index}>
                      <div className="col-md-4 box-img">
                        <div className="">
                          <img src={env.imageurl + center.primaryImage} width="100%" className="img-fluid" alt={center.name} />

                        </div>
                        <div className="hospital-head">
                          <h3 className="center-name">{center.name}</h3>
                          <span>{center.city + " " + center.state}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </>
              );
            })}
          </Carousel>

        
        </div>
      </div>
    </section>
  );
}

export default Partners;
