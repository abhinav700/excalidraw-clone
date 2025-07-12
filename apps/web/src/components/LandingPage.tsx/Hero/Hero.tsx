import React from 'react'
import "./styles.css";

const Hero = () => {
  return (
    <section className='hero-section'>
        <div className='hero-container'>
          <h1 className='hero-tagline lg:text-[45px] md:text-[38px] sm:text-[25px]'>Draw and Collaborate in real time effortlessly</h1>
          <button className='hero-get-started'>Get Started</button>
        </div>
    </section>
  )
}

export default Hero