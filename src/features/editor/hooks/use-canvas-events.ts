import { Canvas, FabricObject } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
    save: () => void;
    clearSelectionCallback?: () => void;
    canvas: Canvas | null;
    setSelectedObjects: (objects: FabricObject[]) => void;
}

export const useCanvasEvents = ({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
}: UseCanvasEventsProps) => {
    useEffect(() => {
        if (!canvas) return;

        const handleObjectAdded = () => {
            save();
        };

        const handleObjectRemoved = () => {
            save();
        };

        const handleObjectModified = () => {
            save();
        };

        const handleSelectionCreated = (e: any) => {
            setSelectedObjects(e.selected);
            clearSelectionCallback?.();
        };

        const handleSelectionUpdated = (e: any) => {
            setSelectedObjects(e.selected);
        };

        const handleSelectionCleared = () => {
            setSelectedObjects([]);
        };

        canvas.on("object:added", handleObjectAdded);
        canvas.on("object:removed", handleObjectRemoved);
        canvas.on("object:modified", handleObjectModified);

        canvas.on("selection:created", handleSelectionCreated);
        canvas.on("selection:updated", handleSelectionUpdated);
        canvas.on("selection:cleared", handleSelectionCleared);

        return () => {
            canvas.off("object:added", handleObjectAdded);
            canvas.off("object:removed", handleObjectRemoved);
            canvas.off("object:modified", handleObjectModified);

            canvas.off("selection:created", handleSelectionCreated);
            canvas.off("selection:updated", handleSelectionUpdated);
            canvas.off("selection:cleared", handleSelectionCleared);
        };
    }, [canvas, save, setSelectedObjects, clearSelectionCallback]);
};
