import { FeatureData } from '@/common/types/types'
import React from 'react'
import FeatureItem from './FeatureItem'
import "./styles.css";
const featuresData: FeatureData[] = [
  {
    heading: "Real time collaboration",
    description: "Create a room and collaborate with other users in real time",
  }, {
    heading: "Save data to cloud",
    description: "Create an account and login to save your drawings on cloud",
  }, {
    heading: "Save data locally",
    description: "Login as guest to save data locally.\nNo need to create an extra account"
  }
]

const Features = () => {
  return (
    <section className='features-section bg-blue-300 min-h-[100vh] max-h-[500vh] w-[100vw] py-[30px] flex flex-col items-center'> 
      <h1 className='features-heading'>Features</h1>
      <div className='h-fit w-full'>
      {
        featuresData.map((value, index) => {
          return <FeatureItem key={value.heading} heading={value.heading} description={value.description} isFlexReverse={index % 2 == 1}/>
        })
      }
        </div>
    </section>
  )
}

export default Features