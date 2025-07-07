import { Tool, Shape, ExistingShape, LineSegment, Coordinates, StrokeConfiguration, StrokeWidthValues, CanvasState, FontSize, FontFamily, TextAlignment, FontConfiguration, FontWeight } from "@/common/types/types";

import triggerEraseEvent from "@/lib/utils/triggerEraseEvent";
import { CHAT, ERASE_SHAPE} from "@repo/common/constants";
import constructLine from "../utils/constructLine";
import constructArrow from "../utils/constructArrow";
import sendTextToBackend from "../utils/textareaUtils/sendTextToBackend";
import { SHAPES_DATA_KEY, TEXTAREA_PADDING } from "../constants";
import calculatePanOffset from "../utils/calculatePanOffset";
import { SetStateAction, useId } from "react";
import { fontSizeValueMapping, fontWeightValueMapping, TEXTAREA_OFFSET_Y } from "@/lib/constants";
import { stringify } from "querystring";

export class DrawManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  private canvasState: CanvasState;
  private setCanvasState: React.Dispatch<SetStateAction<CanvasState>>;
  private existingShapes: ExistingShape[];
  private setExistingShapes: React.Dispatch<SetStateAction<ExistingShape[]>>
  
  private strokeStyle: string;
  private fillStyle:string;
  private strokeWidth: StrokeWidthValues;
  
  private fontSize: FontSize;
  private fontFamily: FontFamily;
  private textAllignment: TextAlignment;
  private fontWeight: FontWeight;

  private socket: WebSocket;
  private roomId: string;
  private selectedTool: Tool;
  private isCollaborationActive: boolean;

  private scale: number;
  private startX: number;
  private startY: number;
  private panStart: Coordinates | null;
  private panEnd: Coordinates | null;
  private canvasCenter: Coordinates;
  private totalPanOffset: Coordinates;
  private windowInnerWidth: number;
  private isDrawing: boolean;
  private isCtrlMetaActive: boolean;
  private isPanning: boolean;
  
  private lines: LineSegment[];
  private activeTextArea: HTMLTextAreaElement | null;
  private activeTextAreaPosition: Coordinates | null;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    roomId: string,
    existingShapes: ExistingShape[],
    setExistingShapes: React.Dispatch<SetStateAction<ExistingShape[]>>,
    canvasState: CanvasState,
    setCanvasState: React.Dispatch<SetStateAction<CanvasState>>,
    windowInnerWidth: number,
    isCollaborationActive: boolean
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
   
    this.canvasState = canvasState;
    this.setCanvasState = setCanvasState,
    this.existingShapes = existingShapes;
    this.setExistingShapes = setExistingShapes;
    
    this.strokeStyle = canvasState.strokeStyle;
    this.fillStyle= canvasState.fillStyle;
    this.strokeWidth = canvasState.strokeWidth;
    
    this.fontSize= this.canvasState.fontSize;
    this.fontFamily = this.canvasState.fontFamily;
    this.textAllignment = this.canvasState.textAlignment;
    this.fontWeight = canvasState.fontWeight
    this.ctx.font = `${fontSizeValueMapping[this.fontSize]}px Aerial`;
    
    this.socket = socket;
    this.roomId = roomId;
    this.selectedTool = canvasState.selectedTool;
    this.isCollaborationActive = isCollaborationActive;

    this.scale = canvasState.scale;
    this.startX = 0;
    this.startY = 0;
    this.panStart = null;
    this.panEnd = null;
    this.canvasCenter = {x: this.canvas.width/2, y: this.canvas.height / 2};
    this.totalPanOffset = canvasState.totalPanOffset;
    this.windowInnerWidth = windowInnerWidth;
    
    this.isDrawing = false;
    this.isPanning = false;
    this.isCtrlMetaActive = false;
    
    this.lines = [];
    this.activeTextArea = null;
    this.activeTextAreaPosition = null;
    
    this.drawExistingShapes();
    if(this.isCollaborationActive){
      this.initSocketHandlers();
    }

    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("wheel", this.mouseZoomHandler);
  }
  
  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("wheel", this.mouseZoomHandler);
  }
  
  public getStrokeStyle = () => {
      try{
        return this.strokeStyle
      }
      catch(err){
        console.log(err);
        return "#000000"
      }
  }

  public setStrokeStyle(color: string){
    try{
      this.setCanvasState({...this.canvasState, strokeStyle: color});
      return;
    }
    catch(err){
      console.log(err);
    }
  }

  public getFillStyle = () => {
      try{
        return this.fillStyle
      }
      catch(err){
        console.log(err);
        return "#FFFFFF"
      }
  }

  public setFillStyle(fillStyle: string){
    try{
      this.setCanvasState({...this.canvasState, fillStyle});
      return;
    }
    catch(err){
      console.log(err);
    }
  }

  public getStrokeWidth(Width: StrokeWidthValues){
    try{
      return this.strokeWidth;
    }
    catch(err){
      console.log(err);
      return "2";
    }
  }

  public setStrokeWidth(strokeWidth: StrokeWidthValues){
    try{
      this.setCanvasState({...this.canvasState, strokeWidth});
    }
    catch(err){
      console.log(err);
    }
  }

  public setSelectedTool(selectedTool: Tool) {
    try{
      this.setCanvasState({...this.canvasState, selectedTool});
    } catch(err){
      console.log(err);
    }
  }

  public setFontFamily(fontFamily: FontFamily){
    try{
      this.fontFamily = fontFamily;
      return;
    } catch (err){
      console.log(err);
    }
  }

  public getFontFamily(fontFamily: FontFamily){
    try{
      return this.fontFamily;
    } catch(err){
      console.log(err);
    return 'Excalifont'
    }
  }

  public setFontSize(fontSize: FontSize){
    try{
      this.setCanvasState({...this.canvasState, fontSize})
    }catch(err){
      console.log(err);
    }
  }

  public setTextAlignment(textAlignment: TextAlignment){
    try{
      this.setCanvasState({...this.canvasState, textAlignment})
    } catch(err){
      console.log(err);
    }
  }

  public setFontWeight(fontWeight: FontWeight){
    try{
      this.setCanvasState({...this.canvasState, fontWeight});
    } catch(err){
      console.log(err);
    }
  }

  public initSocketHandlers() {
    this.socket.onmessage = async (event) => {
      try {
        const parsedData = await JSON.parse(event.data);
        switch (parsedData.type) {
          case CHAT:
            this.existingShapes.push({
              id: parsedData.id,
              message: parsedData.message,
            });
            this.drawExistingShapes();
            break;

          case ERASE_SHAPE:
            
            this.existingShapes = this.existingShapes.filter(
              (shape) => shape.id != parsedData.id
            );
            this.drawExistingShapes();
            break;
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    };
  }
  
   public drawExistingShapes() {
    
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.totalPanOffset.x, this.totalPanOffset.y);
    console.log(this.existingShapes);
   
    this.ctx.clearRect(-this.totalPanOffset.x/this.scale, -this.totalPanOffset.y/this.scale, this.canvas.width / this.scale, this.canvas.height/ this.scale);
    
    this.existingShapes.map((item: ExistingShape) => {
      const message = JSON.parse(item.message);
      const shape = message.shape;
      const strokeConfiguration: StrokeConfiguration = message.strokeConfiguration;

      const {strokeStyle, fillStyle, strokeWidth} = strokeConfiguration ?? {
        strokeStyle: this.strokeStyle,
        fillStyle: this.fillStyle,
        strokeWidth: this.strokeWidth,
      };
      this.ctx.strokeStyle = strokeStyle
      this.ctx.fillStyle = fillStyle
      this.ctx.lineWidth = parseInt(strokeWidth);
      
      if (shape.type == "rectangle") {
        this.ctx.strokeRect(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height
        );

        this.ctx.fillRect(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height
        );
         
      } else if (shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
        this.ctx.fill();
      } else if (shape.type == "pencil") {
        shape.lines.map((line: LineSegment) => {
          constructLine(
            line.startX,
            line.startY,
            line.endX,
            line.endY,
            this.ctx
          );
        });
      } else if (shape.type == "line") {
        constructLine(
          shape.startX,
          shape.startY,
          shape.endX,
          shape.endY,
          this.ctx
        );
      } else if (shape.type == "arrow") {
        constructArrow(
          shape.startX,
          shape.startY,
          shape.endX,
          shape.endY,
          this.ctx,
          strokeWidth 
        );
      } else if (shape.type == "text"){
        const lines = shape.content.split('\n');
        // const initialOffset = TEXTAREA_BORDER_SIZE + TEXTAREA_PADDING;
        const initialOffset = TEXTAREA_PADDING;
        const {color, fontSize, fontFamily, textAlignment} = message.fontConfiguration;
       
        this.ctx.textBaseline = "top";
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSizeValueMapping[fontSize as FontSize]}px ${fontFamily}`;
        this.ctx.textAlign = textAlignment;

        for(let i = 0; i < lines.length; i++){
         
          const lineX = shape.startX + initialOffset;
          const lineY = shape.startY + initialOffset + (i * 1.5 * fontSizeValueMapping[this.fontSize]);
          this.ctx.fillText(lines[i], lineX ,lineY, shape.width);
        }
        
        }
    });
  }


  private mouseZoomHandler = (e: WheelEvent) => {
    let newScale: number;
    if(e.ctrlKey || e.metaKey){
      e.preventDefault();
      if(e.deltaY > 0)
        newScale = Math.max(0.3, this.scale - 0.1);

      else
        newScale = Math.min(3, this.scale + 0.1);
      
        this.setCanvasState({...this.canvasState, scale : newScale})
        
        this.drawExistingShapes();
    }
  }
 
 
  // TODO: replace with React.MouseEvent<HtmlCanvasElement>
  private mouseDownHandler = async (e: MouseEvent) => {

    if (this.selectedTool == "selection") return;
    this.isDrawing = true;
    this.startX = (e.clientX - this.totalPanOffset.x)/this.scale;
    this.startY = (e.clientY - this.totalPanOffset.y)/this.scale;

    if(this.selectedTool == 'hand'){
      this.panStart = {x: e.clientX , y: e.clientY};
      this.isPanning = true;
      return;
    }
    if (this.selectedTool == "pencil") {
      this.lines = [];
    } else if (this.selectedTool == "eraser") {
      triggerEraseEvent(
        this.startX,
        this.startY,
        this.existingShapes,
        this.socket,
        this.roomId!
      );
    } else if (this.selectedTool == "text") {
      this.isDrawing = false;
      this.handleText(e);
    }
  };
  
private handleText(e: MouseEvent) {
    try {
        let x = e.clientX;
        let y = e.clientY;
        const canvasContainer = document.getElementById("canvas-container");
      
        let textarea: HTMLTextAreaElement | null = document.createElement("textarea");
        const fontSizeValue = fontSizeValueMapping[this.fontSize];
        console.log(this.fontSize);

        console.log(fontSizeValue);
        Object.assign(textarea.style, {
            position: "absolute",
            left: `${x}px`,
            top: `${y - TEXTAREA_OFFSET_Y}px`,
            color: this.strokeStyle,
            fontSize: `${fontSizeValue}px`,
            padding: `${TEXTAREA_PADDING}px`,
            height: `${fontSizeValue + 4}px`,
            overflow: "hidden",
            minWidth: "100px",
            textAlign:this.textAllignment,
            // border: `${TEXTAREA_BORDER_SIZE}px solid red`,
            outline: "none",
            fontFamily: this.fontFamily,
            fontWeight: fontWeightValueMapping[this.fontWeight],
            boxSizing: "border-box",
            resize: "none",
            whiteSpace: "nowrap"
      });

        if (!canvasContainer) {
            console.error("Canvas container not found.");
            return;
        }

        canvasContainer.appendChild(textarea);

        let mirrorSpan: HTMLSpanElement | null = document.createElement("span");
        Object.assign(mirrorSpan.style, {
            visibility: "hidden", 
            position: "absolute", 
            top: '0',
            left: '0',
            whiteSpace: "pre-wrap",
            fontSize: `${fontSizeValueMapping[this.fontSize]}}px`,
            minWidth: "100px",
            fontFamily: textarea.style.fontFamily,
            padding: textarea.style.padding,
            boxSizing: textarea.style.boxSizing
        });
        document.body.appendChild(mirrorSpan);

        const resizeTextarea = () => {
            if (!textarea || !mirrorSpan) return;

            mirrorSpan.textContent = textarea.value || " ";
            const currentTextAreaWidth = textarea.clientWidth;
            textarea.style.height = `${Math.max(textarea.scrollHeight, fontSizeValueMapping[this.fontSize] + 4)}px`;
            
            if(x + currentTextAreaWidth + 10 >= this.windowInnerWidth)
              return;
            textarea.style.width = `${Math.max(mirrorSpan.clientWidth + fontSizeValueMapping[this.fontSize]*1.2, 100)}px`; 

        };

        setTimeout(() => {
            textarea!.focus();
            resizeTextarea(); 
        }, 50);

        this.activeTextArea = textarea;
        this.activeTextAreaPosition = { x, y };

        let hasUnsavedChanges: boolean = true;

        const save = () => {
            let content = textarea!.value.trim();

            let width = textarea!.scrollWidth;
            let height = textarea!.offsetHeight;

            const fontConfiguration: FontConfiguration = {
              fontSize: this.fontSize,
              fontFamily: this.fontFamily,
              textAlignment: this.textAllignment,
              fontWeight: this.fontWeight,
              color: this.strokeStyle
            }  

            sendTextToBackend((x - this.totalPanOffset.x)/this.scale, (y - this.totalPanOffset.y - TEXTAREA_OFFSET_Y)/this.scale,
              content, width, height, this.socket, this.roomId, fontConfiguration, this.isCollaborationActive, this.setExistingShapes, this.existingShapes);

            if (canvasContainer!.contains(textarea!) && textarea !== null) {
                textarea.removeEventListener('blur', handleBlur);
                textarea.removeEventListener('keydown', handleKeydown);
                textarea.removeEventListener('input', handleInput);
                textarea.remove(); 
            }

            
            if (mirrorSpan && document.body.contains(mirrorSpan)) {
                document.body.removeChild(mirrorSpan);
                mirrorSpan = null; 
            }

            this.activeTextArea = null;
            this.activeTextAreaPosition = null;
        };

        // Keydown handler to detect Enter press
        const handleKeydown = (e: KeyboardEvent) => {
            if (!textarea) return;

            if (e.key === "Enter") {
                if (e.metaKey || e.ctrlKey) {
                    // Ctrl/Cmd + Enter: Save and close (common shortcut)
                    e.preventDefault();
                    save();
                } else {
                    // Just Enter: Switch to multi-line mode and add a newline
                    e.preventDefault(); // Prevent browser's default Enter behavior


                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const currentValue = textarea.value;

                    textarea.value = currentValue.substring(0, start) + '\n' + currentValue.substring(end);

                    textarea.selectionStart = textarea.selectionEnd = start + 1;

                    resizeTextarea();
                }
            }
        };

        // Input handler to trigger resize on any text change
        const handleInput = () => {
            hasUnsavedChanges = true;
            resizeTextarea();
        };

        // Attach event listeners
        textarea.addEventListener("keydown", handleKeydown);
        textarea.addEventListener("input", handleInput);

        // Click outside logic to save
        const handleClickOutside = (e: MouseEvent) => {
            if (textarea && !textarea.contains(e.target as Node)) {
                document.removeEventListener("mousedown", handleClickOutside);
                save();
            }
        };

        // Add mousedown listener after a small delay to avoid immediate trigger
        setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 100);

        // Blur handler to save changes
        const handleBlur = (e: FocusEvent) => {
          e.preventDefault();
          if(this.canvas.contains(e.target as Node )){
              alert('entered canvas');
              document.removeEventListener("mousedown", handleClickOutside);
              if (hasUnsavedChanges) {
                save();
              }
            }
        };
        textarea.addEventListener("blur", handleBlur);

    } catch (error) {
        console.error("Error in handleText:", error);
    }
}
  // TODO: replace with React.MouseEvent<HtmlCanvasElement>
  public mouseMoveHandler = (e: MouseEvent) => {
    try {
      if (
        !this.isDrawing ||
        this.selectedTool == "selection" ||
        this.selectedTool == "text"
      )
        return;

      const endX = (e.clientX - this.totalPanOffset.x)/this.scale; 
      const endY = (e.clientY - this.totalPanOffset.y)/this.scale;
     
      this.ctx.clearRect(-this.totalPanOffset.x/ this.scale, -this.totalPanOffset.y/this.scale, this.canvas.width/ this.scale, this.canvas.height/this.scale);

      this.drawExistingShapes();
      
      this.ctx.strokeStyle = this.strokeStyle;
      this.ctx.fillStyle = this.fillStyle;
      this.ctx.lineWidth = parseInt(this.strokeWidth);

      switch (this.selectedTool) {
        case "rectangle":
          this.ctx.strokeRect(
            this.startX,
            this.startY,
            endX - this.startX,
            endY - this.startY
          );
          this.ctx.fillRect(
            this.startX,
            this.startY,
            endX - this.startX,
            endY - this.startY
          );
          break;

        case "circle":
          const term1 = Math.pow(endX - this.startX, 2);
          const term2 = Math.pow(endY - this.startY, 2);
          const radius = Math.sqrt(term1 + term2); // Correct radius calculation

          this.ctx.beginPath();
          this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI); // Correct center and radius usage
          this.ctx.stroke();
          this.ctx.fill();
          break;

        case "pencil":
          this.lines!.map((line: LineSegment) => {
            constructLine(
              line.startX,
              line.startY,
              line.endX,
              line.endY,
              this.ctx
            );
          });
          constructLine(this.startX, this.startY, endX, endY, this.ctx);

          this.lines?.push({
            startX: this.startX,
            startY: this.startY,
            endX,
            endY,
          });
          this.startX = endX;
          this.startY = endY;
          break;

        case "eraser":
          triggerEraseEvent(
            e.clientX - this.totalPanOffset.x,
            e.clientY - this.totalPanOffset.y,
            this.existingShapes,
            this.socket,
            this.roomId
          );
          break;

        case "line":
          constructLine(this.startX, this.startY, endX, endY, this.ctx);
          break;
        case "arrow":
          constructArrow(this.startX, this.startY, endX, endY, this.ctx, this.strokeWidth);
          break;
        case "hand":
          this.panEnd = {x: e.clientX, y: e.clientY};
          let currentPanOffset = calculatePanOffset(this.panStart!, this.panEnd!)!;
          this.totalPanOffset = {
            x: currentPanOffset.x + this.totalPanOffset.x,
            y: currentPanOffset.y + this.totalPanOffset.y    
          }
          
          this.panStart = this.panEnd;
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // TODO: replace with React.MouseEvent<HtmlCanvasElement>
  public mouseUpHandler = (e: MouseEvent) => {
    
    try {
      if (this.selectedTool == "selection" || this.selectedTool == "text") return;

      this.isDrawing = false;
      
      const endX = (e.clientX - this.totalPanOffset.x)/this.scale,
      endY = (e.clientY - this.totalPanOffset.y)/this.scale;

      const width: number = endX - this.startX;
      const height: number = endY - this.startY;
     
      let shape: Shape | null;
    
      let strokeConfiguration : StrokeConfiguration = {
        strokeStyle: this.strokeStyle,
        fillStyle: this.fillStyle,
        strokeWidth: this.strokeWidth
      }
    
      switch (this.selectedTool) {
        case "rectangle":
          shape = {
            type: "rectangle",
            width,
            height,
            startX: this.startX,
            startY: this.startY,
          };
          break;

        case "circle":
          const term1 = Math.pow(endX - this.startX, 2);
          const term2 = Math.pow(endY - this.startY, 2);
          const radius = Math.sqrt(term1 + term2); // Correct radius calculation

          shape = {
            type: "circle",
            centerX: this.startX,
            centerY: this.startY,
            radius,
          };
          break;

        case "pencil":
          shape = {
            type: "pencil",
            lines: this.lines!,
          };
          this.lines = [];
          break;

        case "line":
          shape = {
            type: "line",
            startX: this.startX,
            startY: this.startY,
            endX,
            endY,
          };
          break;

        case "arrow":
          shape = {
            type: "arrow",
            startX: this.startX,
            startY: this.startY,
            endX,
            endY,
          };
          break;
        case "hand":
          this.isPanning = false;
          this.setCanvasState({...this.canvasState, totalPanOffset: this.totalPanOffset});
          return;
        case "eraser":
          this.setExistingShapes((existingShapes) => this.existingShapes);
          if(!this.isCollaborationActive){
            localStorage.setItem(SHAPES_DATA_KEY, JSON.stringify(this.existingShapes));
          }
        default:
          return;
      }
      const message = JSON.stringify({shape, strokeConfiguration});

      if(this.isCollaborationActive){
        this.socket.send(
          JSON.stringify({
            type: CHAT,
            message, 
            roomId: this.roomId,
          })
        );
      }
      else{
        const randomNumber: number = Math.random() * 10;
        this.setExistingShapes(es => [...this.existingShapes, {message, id: randomNumber}])

      }
    } catch (err) {
      console.log(err);
    }
  };
}
