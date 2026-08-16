import { EditorProjectIdClient } from "@/features/editor";

interface EditorProjectIdPageProps {
    params: Promise<{
        projectId: string;
    }>;
}

const EditorProjectIdPage = async ({ params }: EditorProjectIdPageProps) => {
    const { projectId } = await params;

    return <EditorProjectIdClient projectId={projectId} />;
};

export default EditorProjectIdPage;
