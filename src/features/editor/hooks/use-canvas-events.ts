import { Canvas, FabricObject } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
    canvas: Canvas | null;
    setSelectedObjects: (objects: FabricObject[]) => void;
}

export const useCanvasEvents = ({
    canvas,
    setSelectedObjects,
}: UseCanvasEventsProps) => {
    useEffect(() => {
        if (!canvas) return;

        const disposeSelectionCreated = canvas.on("selection:created", (e) => {
            setSelectedObjects(e.selected);
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
    }, [canvas, setSelectedObjects]);
};
