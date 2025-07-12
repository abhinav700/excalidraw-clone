"use client"
import React, { useState } from 'react';
import "./styles.css";
import DrawingCanvas from '@/components/DrawingCanvas';
import { ExistingShape } from '@/common/types/types';

const DemoSection = () => {
   const [existingShapes, setExistingShapes] = useState<ExistingShape[]>([]);

   return (
    <section className='demo-section'>
      <h1 className='demo-heading'>Test It Yourself</h1>
      <div className='demo-canvas h-[80%] w-[90%] p-1' >
        <DrawingCanvas  existingShapes={existingShapes} setExistingShapes={setExistingShapes} isCollaborationActive={false}/>
      </div>
    </section>
  )
}

export default DemoSection