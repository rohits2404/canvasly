"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Canvas } from "fabric";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { Footer } from "./footer";
import { ActiveTool } from "../types";

export const Editor = () => {
    const [activeTool, setActiveTool] = useState<ActiveTool>("select");

    const onChangeActiveTool = useCallback(
        (tool: ActiveTool) => {
            if (tool === activeTool) {
                return setActiveTool("select");
            }

            if (tool === "draw") {
                // TODO: Enable draw mode
            }

            if (activeTool === "draw") {
                /// TODO: Disable draw mode
            }

            setActiveTool(tool);
        },
        [activeTool],
    );

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
            <Navbar
                activeTool={activeTool}
                onChangeActiveTool={onChangeActiveTool}
            />
            <div className="absolute h-[calc(100%-68px)] w-full top-17 flex">
                <Sidebar
                    activeTool={activeTool}
                    onChangeActiveTool={onChangeActiveTool}
                />
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
