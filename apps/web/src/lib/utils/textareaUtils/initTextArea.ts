

const initTextArea:(x: number, y: number, ctx: CanvasRenderingContext2D) => HTMLTextAreaElement | null = (x:number, y:number, ctx: CanvasRenderingContext2D)=>{
  try {
    const canvasContainer = document.getElementById("canvas-container");
    let textarea: HTMLTextAreaElement = document.createElement("textarea");
  
    Object.assign(textarea.style, {
      position: "absolute",
      top: `${y}px`,
      left: `${x}px`,
      height: "auto",
    })
    if(!canvasContainer)
      return null;
    
    canvasContainer?.appendChild(textarea);
    
    setTimeout(() => {
      textarea.focus();
    }, 50)

    const hasUnsavedChanges: boolean = false;

    return textarea!;
  } catch (error) {
    console.log(error);
    return null
  }
}

export default initTextArea;