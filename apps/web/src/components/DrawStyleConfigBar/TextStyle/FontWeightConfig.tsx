import { fontWeightValueMapping } from '@/lib/constants';
import { CanvasState, FontWeight } from '@/common/types/types';
import LetterIcon from '@/components/LetterIcon';
import { DrawManager } from '@/lib/engine/DrawManager'
import React, {  SetStateAction, useState } from 'react'

type FontWeightProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState
}

const FontWeightConfig = ({canvasManager, canvasState}: FontWeightProps) => {
  const [fontWeight, setFontWeight] = useState<FontWeight>(canvasState.fontWeight);
  return (
    <>
      <p className='mt-5'>Font Weight</p>
      <div className='mt-2 w-[80%] justify-between flex items-center'>
        {
          
          (Object.keys(fontWeightValueMapping) as FontWeight[]).map((value: FontWeight) => {
            return <FontWeightItem setFontWeight={setFontWeight} canvasManager={canvasManager} key={value} fontWeight={fontWeight} value={value}/>
          })
        }
        </div>
      </>
  )
}

type FontWeightItemProps = {
  fontWeight: FontWeight;
  setFontWeight: React.Dispatch<SetStateAction<FontWeight>>;
  canvasManager: DrawManager;
  value: FontWeight
}

const FontWeightItem = ({fontWeight, setFontWeight, canvasManager, value}: FontWeightItemProps) => {

  return <div 
            className='cursor-pointer bg-gray-200 hover:bg-gray-400 p-2 h-[40px] w-[40px] rounded-md flex items-center'
            style={{transition: 'background-color 0.3s ease', backgroundColor: fontWeight === value ? "#99a1af": ""}}
            title={value}
            onClick={() => {canvasManager.setFontWeight(value); setFontWeight(value)}}
          >
            <LetterIcon text={value} textConfigType={'font weight'} />
  </div>
}
export default FontWeightConfig; 