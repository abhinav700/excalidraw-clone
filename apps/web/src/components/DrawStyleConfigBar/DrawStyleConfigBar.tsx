import React from 'react'
import StrokeColor from './StrokeColor'
import { DrawManager } from '@/lib/engine/DrawManager'
import FillStyle from './FillStyle'
import StrokeWidth from './StrokeWidth'
import { CanvasState } from '@/common/types/types'
import TextStyleBar from './TextStyle/TextStyleBar'

type DrawStyleConfigBarProps = {
  canvasManager: DrawManager,
  canvasState: CanvasState
}


const DrawStyleConfigBar = ({canvasManager, canvasState} : DrawStyleConfigBarProps) => {
  if(!canvasManager)
    return;

  const shouldShowDrawStyleConfigBar = !['hand', 'selection'].includes(canvasState.selectedTool);
  const shouldShowFillStyleConfigBar = ['circle', 'rectangle'].includes(canvasState.selectedTool);
  const shouldShowStrokeSyleConfigBar =  canvasState.selectedTool != 'eraser';
  return (
        shouldShowDrawStyleConfigBar && 
        <div className='absolute py-3 px-2 rounded-md bg-gray-300 h-[100vh] overflow-auto w-[300px]'>
          {shouldShowStrokeSyleConfigBar && <StrokeColor canvasState={canvasState} canvasManager={canvasManager}/>}
          {shouldShowFillStyleConfigBar && <FillStyle canvasState={canvasState} canvasManager={canvasManager}/>}
          {canvasState.selectedTool != 'text'  && <StrokeWidth canvasState={canvasState} canvasManager={canvasManager}/>}
          {canvasState.selectedTool == 'text' && <TextStyleBar canvasManager={canvasManager} canvasState={canvasState}/>}
        </div>
      
  )
}

export default DrawStyleConfigBar