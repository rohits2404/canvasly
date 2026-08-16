import { z } from "zod";
import { db } from "@/db/drizzle";
import { projects, projectsInsertSchema } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";

const app = new Hono()
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            projectsInsertSchema.pick({
                name: true,
                json: true,
                width: true,
                height: true,
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { name, json, height, width } = c.req.valid("json");

            const userId = auth.token?.sub;

            if (typeof userId !== "string") {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .insert(projects)
                .values({
                    name,
                    json,
                    width,
                    height,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            if (!data[0]) {
                return c.json({ error: "Something Went Wrong" }, 400);
            }

            return c.json({ data: data[0] });
        },
    )
    .get(
        "/:id",
        verifyAuth(),
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");

            const userId = auth.token?.sub;

            if (typeof userId !== "string") {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select()
                .from(projects)
                .where(and(eq(projects.id, id), eq(projects.userId, userId)));

            if (data.length === 0) {
                return c.json({ error: "Not Found" }, 404);
            }

            return c.json({ data: data[0] });
        },
    );

export default app;
