import React, { useEffect } from 'react'
import CenterCard from './CenterCard'

function WebCenterCard(props) {
    const { centerListData, searchData, setTotalCenter } = props
    var total = 1;
   useEffect(() => {
    setTotalCenter(0)
   }, [])
    return (
        <div className='row'>
            {
                centerListData.map((x, index) => {
                    let formattedName = x.name
                    formattedName = formattedName.replaceAll(" ", "_")
                    var list = '';
                    // (index+1) % 2 == 0 

                    return (

                        searchData.date == "" ?
                        <>
                            <CenterCard center={x} searchData={searchData}/>
                            {setTotalCenter(total++)}
                            </>
                        
                        :
                        x.date_slots?.length > 0 ? 
                        <>
                        <CenterCard center={x}  searchData={searchData}/>
                       
                        {setTotalCenter(total++)}
                        </>
                        :
                        ""


                    )

                })

                
            }
        </div>
    )
}



export default WebCenterCard
