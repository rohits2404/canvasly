import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrentUser } from "@/features/auth/utils";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
    const user = await getCurrentUser();

    if (user) {
        redirect("/");
    }

    return <SignUpCard />;
};

export default SignUpPage;
