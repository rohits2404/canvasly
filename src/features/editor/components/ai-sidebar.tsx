import { useGenerateImage } from "@/features/ai/api/use-generate-image";
import { ActiveTool, Editor } from "../types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

interface AiSidebarProps {
    editor: Editor | undefined;
    activeTool: ActiveTool;
    onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
    editor,
    activeTool,
    onChangeActiveTool,
}: AiSidebarProps) => {
    const { shouldBlock, triggerPaywall } = usePaywall();

    const mutation = useGenerateImage();

    const [value, setValue] = useState("");

    const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        if (shouldBlock) {
            triggerPaywall();
            return;
        }

        e.preventDefault();

        mutation.mutate(
            { prompt: value },
            {
                onSuccess: ({ data }) => {
                    if (!data) return;

                    editor?.addImage(data);
                },
            },
        );
    };

    const onClose = () => {
        onChangeActiveTool("select");
    };

    return (
        <aside
            className={cn(
                "bg-white relative border-r z-40 w-90 h-full flex flex-col",
                activeTool === "ai" ? "visible" : "hidden",
            )}
        >
            <ToolSidebarHeader
                title="AI"
                description="Generate an Image Using AI"
            />

            <ScrollArea>
                <form onSubmit={onSubmit} className="p-4 space-y-6">
                    <Textarea
                        disabled={mutation.isPending}
                        placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
                        cols={30}
                        rows={10}
                        required
                        minLength={3}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />

                    <Button
                        disabled={mutation.isPending}
                        type="submit"
                        className="w-full"
                    >
                        Generate
                    </Button>
                </form>
            </ScrollArea>

            <ToolSidebarClose onClick={onClose} />
        </aside>
    );
};
