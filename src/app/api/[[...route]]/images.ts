import { Hono } from "hono";

import { unsplash } from "@/lib/unsplash";

const DEFAULT_COUNT = 30;
const DEFAULT_COLLECTION_IDS = ["317099"];

const app = new Hono().get("/", async (c) => {
    const result = await unsplash.GET("/photos/random", {
        params: {
            query: {
                collections: DEFAULT_COLLECTION_IDS,
                count: DEFAULT_COUNT,
            },
        },
    });

    if (result.error) {
        return c.json({ error: "Something Went Wrong" }, 400);
    }

    const data = Array.isArray(result.data) ? result.data : [result.data];

    return c.json({ data });
});

export default app;
