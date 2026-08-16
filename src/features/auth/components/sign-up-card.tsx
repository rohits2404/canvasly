"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const SignUpCard = () => {
    const onProviderSignUp = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Create An Account</CardTitle>
                <CardDescription>
                    Use Your Email Or Another Service To Continue
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        onClick={() => onProviderSignUp("google")}
                        variant="outline"
                        size="lg"
                        className="w-full relative cursor-pointer"
                    >
                        <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue With Google
                    </Button>
                    <Button
                        onClick={() => onProviderSignUp("github")}
                        variant="outline"
                        size="lg"
                        className="w-full relative cursor-pointer"
                    >
                        <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue With Github
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already Have An Account?{" "}
                    <Link href="/sign-in">
                        <span className="text-sky-700 hover:underline">
                            Sign In
                        </span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};
