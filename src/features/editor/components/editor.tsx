"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Canvas } from "fabric";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";

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
            <Navbar />
            <div className="absolute h-[calc(100%-68px)] w-full top-17 flex">
                <Sidebar />
                <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
                    <Toolbar />
                    <div
                        ref={containerRef}
                        className="flex-1 min-h-0 overflow-hidden bg-muted"
                    >
                        <canvas ref={canvasRef} className="block" />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};
