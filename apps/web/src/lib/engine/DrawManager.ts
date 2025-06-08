import { Tool, Shape, ExistingShape, LineSegment, Coordinates, StrokeConfiguration } from "@/common/types/types";
import triggerEraseEvent from "@/lib/utils/triggerEraseEvent";
import { CHAT, ERASE_SHAPE} from "@repo/common/constants";
import constructLine from "../utils/constructLine";
import constructArrow from "../utils/constructArrow";
import sendTextToBackend from "../utils/textareaUtils/sendTextToBackend";
import { TEXTAREA_PADDING, TEXTAREA_BORDER_SIZE } from "../constants";
import calculatePanOffset from "../utils/calculatePanOffset";

export class DrawManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startX: number;
  private startY: number;
  public selectedTool: Tool;
  private socket: WebSocket;
  private roomId: string;
  private existingShapes: ExistingShape[];
  private isDrawing: boolean;
  private lines: LineSegment[];
  private activeTextArea: HTMLTextAreaElement | null;
  private activeTextAreaPosition: Coordinates | null;
  private fontSize: number;
  private panStart: Coordinates | null;
  private panEnd: Coordinates | null;
  private totalPanOffset: Coordinates;
  private isPanning: boolean;
  private isCtrlMetaActive: boolean;
  private canvasCenter: Coordinates;
  private strokeStyle: string;
  private fillStyle:string;
  private scale: number;

  constructor(
    canvas: HTMLCanvasElement,
    socket: WebSocket,
    roomId: string,
    existingShapes: ExistingShape[]
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.selectedTool = "selection";
    this.socket = socket;
    this.scale = 1;
    this.startX = 0;
    this.startY = 0;
    this.isDrawing = false;
    this.existingShapes = existingShapes;
    this.strokeStyle = "#000000";
    this.fillStyle="#FFFFFF"
    this.fontSize = 24;
    this.ctx.font = `${this.fontSize}px Aerial`;
    this.ctx.lineWidth = 2;
    this.lines = [];
    this.activeTextArea = null;
    this.activeTextAreaPosition = null;
    this.canvasCenter = {x: this.canvas.width / 2, y: this.canvas.height / 2};
    this.panStart = null;
    this.panEnd = null;
    this.isPanning = false;
    this.totalPanOffset = {x: 0, y: 3};
    this.isCtrlMetaActive = false;
    this.canvasCenter = {x: this.canvas.width/2, y: this.canvas.height / 2};
    this.drawExistingShapes();
    this.initSocketHandlers();
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("wheel", this.mouseZoomHandler);
    this.canvas.focus();
  }
  
  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("wheel", this.mouseZoomHandler);
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
          defau000000lt:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    };
  }

   public drawExistingShapes() {
    
    this.ctx.setTransform(this.scale, 0, 0, this.scale, this.totalPanOffset.x, this.totalPanOffset.y);
    this.ctx.clearRect(-this.totalPanOffset.x/this.scale, -this.totalPanOffset.y/this.scale, this.canvas.width / this.scale, this.canvas.height/ this.scale);
 
    this.existingShapes.map(async (item: ExistingShape) => {
      const message = await JSON.parse(item.message);
      const shape = message.shape;
      const strokeConfiguration: StrokeConfiguration = message.strokeConfiguration;

      const {strokeStyle, fillStyle} = strokeConfiguration
      this.ctx.strokeStyle = strokeStyle
      this.ctx.fillStyle = fillStyle 

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
          this.ctx
        );
      } else if (shape.type == "text"){
        const lines = shape.content.split('\n');
        const initialOffset = TEXTAREA_BORDER_SIZE + TEXTAREA_PADDING;
        this.ctx.textBaseline = "top";
        for(let i = 0; i < lines.length; i++){
         
          const lineX = shape.startX + initialOffset;
          const lineY = shape.startY + initialOffset + (i * 1.5 * this.fontSize);
          this.ctx.fillText(lines[i], lineX ,lineY, shape.width);
        }
        
        }
    });
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
      this.strokeStyle = color;
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

  public setFillStyle(color: string){
    try{
      this.fillStyle = color;
      return;
    }
    catch(err){
      console.log(err);
    }
  }

  public setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
  }

  private mouseZoomHandler = (e: WheelEvent) => {
    if(e.ctrlKey || e.metaKey){
      e.preventDefault();
      if(e.deltaY > 0)
        this.scale = Math.max(0.3, this.scale - 0.1);
      else
        this.scale = Math.min(3, this.scale + 0.1);
      
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
        
        Object.assign(textarea.style, {
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            padding: `${TEXTAREA_PADDING}px`,
            minHeight: `${this.fontSize + 4}px`,
            height: `${this.fontSize + 4}px`,
            overflow: "hidden",
            minWidth: "100px",
            border: `${TEXTAREA_BORDER_SIZE}px solid #ccc`,
            outline: "none",
            fontSize: `${this.fontSize}px`,
            fontFamily: "Aerial",
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
            fontSize: `${this.fontSize}px`,
            minWidth: "100px",
            fontFamily: textarea.style.fontFamily,
            padding: textarea.style.padding,
            boxSizing: textarea.style.boxSizing
        });
        document.body.appendChild(mirrorSpan);

        const resizeTextarea = () => {
            if (!textarea || !mirrorSpan) return;

            mirrorSpan.textContent = textarea.value || " ";
            textarea.style.width = `${Math.max(mirrorSpan.offsetWidth + 4, 100)}px`; 
            textarea.style.height = `${Math.max(textarea.scrollHeight, this.fontSize + 4)}px`;

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

            let width = textarea!.offsetWidth;
            let height = textarea!.offsetHeight;
            sendTextToBackend((x - this.totalPanOffset.x)/this.scale, (y - this.totalPanOffset.y)/this.scale, content, width, height, this.socket, this.roomId);

            if (canvasContainer!.contains(textarea!) && textarea !== null) {
                // Remove all event listeners to prevent memory leaks
                textarea.removeEventListener('blur', handleBlur);
                textarea.removeEventListener('keydown', handleKeydown);
                textarea.removeEventListener('input', handleInput);
                textarea.remove(); // Remove textarea from DOM
            }

            // Clean up the mirror span
            if (mirrorSpan && document.body.contains(mirrorSpan)) {
                document.body.removeChild(mirrorSpan);
                mirrorSpan = null; // Nullify reference to aid garbage collection
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
        const handleBlur = () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (hasUnsavedChanges) {
                save();
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
          constructArrow(this.startX, this.startY, endX, endY, this.ctx);
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
        fillStyle: this.fillStyle
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
          return;
        default:
          return;
      }

      this.socket.send(
        JSON.stringify({
          type: CHAT,
          message: JSON.stringify({
            shape,
            strokeConfiguration
          }),
          roomId: this.roomId,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
}
