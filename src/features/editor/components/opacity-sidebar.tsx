import { useEffect, useMemo, useState } from "react";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ToolSidebarClose } from "./tool-sidebar-close";

interface OpacitySidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const OpacitySidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: OpacitySidebarProps) => {
    const initialValue = editor?.getActiveOpacity() || 1;
    const selectedObject = useMemo(
        () => editor?.selectedObjects[0],
        [editor?.selectedObjects],
    );

    const [opacity, setOpacity] = useState(initialValue);

    useEffect(() => {
        if (selectedObject) {
            setOpacity(selectedObject.get("opacity") || 1);
        }
    }, [selectedObject]);

    const onClose = () => {
        onChangeActiveTool("select");
    };

    const onChange = (value: number) => {
        editor?.changeOpacity(value);
        setOpacity(value);
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-40 w-90 h-full flex flex-col",
                activeTool === "opacity" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Opacity"
                description="Change The opacity Of The Selected Object"
            />
            <ScrollArea>
                <div className="p-4 space-y-4 border-b">
                    <Slider
                        value={[opacity]}
                        onValueChange={(values) => onChange(values[0])}
                        max={1}
                        min={0}
                        step={0.01}
                    />
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};
