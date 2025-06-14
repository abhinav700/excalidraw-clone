import { CanvasState } from '@/common/types/types';
import { DrawManager } from '@/lib/engine/DrawManager'
import React from 'react'
import FontFamilyConfig from './FontFamilyConfig';

type TextStyleBarProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState;
}

const TextStyleBar = ({canvasManager, canvasState} : TextStyleBarProps) => {
  return (
    <div>
      <FontFamilyConfig canvasManager={canvasManager} canvasState={canvasState}/>
    </div>
  )
}

export default TextStyleBar