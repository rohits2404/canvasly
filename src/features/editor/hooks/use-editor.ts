import { Canvas, FabricObject, Rect, Shadow } from "fabric";
import { useCallback, useState } from "react";
import { useAutoResize } from "./use-auto-resize";

export const useEditor = () => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    useAutoResize({
        canvas,
        container,
    });

    const init = useCallback(
        ({
            initialCanvas,
            initialContainer,
        }: {
            initialCanvas: Canvas;
            initialContainer: HTMLDivElement;
        }) => {
            FabricObject.prototype.set({
                cornerColor: "#FFF",
                cornerStyle: "circle",
                borderColor: "#3b82f6",
                borderScaleFactor: 1.5,
                transparentCorners: false,
                borderOpacityWhenMoving: 1,
                cornerStrokeColor: "#3b82f6",
            });

            const initialWorkspace = new Rect({
                width: 900,
                height: 1200,
                name: "clip",
                fill: "white",
                selectable: false,
                hasControls: false,
                shadow: new Shadow({
                    color: "rgba(0,0,0,0.8)",
                    blur: 5,
                }),
            });

            initialCanvas.add(initialWorkspace);
            initialCanvas.centerObject(initialWorkspace);
            initialCanvas.clipPath = initialWorkspace;

            const test = new Rect({
                height: 100,
                width: 100,
                fill: "black",
            });

            initialCanvas.add(test);
            initialCanvas.centerObject(test);

            setCanvas(initialCanvas);
            setContainer(initialContainer);
        },
        [],
    );

    return { init };
};
