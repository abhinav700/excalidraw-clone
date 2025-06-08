import React from 'react'
import StrokeColor from './StrokeColor'
import { DrawManager } from '@/lib/engine/DrawManager'
import FillStyle from './FillStyle'
import StrokeWidth from './StrokeWidth'

type DrawStyleConfigBarProps = {
  canvasManager: DrawManager
}

export const colors: string[] = ["#FF0000", "#0000FF", "#008000", "#FFFFFF", "#000000", "#800080", "#FFA500"];

const DrawStyleConfigBar = ({canvasManager} : DrawStyleConfigBarProps) => {
 
  return (
    <div className='absolute py-3 px-2 rounded-md bg-gray-300 h-[100vh] overflow-auto w-[300px]'>
      <StrokeColor canvasManager={canvasManager}/>
      <FillStyle canvasManager={canvasManager}/>
      <StrokeWidth canvasManager={canvasManager}/>
    </div>
  )
}

export default DrawStyleConfigBar