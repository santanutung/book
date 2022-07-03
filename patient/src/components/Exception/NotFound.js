import React from 'react'
import { Link } from 'react-router-dom'
import '../../notfound.css'

function NotFound() {
    return (
        <>
        <div className='not-found'>
 
  {/* end about */}
  <nav>
    <div className="menu">
    <p className="website_name"><img src='img/logo.png' width="100" /></p>
      {/* <div className="menu_links">
        <a href className="link">
          about
        </a>
        <a href className="link">
          projects
        </a>
        <a href className="link">
          contacts
        </a>
      </div>
      <div className="menu_icon">
        <span className="icon" />
      </div> */}
    </div>
  </nav>
  <section className="wrapper">
    <div className="container">
      <div id="scene" className="scene" data-hover-only="false">
        <div className="circle" data-depth="1.2" />
        <div className="one" data-depth="0.9">
          <div className="content">
            <span className="piece" />
            <span className="piece" />
            <span className="piece" />
          </div>
        </div>
        <div className="two" data-depth="0.60">
          <div className="content">
            <span className="piece" />
            <span className="piece" />
            <span className="piece" />
          </div>
        </div>
        <div className="three" data-depth="0.40">
          <div className="content">
            <span className="piece" />
            <span className="piece" />
            <span className="piece" />
          </div>
        </div>
        <p className="p404" data-depth="0.50">
          404
        </p>
        <p className="p404" data-depth="0.10">
          404
        </p>
      </div>
      <div className="text">
        <article>
          <p>
            Uh oh! Looks like you got lost. <br />
            Go back to the homepage!
          </p>
          <Link to="/" className='back-to-home'>Home</Link>
        </article>
      </div>
    </div>
  </section>
  </div>
  {/* partial */}
</>
    )
}


export default NotFound
