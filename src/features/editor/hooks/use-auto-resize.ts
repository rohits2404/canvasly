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

        if (canvas.getWidth() !== width || canvas.getHeight() !== height) {
            canvas.setDimensions({
                width,
                height,
            });
        }

        const center = canvas.getVpCenter();

        const zoomRatio = 0.85;

        const localWorkspace = canvas
            .getObjects()
            .find((object) => object.name === "clip");

        if (!localWorkspace) return;

        const scale = util.findScaleToFit(localWorkspace, {
            width,
            height,
        });

        const zoom = zoomRatio * scale;

        canvas.setViewportTransform([...iMatrix] as TMat2D);

        canvas.zoomToPoint(new Point(center.x, center.y), zoom);

        const workspaceCenter = localWorkspace.getCenterPoint();

        const viewportTransform = canvas.viewportTransform;

        viewportTransform[4] =
            canvas.getWidth() / 2 - workspaceCenter.x * viewportTransform[0];

        viewportTransform[5] =
            canvas.getHeight() / 2 - workspaceCenter.y * viewportTransform[3];

        canvas.setViewportTransform(viewportTransform);

        canvas.requestRenderAll();
    }, [canvas, container]);

    useEffect(() => {
        if (!canvas || !container) return;

        const resizeObserver = new ResizeObserver(() => {
            autoZoom();
        });

        resizeObserver.observe(container);

        autoZoom();

        return () => {
            resizeObserver.disconnect();
        };
    }, [canvas, container, autoZoom]);

    return { autoZoom };
};
