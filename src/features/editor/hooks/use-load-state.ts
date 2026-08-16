import { Canvas } from "fabric";
import { useEffect, useRef } from "react";
import { JSON_KEYS } from "../types";

interface UseLoadStateProps {
    autoZoom: () => void;
    canvas: Canvas | null;
    initialState: React.RefObject<string | undefined>;
    canvasHistory: React.RefObject<string[]>;
    setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
    canvas,
    autoZoom,
    initialState,
    canvasHistory,
    setHistoryIndex,
}: UseLoadStateProps) => {
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && initialState?.current && canvas) {
            const data = JSON.parse(initialState.current);

            canvas.loadFromJSON(data).then(() => {
                const currentState = JSON.stringify(canvas.toObject(JSON_KEYS));

                canvasHistory.current = [currentState];
                setHistoryIndex(0);
                autoZoom();
            });

            initialized.current = true;
        }
    }, [canvas, autoZoom, initialState, canvasHistory, setHistoryIndex]);
};
