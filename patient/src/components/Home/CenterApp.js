import React from 'react'

function CenterApp() {
    return (
        <section id="services" className="services">
  <div className="container">
    <div className="row aos-animate" data-aos="fade-left" data-aos-delay={200}>
      <div className="col-lg-10 offset-lg-1">
        <div className="row">
          <div className="col-md-4 offset-md-1 text-center">
            <img src="assets/images/mobile-app.png" style={{ maxWidth: 300 }} />
          </div>
          <div className="col-md-6">
            <div className="app-text">
              <h3>Get Dialysis App</h3>
              <p>
                Fugiat enim eram quae cillum dolore dolor amet nulla culpa
                multos export minim fugiat minim velit minim dolor enim
                duis.Fugiat enim eram quae cillum dolore dolor amet nulla culpa
                multos export minim fugiat minim velit minim dolor enim duis.
              </p>
              <p>
                Fugiat enim eram quae cillum dolore dolor amet nulla culpa
                multos export minim fugiat minim velit minim dolor enim duis.
              </p>
              <p className="pg-app">
                We will send you a link, open it on your phone to download the
                App
              </p>
              <div className="row">
                <div className="col-md-4">
                  <a href="#">
                    <img src="assets/img/app-store.png" className="app-k" />
                  </a>
                </div>
                <div className="col-md-4">
                  <a href="#">
                    <img src="assets/img/google-play.png" className="app-k" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    )
}

export default CenterApp
