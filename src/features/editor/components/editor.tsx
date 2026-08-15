"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Canvas } from "fabric";

export const Editor = () => {
    const { init } = useEditor();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) {
            return;
        }

        const canvas = new Canvas(canvasRef.current, {
            controlsAboveOverlay: true,
            preserveObjectStacking: true,
        });

        init({
            initialCanvas: canvas,
            initialContainer: containerRef.current,
        });

        return () => {
            canvas.dispose();
        };
    }, [init]);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div
                ref={containerRef}
                className="flex-1 min-h-0 overflow-hidden bg-muted"
            >
                <canvas ref={canvasRef} className="block" />
            </div>
        </div>
    );
};
