import { protectServer } from "@/features/auth/utils";
import { Banner } from "@/features/dashboard/banner";
import { ProjectsSection } from "@/features/dashboard/projects-section";
import { TemplatesSection } from "@/features/dashboard/templates-section";
import React from "react";

const Dashboard = async () => {
    await protectServer();

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto pb-10">
            <Banner />
            <TemplatesSection />
            <ProjectsSection />
        </div>
    );
};

export default Dashboard;
