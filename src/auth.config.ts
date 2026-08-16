import { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { DefaultSession } from "next-auth";
import { users } from "./db/schema";
import bcrypt from "bcryptjs";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

const CredentialsSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const authConfig = {
    adapter: DrizzleAdapter(db),

    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                const validatedFields =
                    CredentialsSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    return null;
                }

                const { email, password } = validatedFields.data;

                const query = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email));

                const user = query[0];

                if (!user || !user.password) {
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password,
                );

                if (!passwordsMatch) {
                    return null;
                }

                return user;
            },
        }),

        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),

        Google({
            clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: "/sign-in",
        error: "/sign-in",
    },

    session: {
        strategy: "jwt",
    },

    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }

            return token;
        },

        session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }

            return session;
        },
    },
} satisfies NextAuthConfig;
