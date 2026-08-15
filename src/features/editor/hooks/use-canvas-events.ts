import { Canvas, FabricObject } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
    clearSelectionCallback?: () => void;
    canvas: Canvas | null;
    setSelectedObjects: (objects: FabricObject[]) => void;
}

export const useCanvasEvents = ({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
}: UseCanvasEventsProps) => {
    useEffect(() => {
        if (!canvas) return;

        const disposeSelectionCreated = canvas.on("selection:created", (e) => {
            setSelectedObjects(e.selected);
            clearSelectionCallback?.();
        });

        const disposeSelectionUpdated = canvas.on("selection:updated", (e) => {
            setSelectedObjects(e.selected);
        });

        const disposeSelectionCleared = canvas.on("selection:cleared", () => {
            setSelectedObjects([]);
        });

        return () => {
            disposeSelectionCreated();
            disposeSelectionUpdated();
            disposeSelectionCleared();
        };
    }, [canvas, clearSelectionCallback, setSelectedObjects]);
};
