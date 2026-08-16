"use client";

import { Button } from "@/components/ui/button";
import { Editor } from "@/features/editor/components/editor";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { Loader, TriangleAlert } from "lucide-react";
import Link from "next/link";

interface EditorProjectIdClientProps {
    projectId: string;
}

export const EditorProjectIdClient = ({
    projectId,
}: EditorProjectIdClientProps) => {
    const { data, isLoading, isError } = useGetProject(projectId);

    if (isLoading || !data) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-full flex flex-col gap-y-5 items-center justify-center">
                <TriangleAlert className="size-6 text-muted-foreground" />

                <p className="text-muted-foreground text-sm">
                    Failed To Fetch Project
                </p>

                <Button asChild variant="secondary">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    return <Editor initialData={data} />;
};
