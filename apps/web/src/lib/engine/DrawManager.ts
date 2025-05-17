import { Tool, Shape, ExistingShape, LineSegment } from "@/common/types/types";
import triggerEraseEvent from "@/lib/utils/triggerEraseEvent";
import { CHAT, ERASE_SHAPE } from "@repo/common/constants";
import constructLine from "../utils/constructLine";
import constructArrow from "../utils/constructArrow";
import initTextArea from "../utils/textareaUtils/initTextArea";
import sendTextToBackend from "../utils/textareaUtils/sendTextToBackend";
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
  private activeTextAreaPosition: { x: number; y: number } | null;
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
    this.startX = 0;
    this.startY = 0;
    this.isDrawing = false;
    this.existingShapes = existingShapes;
    this.ctx.strokeStyle = "red";
    this.ctx.fillStyle="white";
    this.ctx.lineWidth = 2;
    this.lines = [];
    this.activeTextArea = null;
    this.activeTextAreaPosition = null;
    this.drawExistingShapes();
    this.initSocketHandlers();
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
  }
  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
  }


  public initSocketHandlers() {
    this.socket.onmessage = async (event) => {
      try {
        const parsedData = await JSON.parse(event.data);
        console.log(parsedData);
        switch (parsedData.type) {
          case CHAT:
            // console.log(parsedData.message);
            this.existingShapes.push({
              id: parsedData.id,
              message: parsedData.message,
            });
            this.drawExistingShapes();
            break;
          case ERASE_SHAPE:
            console.log("rece");
            this.existingShapes = this.existingShapes.filter(
              (shape) => shape.id != parsedData.id
            );
            this.drawExistingShapes();
          default:
            break;
        }
      } catch (err) {
        console.log(err);
      }
    };
  }

  public drawExistingShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log(this.existingShapes);

    this.existingShapes.map(async (item: ExistingShape) => {
      this.ctx.strokeStyle = "red";
      this.ctx.fillStyle = 'white';
      const message = await JSON.parse(item.message);
      // console.log(item)
      const shape = message.shape;

      // console.log(shape);
      if (shape.type == "rectangle") {
        this.ctx.strokeRect(
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
        this.ctx.font = "20px Aerial";
        this.ctx.fillText(shape.content, shape.x, shape.y, shape.width);
        console.log(shape)
      }
    });
  }

  public setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
  }

  // TODO: replace with React.MouseEvent<HtmlCanvasElement>
  public mouseDownHandler = async (e: MouseEvent) => {
    if (this.selectedTool == "selection") return;
    this.isDrawing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

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
      
      let x = e.clientX, y = e.clientY;
      const canvasContainer = document.getElementById("canvas-container");
      let textarea: HTMLTextAreaElement | null = document.createElement("textarea");
     
      Object.assign(textarea.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        height: "auto",
      });

      if(!canvasContainer)
        return null;
      
      canvasContainer?.appendChild(textarea);
      
      setTimeout(() => {
        textarea!.focus();
      }, 50)      
      this.activeTextArea = textarea;
      this.activeTextAreaPosition = { x, y};

      let hasUnsavedChanges: boolean = true;

      const resizeTextArea = () => {
        Object.assign(textarea!.style, {
          height: `${textarea!.scrollHeight}px`,
        });
      };

      const save = () => {
        let content = textarea!.value.trim();
       
        let mirrorTextArea = document.createElement("textarea");
        mirrorTextArea.value = content;
      
        let width = mirrorTextArea.scrollWidth;   
        
        if (canvasContainer!.contains(textarea) && textarea != null) {
          textarea.removeEventListener('blur', handleBlur);   
          textarea.remove();
          
        }
        setTimeout(() => {
          
          this.ctx.font = "20px aerial";
          this.ctx.fillStyle = "white";
          this.ctx.fillText(content, x, y + 20, 200)
        }, 50);
        
        // TODO: calculate width dynamically
        sendTextToBackend(x, y, content, 200, this.socket, this.roomId);

        this.activeTextArea = null;
        this.activeTextAreaPosition = null;
      };

      textarea?.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key == "Enter") {
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            save();
          } else {
            hasUnsavedChanges = true;
            resizeTextArea();
          }
        }
      });

      textarea.addEventListener("input", () => {
        hasUnsavedChanges = true;
        resizeTextArea();
      });

      const handleClickOutside = (e: MouseEvent) => {
        if (!textarea!.contains(e.target as Node)) {
          document.removeEventListener("mousedown", handleClickOutside);
          save();
        }
      };

      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
  
      const handleBlur = () => {
        document.removeEventListener("mousedown", handleClickOutside);
        if (hasUnsavedChanges) {
          save();
        }
      }
      textarea.addEventListener("blur", handleBlur);
    } catch (error) {
      console.log(error);
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

      const endX = e.clientX;
      const endY = e.clientY;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.drawExistingShapes();

      switch (this.selectedTool) {
        case "rectangle":
          this.ctx.strokeRect(
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
          break;

        case "pencil":
          // console.log("inside pencil case mouseMove")
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
            e.clientX,
            e.clientY,
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
        
        default:
          break;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // TODO: replace with React.MouseEvent<HtmlCanvasElement>
  public mouseUpHandler = (e: MouseEvent) => {
    if (this.selectedTool == "selection" || this.selectedTool == "text") return;
    try {
      this.isDrawing = false;
      const endX = e.clientX,
        endY = e.clientY;
      const width: number = endX - this.startX;
      const height: number = endY - this.startY;
      let shape: Shape | null;

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
          // console.log("mouse up inside pencil case")
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
        default:
          return;
      }

      this.socket.send(
        JSON.stringify({
          type: CHAT,
          message: JSON.stringify({
            shape,
          }),
          roomId: this.roomId,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
}
