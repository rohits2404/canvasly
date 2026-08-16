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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export const SignInCard = () => {
    const onProviderSignIn = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Login To Continue</CardTitle>
                <CardDescription>
                    Use Your Email Or Another Service To Continue
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-0 pb-0">
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        onClick={() => onProviderSignIn("google")}
                        variant="outline"
                        size="lg"
                        className="w-full relative cursor-pointer"
                    >
                        <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue With Google
                    </Button>

                    <Button
                        onClick={() => onProviderSignIn("github")}
                        variant="outline"
                        size="lg"
                        className="w-full relative cursor-pointer"
                    >
                        <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue With Github
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Don&apos;t Have An Account?{" "}
                    <Link href="/sign-up">
                        <span className="text-sky-700 hover:underline">
                            Sign Up
                        </span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};
