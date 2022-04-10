import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import {
    clearBoard,
    drawObject,
    generateRandomPosition,
    IObjectBody,
    hasSnakeCollided,
} from "../utilities";
import { IGlobalState } from "../store/reducers";

import {
    increaseSnake,
    INCREASE_SNAKE,
    INCREMENT_SCORE,
    makeMove,
    MOVE_DOWN,
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_UP,
    resetGame,
    RESET_SCORE,
    scoreUpdates,
    stopGame,
} from "../store/actions";

import Instruction from "./Instructions";


export interface ICanvasBoard {
    height: number;
    width: number;
}

const CanvasBoard = ({ height, width }: ICanvasBoard) => {
    const dispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const snake1 = useSelector((state: IGlobalState) => state.snake);
    const [isConsumed, setIsConsumed] = useState<boolean>(false);
    const [pos, setPos] = useState<IObjectBody>(
        generateRandomPosition(width - 20, height - 20)
    );
    const [gameEnded, setGameEnded] = useState<boolean>(false);

    const disallowedDirection = useSelector(
        (state: IGlobalState) => state.disallowedDirection
    );

    const moveSnake = useCallback(
        (dx = 0, dy = 0, ds: string) => {
            if (dx > 0 && dy === 0 && ds !== "RIGHT") {
                dispatch(makeMove(dx, dy, MOVE_RIGHT));
            }

            if (dx < 0 && dy === 0 && ds !== "LEFT") {
                dispatch(makeMove(dx, dy, MOVE_LEFT));
            }

            if (dx === 0 && dy < 0 && ds !== "UP") {
                dispatch(makeMove(dx, dy, MOVE_UP));
            }

            if (dx === 0 && dy > 0 && ds !== "DOWN") {
                dispatch(makeMove(dx, dy, MOVE_DOWN));
            }
        },
        [dispatch]
    );


    const handleKeyEvents = useCallback(
        (event: KeyboardEvent) => {
            if (disallowedDirection) {
                switch (event.key) {
                    case "w":
                        moveSnake(0, -20, disallowedDirection);
                        break;
                    case "s":
                        moveSnake(0, 20, disallowedDirection);
                        break;
                    case "a":
                        moveSnake(-20, 0, disallowedDirection);
                        break;
                    case "d":
                        event.preventDefault();
                        moveSnake(20, 0, disallowedDirection);
                        break;
                }
            } else {
                if (
                    disallowedDirection !== "LEFT" &&
                    disallowedDirection !== "UP" &&
                    disallowedDirection !== "DOWN" &&
                    event.key === "d"
                )
                    moveSnake(20, 0, disallowedDirection);
            }
        },
        [disallowedDirection, moveSnake]
    );

    useEffect(() => {
        clearBoard(context);
        setContext(canvasRef.current && canvasRef.current.getContext("2d"));
        drawObject(context, snake1, "#91C483");
        drawObject(context, [pos], "#676FA3");

        //When the object is consumed
        if (snake1[0].x === pos?.x && snake1[0].y === pos?.y) {
            setIsConsumed(true);
        }

        if (
            hasSnakeCollided(snake1, snake1[0]) ||
            snake1[0].x >= width ||
            snake1[0].x <= 0 ||
            snake1[0].y <= 0 ||
            snake1[0].y >= height
        ) {
            setGameEnded(true);
            dispatch(stopGame());
            window.removeEventListener("keypress", handleKeyEvents);
        } else setGameEnded(false);

    }, [context, pos, snake1]);

    useEffect(() => {
        window.addEventListener("keypress", handleKeyEvents);

        return () => {
            window.removeEventListener("keypress", handleKeyEvents);
        };
    }, [disallowedDirection, handleKeyEvents]);

    useEffect(() => {
        //Generate new object
        if (isConsumed) {
            const posi = generateRandomPosition(width - 20, height - 20);
            setPos(posi);
            setIsConsumed(false);

            //Increase snake size when object is consumed successfully
            dispatch(increaseSnake());

            //Increment the score
            dispatch(scoreUpdates(INCREMENT_SCORE));
        }
    }, [isConsumed, pos, height, width, dispatch]);

    const resetBoard = useCallback(() => {
        window.removeEventListener("keypress", handleKeyEvents);
        dispatch(resetGame());
        dispatch(scoreUpdates(RESET_SCORE));
        clearBoard(context);
        drawObject(context, snake1, "#91C483");
        drawObject(
            context,
            [generateRandomPosition(width - 20, height - 20)],
            "#676FA3"
        ); //Draws object randomly
        window.addEventListener("keypress", handleKeyEvents);
    }, [context, dispatch, handleKeyEvents, height, snake1, width]);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    border: `3px solid ${gameEnded ? "red" : "black"}`,
                }}
                width={width}
                height={height}
            />
            <Instruction resetBoard={resetBoard} />
        </>
    );
};

export default CanvasBoard;
