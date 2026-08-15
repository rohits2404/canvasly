import { Canvas, FabricObject } from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
    canvas: Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
    const clipboard = useRef<any>(null);

    const copy = useCallback(async () => {
        const activeObject = canvas?.getActiveObject();

        if (!activeObject) return;

        clipboard.current = await activeObject.clone();
    }, [canvas]);

    const paste = useCallback(async () => {
        if (!canvas || !clipboard.current) return;

        const clonedObj = await clipboard.current.clone();

        canvas.discardActiveObject();

        clonedObj.set({
            left: (clonedObj.left ?? 0) + 10,
            top: (clonedObj.top ?? 0) + 10,
            evented: true,
        });

        if (clonedObj.type === "activeSelection") {
            clonedObj.canvas = canvas;

            clonedObj.forEachObject((obj: FabricObject) => {
                canvas.add(obj);
            });

            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }

        clipboard.current.set({
            left: (clipboard.current.left ?? 0) + 10,
            top: (clipboard.current.top ?? 0) + 10,
        });

        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    }, [canvas]);

    return {
        copy,
        paste,
    };
};
