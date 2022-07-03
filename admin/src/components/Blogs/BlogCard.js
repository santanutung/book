import React from 'react';
import { Link } from 'react-router-dom';
import { env } from '../../env';

function BlogCard(props) {
    const {data, deleteBlog} = props
  return <div className='col-md-3 d-flex align-items-stretch'>
      <div className='card st'>
          <img src={env.imageurl+data.image} className='blog-image' />
          <div className='card-body'>
              <h4>{data.title}</h4>
              <p>{data.short_description.slice(0,200)}{data.short_description.length > 200 ? '...' : ''}</p>
             
          </div>
          <div className='card-footer'>
          <div className='text-right'>
                  <button className='btn btn-sm btn-danger' onClick={(e) => deleteBlog(data._id)}>Delete</button>

                  <Link className='btn btn-sm btn-warning ml-1' to={`editBlog/${data._id}`}>Edit</Link>
              </div>
          </div>
      </div>
  </div>
}

export default BlogCard;
