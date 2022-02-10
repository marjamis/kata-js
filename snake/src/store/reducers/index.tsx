import {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    SET_DIS_DIRECTION,
    ISnakeCoord,
} from '../actions'

export interface IGlobalState {
    snake: ISnakeCoord[] | [];
    disallowedDirection: string
}

const globalState: IGlobalState = {
    //Postion of the entire snake
    snake: [
        { x: 580, y: 300 },
        { x: 560, y: 300 },
        { x: 540, y: 300 },
        { x: 520, y: 300 },
        { x: 500, y: 300 },
    ],
    disallowedDirection: "",
};

const gameReducer = (state = globalState, action: any) => {
    switch (action.type) {
        case RIGHT:
        case LEFT:
        case UP:
        case DOWN: {
            let newSnake = [...state.snake];
            newSnake = [{
                //New x and y coordinates
                x: state.snake[0].x + action.payload[0],
                y: state.snake[0].y + action.payload[1],
            }, ...newSnake];
            newSnake.pop();

            return {
                ...state,
                snake: newSnake,
            };
        }
        case SET_DIS_DIRECTION:
            return { ...state, disallowedDirection: action.payload };
        default:
            return state;
    }
}

export default gameReducer
