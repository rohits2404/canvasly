import { Canvas, Point, TMat2D, iMatrix, util } from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
    canvas: Canvas | null;
    container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
    const autoZoom = useCallback(() => {
        if (!canvas || !container) return;

        const width = container.offsetWidth;
        const height = container.offsetHeight;

        if (!width || !height) return;

        canvas.setDimensions({
            width,
            height,
        });

        const workspace = canvas
            .getObjects()
            .find((object) => object.name === "clip");

        if (!workspace) return;

        const scale = util.findScaleToFit(workspace, {
            width,
            height,
        });

        const zoom = 0.85 * scale;

        // Reset viewport
        canvas.setViewportTransform([...iMatrix] as TMat2D);

        // Zoom around viewport center
        canvas.zoomToPoint(new Point(width / 2, height / 2), zoom);

        // Center workspace
        const workspaceCenter = workspace.getCenterPoint();

        const viewportTransform = canvas.viewportTransform;

        viewportTransform[4] =
            width / 2 - workspaceCenter.x * viewportTransform[0];

        viewportTransform[5] =
            height / 2 - workspaceCenter.y * viewportTransform[3];

        canvas.setViewportTransform(viewportTransform);

        canvas.requestRenderAll();
    }, [canvas, container]);

    useEffect(() => {
        if (!canvas || !container) return;

        const resizeObserver = new ResizeObserver(() => {
            autoZoom();
        });

        resizeObserver.observe(container);

        // Initial zoom
        autoZoom();

        return () => {
            resizeObserver.disconnect();
        };
    }, [canvas, container, autoZoom]);

    return {
        autoZoom,
    };
};
