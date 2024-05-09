import React from 'react'
import './LoaderComponent.css'
import loader from '../assets/loader.gif'

export default function LoaderComponent() {
    return (
        <div className='loaderDiv'>
            <img className='spinner' src={loader} alt="" />
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}
