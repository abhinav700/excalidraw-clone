export type Tool = "rectangle" | "circle" | "pencil" | "selection" | "eraser";

export type Rectangle = {
  type: "rectangle",
  startX: number,
  startY: number;
  width: number;
  height: number;
}

export type Circle = {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
}

export type Line = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type Pencil = {
  type: "pencil";
  lines: Line[] 
}

export type ExistingShape = {
  message:string;
  id: number;
}

export type Shape = Circle | Rectangle | Pencil; 

