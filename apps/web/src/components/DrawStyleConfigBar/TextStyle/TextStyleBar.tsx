import { CanvasState } from '@/common/types/types';
import { DrawManager } from '@/lib/engine/DrawManager'
import React from 'react'
import FontFamilyConfig from './FontFamilyConfig';
import FontSizeConfig from './FontSizeConfig';
import TextAlignConfig from './TextAlignConfig';
import FontWeightConfig from './FontWeightConfig';

type TextStyleBarProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState;
}

const TextStyleBar = ({canvasManager, canvasState} : TextStyleBarProps) => {
  return (
    <div>
      <FontFamilyConfig canvasManager={canvasManager} canvasState={canvasState}/>
      <FontSizeConfig canvasManager={canvasManager} canvasState={canvasState}/>
      <TextAlignConfig canvasManager={canvasManager} canvasState={canvasState}/>
      <FontWeightConfig canvasManager={canvasManager} canvasState={canvasState}/>
    </div>
  )
}

export default TextStyleBar