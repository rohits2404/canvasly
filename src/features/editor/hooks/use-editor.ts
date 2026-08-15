import {
    Canvas,
    Circle,
    FabricObject,
    Polygon,
    Rect,
    Shadow,
    Triangle,
} from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "./use-auto-resize";
import {
    BuildEditorProps,
    CIRCLE_OPTIONS,
    DIAMOND_OPTIONS,
    Editor,
    EditorHookProps,
    FILL_COLOR,
    RECTANGLE_OPTIONS,
    STROKE_COLOR,
    STROKE_DASH_ARRAY,
    STROKE_WIDTH,
    TRIANGLE_OPTIONS,
} from "../types";
import { isTextType } from "../utils";
import { useCanvasEvents } from "./use-canvas-events";

const buildEditor = ({
    canvas,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    selectedObjects,
    strokeDashArray,
    setStrokeDashArray,
}: BuildEditorProps): Editor => {
    const getWorkspace = () => {
        return canvas.getObjects().find((object) => object.name === "clip");
    };

    const center = (object: FabricObject) => {
        const workspace = getWorkspace();
        const center = workspace?.getCenterPoint();

        if (!center) return;
        canvas._centerObject(object, center);
    };

    const addToCanvas = (object: FabricObject) => {
        center(object);
        canvas.add(object);
        canvas.setActiveObject(object);
    };

    return {
        getActiveOpacity: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return 1;
            }

            const value = selectedObject.get("opacity") || 1;

            return value;
        },
        changeOpacity: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                object.set({ opacity: value });
            });
            canvas.renderAll();
        },
        bringForward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.bringObjectForward(object);
            });

            const workspace = getWorkspace();

            if (workspace) {
                canvas.sendObjectToBack(workspace);
            }

            canvas.requestRenderAll();
        },
        sendBackwards: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.sendObjectBackwards(object);
            });

            const workspace = getWorkspace();

            if (workspace) {
                canvas.sendObjectToBack(workspace);
            }

            canvas.requestRenderAll();
        },
        changeFillColor: (value: string) => {
            setFillColor(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ fill: value });
            });
            canvas.renderAll();
        },
        changeStrokeColor: (value: string) => {
            setStrokeColor(value);
            canvas.getActiveObjects().forEach((object) => {
                // Text types don't have stroke
                if (isTextType(object.type)) {
                    object.set({ fill: value });
                    return;
                }

                object.set({ stroke: value });
            });
            canvas.renderAll();
        },
        changeStrokeWidth: (value: number) => {
            setStrokeWidth(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeWidth: value });
            });
            canvas.renderAll();
        },
        changeStrokeDashArray: (value: number[]) => {
            setStrokeDashArray(value);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeDashArray: value });
            });
            canvas.renderAll();
        },
        addCircle: () => {
            const object = new Circle({
                ...CIRCLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addSoftRectangle: () => {
            const object = new Rect({
                ...RECTANGLE_OPTIONS,
                rx: 50,
                ry: 50,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addRectangle: () => {
            const object = new Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addTriangle: () => {
            const object = new Triangle({
                ...TRIANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray: strokeDashArray,
            });

            addToCanvas(object);
        },
        addInverseTriangle: () => {
            const HEIGHT = TRIANGLE_OPTIONS.height;
            const WIDTH = TRIANGLE_OPTIONS.width;

            const object = new Polygon(
                [
                    { x: 0, y: 0 },
                    { x: WIDTH, y: 0 },
                    { x: WIDTH / 2, y: HEIGHT },
                ],
                {
                    ...TRIANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                },
            );

            addToCanvas(object);
        },
        addDiamond: () => {
            const HEIGHT = DIAMOND_OPTIONS.height;
            const WIDTH = DIAMOND_OPTIONS.width;

            const object = new Polygon(
                [
                    { x: WIDTH / 2, y: 0 },
                    { x: WIDTH, y: HEIGHT / 2 },
                    { x: WIDTH / 2, y: HEIGHT },
                    { x: 0, y: HEIGHT / 2 },
                ],
                {
                    ...DIAMOND_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray,
                },
            );

            addToCanvas(object);
        },
        canvas,
        getActiveFillColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return fillColor;
            }

            const value = selectedObject.get("fill") || fillColor;

            // Currently, gradients & patterns are not supported
            return value as string;
        },
        getActiveStrokeColor: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeColor;
            }

            const value = selectedObject.get("stroke") || strokeColor;

            return value;
        },
        getActiveStrokeWidth: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeWidth;
            }

            const value = selectedObject.get("strokeWidth") || strokeWidth;

            return value;
        },
        getActiveStrokeDashArray: () => {
            const selectedObject = selectedObjects[0];

            if (!selectedObject) {
                return strokeDashArray;
            }

            const value =
                selectedObject.get("strokeDashArray") || strokeDashArray;

            return value;
        },
        selectedObjects,
    };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [selectedObjects, setSelectedObjects] = useState<FabricObject[]>([]);

    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setStrokeDashArray] =
        useState<number[]>(STROKE_DASH_ARRAY);

    useAutoResize({
        canvas,
        container,
    });

    useCanvasEvents({
        canvas,
        setSelectedObjects,
        clearSelectionCallback,
    });

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                canvas,
                fillColor,
                strokeWidth,
                strokeColor,
                setFillColor,
                setStrokeColor,
                setStrokeWidth,
                selectedObjects,
                strokeDashArray,
                setStrokeDashArray,
            });
        }

        return undefined;
    }, [
        canvas,
        fillColor,
        strokeWidth,
        strokeColor,
        selectedObjects,
        strokeDashArray,
    ]);

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

            setCanvas(initialCanvas);
            setContainer(initialContainer);
        },
        [],
    );

    return { init, editor };
};
