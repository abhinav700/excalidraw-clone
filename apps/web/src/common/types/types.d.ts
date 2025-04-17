export type Tool = "rectangle" | "circle" | "pencil" | "selection" | "eraser" | "line" | "arrow";

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

export type LineSegment = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type Arrow = LineSegment & {
  type: "arrow";
};

export type Line = LineSegment & {
  type: "line";
}

export type Pencil = {
  type: "pencil";
  lines: LineSegment[] 
}
export type Shape = Circle | Rectangle | Pencil | Line | Arrow; 

export type ExistingShape = {
  message:string;
  id: number;
}


