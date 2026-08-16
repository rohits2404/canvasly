import { z } from "zod";
import { db } from "@/db/drizzle";
import { projects, projectsInsertSchema } from "@/db/schema";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq, desc, asc } from "drizzle-orm";

const app = new Hono()
    .get(
        "/templates",
        verifyAuth(),
        zValidator(
            "query",
            z.object({
                page: z.coerce.number(),
                limit: z.coerce.number(),
            }),
        ),
        async (c) => {
            const { page, limit } = c.req.valid("query");

            const data = await db
                .select()
                .from(projects)
                .where(eq(projects.isTemplate, true))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(asc(projects.isPro), desc(projects.updatedAt));

            return c.json({ data });
        },
    )
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
    )
    .patch(
        "/:id",
        verifyAuth(),
        zValidator("param", z.object({ id: z.string() })),
        zValidator(
            "json",
            projectsInsertSchema
                .omit({
                    id: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true,
                })
                .partial(),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            const userId = auth.token?.sub;

            if (typeof userId !== "string") {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .update(projects)
                .set({
                    ...values,
                    updatedAt: new Date(),
                })
                .where(and(eq(projects.id, id), eq(projects.userId, userId)))
                .returning();

            if (data.length === 0) {
                return c.json({ error: "Not Found" }, 404);
            }

            return c.json({ data: data[0] });
        },
    )
    .get(
        "/",
        verifyAuth(),
        zValidator(
            "query",
            z.object({
                page: z.coerce.number(),
                limit: z.coerce.number(),
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { page, limit } = c.req.valid("query");

            const userId = auth.token?.sub;

            if (typeof userId !== "string") {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select()
                .from(projects)
                .where(eq(projects.userId, userId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(projects.updatedAt));

            return c.json({
                data,
                nextPage: data.length === limit ? page + 1 : null,
            });
        },
    )
    .post(
        "/:id/duplicate",
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

            const project = data[0];

            const duplicateData = await db
                .insert(projects)
                .values({
                    name: `Copy of ${project.name}`,
                    json: project.json,
                    width: project.width,
                    height: project.height,
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            return c.json({ data: duplicateData[0] });
        },
    )
    .delete(
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
                .delete(projects)
                .where(and(eq(projects.id, id), eq(projects.userId, userId)))
                .returning();

            if (data.length === 0) {
                return c.json({ error: "Not Found" }, 404);
            }

            return c.json({ data: { id } });
        },
    );

export default app;
