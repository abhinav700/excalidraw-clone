import React from 'react'
import "./styles/StrokeConfigBar.css"
import StrokeColor from './StrokeColor'
import { DrawManager } from '@/lib/engine/DrawManager'

type StrokeConfigBarProps = {
  canvasManager: DrawManager
}

const StrokeConfigBar = ({canvasManager} : StrokeConfigBarProps) => {

  return (
    <div className='absolute top-[7%] py-3 px-2 rounded-md bg-gray-300 h-[90vh] overflow-auto w-[300px]'>
      <StrokeColor canvasManager={canvasManager}/>
    </div>
  )
}

export default StrokeConfigBar