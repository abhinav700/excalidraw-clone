import { Tool, Shape, ExistingShape, LineSegment } from "@/common/types/types";
import triggerEraseEvent from "@/lib/utils/triggerEraseEvent";
import { CHAT, ERASE_SHAPE} from "@repo/common/constants";
import constructLine from "../utils/constructLine";
import constructArrow from "../utils/constructArrow";
import sendTextToBackend from "../utils/textareaUtils/sendTextToBackend";
import { TEXTAREA_PADDING, TEXTAREA_BORDER_SIZE } from "../constants";

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
  private fontSize: number;
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
    this.fontSize = 24;
    this.ctx.font = `${this.fontSize}px Aerial`;
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
    // console.log(this.existingShapes);

    this.existingShapes.map(async (item: ExistingShape) => {
      // this.ctx.strokeStyle = "red";
      // this.ctx.fillStyle = 'white';
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
        const lines = shape.content.split('\n');
        const initialOffset = TEXTAREA_BORDER_SIZE + TEXTAREA_PADDING;
        this.ctx.textBaseline = "top";
        for(let i = 0; i < lines.length; i++){
         
          const lineY = shape.startY + initialOffset + (i * 1.5 * this.fontSize);
          const lineX = shape.startX + initialOffset;
          this.ctx.fillText(lines[i], lineX ,lineY, shape.width);
        }
        
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
  
  // Assuming sendTextToBackend, this.fontSize, this.socket, this.roomId,
// this.activeTextArea, this.activeTextAreaPosition are defined in the class scope.
// Assuming sendTextToBackend, this.fontSize, this.socket, this.roomId,
// this.activeTextArea, this.activeTextAreaPosition are defined in the class scope.
private handleText(e: MouseEvent) {
    try {
        let x = e.clientX;
        let y = e.clientY;
        const canvasContainer = document.getElementById("canvas-container");
        let textarea: HTMLTextAreaElement | null = document.createElement("textarea");

        // --- State Flag: CRITICAL for managing textarea behavior ---

        // --- Initial Textarea Styling (Single-Line, Auto-Width Mode) ---
        Object.assign(textarea.style, {
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            padding: `${TEXTAREA_PADDING}px`, // Standardized padding for calculation consistency
            minHeight: `${this.fontSize + 4}px`, // Minimum height for a single line of text
            height: `${this.fontSize + 4}px`, // Explicitly set initial height for single line
            overflow: "hidden", // Hide all scrollbars initially (we'll manage size with JS)
            minWidth: "100px", // A minimum visual width for the input box
            border: `${TEXTAREA_BORDER_SIZE}px solid #ccc`,
            outline: "none",
            fontSize: `${this.fontSize}px`,
            fontFamily: "Aerial", // Crucial: Match font for accurate measurement
            boxSizing: "border-box", // Include padding/border in width/height calculation
            resize: "none", // Disable user manual resize handle
            whiteSpace: "nowrap" // KEY: Prevents text wrapping, allowing horizontal expansion
        });

        if (!canvasContainer) {
            console.error("Canvas container not found.");
            return;
        }

        canvasContainer.appendChild(textarea);

        // --- Hidden Mirror Span for Accurate Measurement ---
        let mirrorSpan: HTMLSpanElement | null = document.createElement("span");
        Object.assign(mirrorSpan.style, {
            visibility: "hidden", // Make it invisible
            position: "absolute", // Take it out of flow
            top: '0',
            left: '0',
            // whiteSpace starts as nowrap to match the textarea's initial state
            whiteSpace: "pre-wrap",
            fontSize: `${this.fontSize}px`,
            minWidth: "100px",
            fontFamily: textarea.style.fontFamily,
            padding: textarea.style.padding,
            boxSizing: textarea.style.boxSizing
        });
        document.body.appendChild(mirrorSpan);

        // Function to dynamically resize the textarea based on its mode
        const resizeTextarea = () => {
            if (!textarea || !mirrorSpan) return;

            mirrorSpan.textContent = textarea.value || " ";
            textarea.style.width = `${Math.max(mirrorSpan.offsetWidth + 4, 100)}px`; // +8px for cursor/buffer
            textarea.style.height = `${Math.max(textarea.scrollHeight, this.fontSize + 4)}px`;

        };

        setTimeout(() => {
            textarea!.focus();
            resizeTextarea(); // Set initial width/height based on placeholder or default value
        }, 50);

        this.activeTextArea = textarea;
        this.activeTextAreaPosition = { x, y };

        let hasUnsavedChanges: boolean = true;

        const save = () => {
            let content = textarea!.value.trim();

            let width = textarea!.offsetWidth;
            let height = textarea!.offsetHeight;
            sendTextToBackend(x, y, content, width, height, this.socket, this.roomId);

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
