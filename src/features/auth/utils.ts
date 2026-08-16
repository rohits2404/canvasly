import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCurrentUser = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

    return result[0] ?? null;
};

export const protectServer = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const result = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

    const user = result[0] ?? null;

    if (!user) {
        redirect("/sign-in");
    }

    return user;
};
