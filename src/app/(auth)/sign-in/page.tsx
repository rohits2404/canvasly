import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getCurrentUser } from "@/features/auth/utils";
import { redirect } from "next/navigation";
import React from "react";

const SignInPage = async () => {
    const user = await getCurrentUser();

    if (user) {
        redirect("/");
    }

    return <SignInCard />;
};

export default SignInPage;
