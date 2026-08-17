import { db } from "./drizzle";
import { projects } from "./schema";

import carSale from "../../public/car_sale.json";
import travel from "../../public/travel.json";
import flashSale from "../../public/flash_sale.json";
import comingSoon from "../../public/coming_soon.json";

const seed = async () => {
    await db.insert(projects).values([
        {
            name: "Car Sale",
            userId: null,
            json: JSON.stringify(carSale),
            width: 900,
            height: 1200,
            thumbnailUrl: "/car_sale.png",
            isTemplate: true,
            isPro: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: "Travel",
            userId: null,
            json: JSON.stringify(travel),
            width: 900,
            height: 1200,
            thumbnailUrl: "/travel.png",
            isTemplate: true,
            isPro: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: "Flash Sale",
            userId: null,
            json: JSON.stringify(flashSale),
            width: 900,
            height: 1200,
            thumbnailUrl: "/flash_sale.png",
            isTemplate: true,
            isPro: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: "Coming Soon",
            userId: null,
            json: JSON.stringify(comingSoon),
            width: 900,
            height: 1200,
            thumbnailUrl: "/coming_soon.png",
            isTemplate: true,
            isPro: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]);

    console.log("✅ Templates Seeded Successfully!");

    process.exit(0);
};

seed().catch((error) => {
    console.error("❌ Seed Failed:", error);
    process.exit(1);
});
