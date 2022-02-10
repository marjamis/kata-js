export interface ICanvasBoard {
    height: number;
    width: number;
  }
  
  const CanvasBoard = ({ height, width }: ICanvasBoard) => {
    return (
      <canvas
        style={{
          border: "3px solid black",
        }}
        height={height}
        width={width}
      />
    );
  };
