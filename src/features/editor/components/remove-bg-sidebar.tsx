import { useRemoveBg } from "@/features/ai/api/use-remove-bg";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { FabricImage } from "fabric";

interface RemoveBgSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: RemoveBgSidebarProps) => {
    const mutation = useRemoveBg();

    const selectedObject = editor?.selectedObjects[0];

    const imageSrc =
        selectedObject instanceof FabricImage
            ? selectedObject.getSrc()
            : undefined;

    const onClose = () => {
        onChangeActiveTool("select");
    };

    const onClick = () => {
        if (!imageSrc) return;

        mutation.mutate(
            {
                image: imageSrc,
            },
            {
                onSuccess: ({ data }) => {
                    if (!data) return;

                    editor?.addImage(data);
                },
            },
        );
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-40 w-90 h-full flex flex-col",
                activeTool === "remove-bg" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="Background Removal"
                description="Remove Background From Image Using AI"
            />

            {!imageSrc && (
                <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
                    <AlertTriangle className="size-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-xs">
                        Feature Not Available For This Object
                    </p>
                </div>
            )}

            {imageSrc && (
                <ScrollArea>
                    <div className="p-4 space-y-4">
                        <div
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                                mutation.isPending && "opacity-50",
                            )}
                        >
                            <Image
                                src={imageSrc}
                                fill
                                alt="Image"
                                className="object-cover"
                            />
                        </div>

                        <Button
                            disabled={mutation.isPending}
                            onClick={onClick}
                            className="w-full"
                        >
                            Remove Background
                        </Button>
                    </div>
                </ScrollArea>
            )}

            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};
