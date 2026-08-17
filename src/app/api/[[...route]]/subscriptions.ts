import Stripe from "stripe";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";

import { checkIsActive } from "@/features/subscriptions/lib";
import { stripe } from "@/lib/stripe";
import { db } from "@/db/drizzle";
import { subscriptions } from "@/db/schema";

const app = new Hono()

    .post("/billing", verifyAuth(), async (c) => {
        const auth = c.get("authUser");
        const userId = auth.token?.sub;

        if (typeof userId !== "string") {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId));

        if (!subscription) {
            return c.json({ error: "No subscription found" }, 404);
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.customerId,
            return_url: process.env.NEXT_PUBLIC_APP_URL!,
        });

        if (!session.url) {
            return c.json(
                { error: "Failed to create billing portal session" },
                400,
            );
        }

        return c.json({ data: session.url });
    })

    .get("/current", verifyAuth(), async (c) => {
        const auth = c.get("authUser");
        const userId = auth.token?.sub;

        if (typeof userId !== "string") {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const [subscription] = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.userId, userId));

        const active = checkIsActive(subscription);

        return c.json({
            data: {
                ...subscription,
                active,
            },
        });
    })

    .post("/checkout", verifyAuth(), async (c) => {
        const auth = c.get("authUser");
        const userId = auth.token?.sub;

        if (typeof userId !== "string") {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const email = auth.token?.email;

        if (!email) {
            return c.json({ error: "Email not found" }, 400);
        }

        const priceId = process.env.STRIPE_PRICE_ID;

        if (!priceId) {
            return c.json({ error: "Stripe price ID is not configured" }, 500);
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL;

        if (!appUrl) {
            return c.json({ error: "Application URL is not configured" }, 500);
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",

            success_url: `${appUrl}?success=1`,
            cancel_url: `${appUrl}?canceled=1`,

            payment_method_types: ["card", "paypal"],

            billing_address_collection: "auto",

            customer_email: email,

            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],

            metadata: {
                userId,
            },
        });

        if (!session.url) {
            return c.json({ error: "Failed to create checkout session" }, 400);
        }

        return c.json({ data: session.url });
    })

    .post("/webhook", async (c) => {
        const body = await c.req.text();
        const signature = c.req.header("Stripe-Signature");

        if (!signature) {
            return c.json({ error: "Missing Stripe signature" }, 400);
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!,
            );
        } catch (error) {
            console.error("Stripe webhook signature error:", error);

            return c.json({ error: "Invalid signature" }, 400);
        }

        // -----------------------------------------
        // Checkout completed
        // -----------------------------------------
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            if (!session.subscription) {
                return c.json(
                    { error: "No subscription found in checkout session" },
                    400,
                );
            }

            const userId = session.metadata?.userId;

            if (!userId) {
                return c.json(
                    { error: "User ID missing from session metadata" },
                    400,
                );
            }

            const stripeSubscription = await stripe.subscriptions.retrieve(
                session.subscription as string,
            );

            const subscriptionItem = stripeSubscription.items.data[0];

            if (!subscriptionItem) {
                return c.json({ error: "No subscription item found" }, 400);
            }

            // Prevent duplicate DB records
            const [existingSubscription] = await db
                .select()
                .from(subscriptions)
                .where(eq(subscriptions.subscriptionId, stripeSubscription.id));

            if (!existingSubscription) {
                await db.insert(subscriptions).values({
                    status: stripeSubscription.status,
                    userId,
                    subscriptionId: stripeSubscription.id,
                    customerId: stripeSubscription.customer as string,

                    // IMPORTANT: price.id, not price.product
                    priceId: subscriptionItem.price.id,

                    currentPeriodEnd: new Date(
                        subscriptionItem.current_period_end * 1000,
                    ),

                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            return c.json({ received: true }, 200);
        }

        // -----------------------------------------
        // Subscription updated
        // -----------------------------------------
        if (event.type === "customer.subscription.updated") {
            const stripeSubscription = event.data.object as Stripe.Subscription;

            const subscriptionItem = stripeSubscription.items.data[0];

            if (!subscriptionItem) {
                return c.json({ error: "No subscription item found" }, 400);
            }

            await db
                .update(subscriptions)
                .set({
                    status: stripeSubscription.status,

                    customerId: stripeSubscription.customer as string,

                    priceId: subscriptionItem.price.id,

                    currentPeriodEnd: new Date(
                        subscriptionItem.current_period_end * 1000,
                    ),

                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.subscriptionId, stripeSubscription.id));

            return c.json({ received: true }, 200);
        }

        // -----------------------------------------
        // Subscription deleted
        // -----------------------------------------
        if (event.type === "customer.subscription.deleted") {
            const stripeSubscription = event.data.object as Stripe.Subscription;

            const subscriptionItem = stripeSubscription.items.data[0];

            await db
                .update(subscriptions)
                .set({
                    status: stripeSubscription.status,

                    ...(subscriptionItem?.current_period_end
                        ? {
                              currentPeriodEnd: new Date(
                                  subscriptionItem.current_period_end * 1000,
                              ),
                          }
                        : {}),

                    updatedAt: new Date(),
                })
                .where(eq(subscriptions.subscriptionId, stripeSubscription.id));

            return c.json({ received: true }, 200);
        }

        return c.json({ received: true }, 200);
    });

export default app;
