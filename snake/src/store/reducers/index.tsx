import {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    SET_DIS_DIRECTION,
    ISnakeCoord,
    INCREASE_SNAKE,
    INCREMENT_SCORE,
    RESET_SCORE,
} from '../actions'

export interface IGlobalState {
    snake: ISnakeCoord[] | [];
    disallowedDirection: string;
    score: number;
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
    score: 0,
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
        case INCREASE_SNAKE:
            const snakeLen = state.snake.length;
            return {
                ...state,
                snake: [
                    ...state.snake,
                    {
                        x: state.snake[snakeLen - 1].x - 20,
                        y: state.snake[snakeLen - 1].y - 20,
                    },
                ],
            };
        case INCREMENT_SCORE:
            return {
                ...state,
                score: state.score + 1
            }
        case RESET_SCORE:
            return { ...state, score: 0 };
        default:
            return state;
    }
}

export default gameReducer
