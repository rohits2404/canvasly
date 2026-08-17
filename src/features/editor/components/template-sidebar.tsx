import { useConfirm } from "@/hooks/use-confirm";
import { ActiveTool, Editor } from "../types";
import {
    ResponseType,
    useGetTemplates,
} from "@/features/projects/api/use-get-templates";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { AlertTriangle, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { ToolSidebarClose } from "./tool-sidebar-close";

interface TemplateSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const TemplateSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: TemplateSidebarProps) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Are You Sure?",
        "You Are About To Replace The Current Project With This Template.",
    );

    const { data, isLoading, isError } = useGetTemplates({
        limit: "20",
        page: "1",
    });

    const onClose = () => {
        onChangeActiveTool("select");
    };

    const onClick = async (template: ResponseType["data"][0]) => {
        // TODO: Check if template is pro

        const ok = await confirm();

        if (ok) {
            editor?.loadJson(template.json);
        }
    };

    console.log("Templates:", data);
    console.log("Loading:", isLoading);
    console.log("Error:", isError);

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-40 w-90 h-full flex flex-col",
                activeTool === "templates" ? "visible" : "hidden",
            )}
        >
            <ConfirmDialog />
            <ToolSidebarHeader
                title="Templates"
                description="Choose From a Variety Of Templates To Get Started"
            />
            {isLoading && (
                <div className="flex items-center justify-center flex-1">
                    <Loader className="size-4 text-muted-foreground animate-spin" />
                </div>
            )}
            {isError && (
                <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
                    <AlertTriangle className="size-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-xs">
                        Failed To Fetch Templates
                    </p>
                </div>
            )}
            <ScrollArea>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {data &&
                            data.map((template) => {
                                return (
                                    <button
                                        style={{
                                            aspectRatio: `${template.width}/${template.height}`,
                                        }}
                                        onClick={() => onClick(template)}
                                        key={template.id}
                                        className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                                    >
                                        {template.thumbnailUrl ? (
                                            <Image
                                                fill
                                                src={template.thumbnailUrl}
                                                alt={
                                                    template.name || "Template"
                                                }
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 180px"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-muted text-xs text-muted-foreground">
                                                No Preview
                                            </div>
                                        )}

                                        <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                                            {template.name}
                                        </div>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            </ScrollArea>
            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};
