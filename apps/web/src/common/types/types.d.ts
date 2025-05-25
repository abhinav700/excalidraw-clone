export type Tool = "rectangle" | "circle" | "pencil" | "selection" | "eraser" | "line" | "arrow" | "text" | "hand";

export type Rectangle = {
  type: "rectangle",
  startX: number,
  startY: number;
  width: number;
  height: number;
}

export type Coordinates = {
  x: number, 
  y: numberK
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

export type Text = {
  type: "text",
  startX: number,
  startY: number,
  width: number,
  height: number 
  content: string,

  // TODO: add other things like width and font styling
}
export type Shape = Circle | Rectangle | Pencil | Line | Arrow | Text; 

export type ExistingShape = {
  message:string;
  id: number;
}


