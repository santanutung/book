import React, { useState } from 'react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

function PriceSlider(props) {
    const {setSearchData, searchData} = props
  // Our States
  const [value, setValue] =  useState([0,10000]);
  
  // Changing State when volume increases/decreases
  const rangeSelector = (event, newValue) => {
    const newData = { ...searchData }
    setValue(newValue);
    console.log(newValue)

    newData['price'] = value[0]+" - "+value[1]

        // const price = text.split(" ");
        newData['from_price'] =value[0]
        newData['to_price'] =value[1]
      console.log(newData)

    setSearchData(newData)


  };

    return (
        <div style={{
            margin: 'auto',
            display: 'block',
            width: '100%'
          }}>
            <Typography id="range-slider" gutterBottom>
              Select Price Range:
            </Typography>
            <Slider
              value={value}
              onChange={rangeSelector}
              valueLabelDisplay="auto"
              min={0}
              max={10000}

            />
            {/* Your range of Price is between {value[0]} /- and {value[1]} /- */}
          </div>
    )
}

export default PriceSlider
