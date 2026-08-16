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
import { useSignUp } from "../hooks/use-sign-up";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const SignUpCard = () => {
    const mutation = useSignUp();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onProviderSignUp = (provider: "github" | "google") => {
        signIn(provider, { callbackUrl: "/" });
    };

    const onCredentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutation.mutate(
            {
                name,
                email,
                password,
            },
            {
                onSuccess: () => {
                    signIn("credentials", {
                        email,
                        password,
                        callbackUrl: "/",
                    });
                },
            },
        );
    };

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Create An Account</CardTitle>
                <CardDescription>
                    Use Your Email Or Another Service To Continue
                </CardDescription>
            </CardHeader>
            {!!mutation.error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>Something Went Wrong</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onCredentialSignUp} className="space-y-2.5">
                    <Input
                        disabled={mutation.isPending}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        type="text"
                        required
                    />
                    <Input
                        disabled={mutation.isPending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={mutation.isPending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                        minLength={3}
                        maxLength={20}
                    />
                    <Button
                        disabled={mutation.isPending}
                        type="submit"
                        className="w-full"
                        size="lg"
                    >
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={mutation.isPending}
                        onClick={() => onProviderSignUp("google")}
                        variant="outline"
                        size="lg"
                        className="w-full relative cursor-pointer"
                    >
                        <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue With Google
                    </Button>
                    <Button
                        disabled={mutation.isPending}
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
