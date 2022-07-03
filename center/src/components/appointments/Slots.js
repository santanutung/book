import React , {useState} from 'react'

function Slots() {
  
    const [images, setImages] = useState(["12-10-2021", "13-10-2021", "14-10-2021", "15-10-2021", "16-10-2021", "17-10-2021", "18-10-2021", "19-10-2021", "20-10-2021", "21-10-2021", "22-10-2021", "23-10-2021"])
    return (
        <div>
            <ul className="slot-slider">
            {
                                                images.map(pageNumber => {
                                                    return <li className="page-item">
                                                        <a className="page-link" >
                                                            {pageNumber}
                                                        </a>
                                                    </li>
                                                })
                                            }
                                            </ul>
        </div>
    )
}

export default Slots
