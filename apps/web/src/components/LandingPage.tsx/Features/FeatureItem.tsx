import React from 'react'

type FeatureitemProps = {
  heading: string;
  description: string;
  isFlexReverse?: boolean;
}

const FeatureItem = ({heading, description, isFlexReverse}: FeatureitemProps) => {
  return (
    <div className={`flex flex-wrap px-[2%] justify-between items-center my-3 h-[100vh] ${isFlexReverse && 'flex-row-reverse'}`}>
      <div className='text-wrap w-[35%]'>
        <h3 className='text-[38px] font-bold'>{heading}</h3>
        <p className='text-[25px]'>{description}</p>
      </div>
      <div className='bg-gray-500  flex justify-center items-center text-[40px] h-[80%] rounded-md w-[60%]'>
        A video Demonstration
      </div>
    </div>
  )
}

export default FeatureItem