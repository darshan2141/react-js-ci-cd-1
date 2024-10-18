import React from 'react'
import Image from "../assets/images/NoResults.png";

function NoResults(props) {
  return (
    <div className='text-white-bg mt-15'>
      <img src={Image} style={{maxHeight: '25vh'}} alt='no results' />
      <h2 className='text-center'>No {props.text} found</h2>
    </div>
  )
}

export default NoResults