"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Crown, Home, MessageCircleQuestion } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
import { useCheckout } from "../subscriptions/api/use-checkout";
import { useBilling } from "../subscriptions/api/use-billing";
import { usePaywall } from "../subscriptions/hooks/use-paywall";

export const SidebarRoutes = () => {
    const mutation = useCheckout();
    const billingMutation = useBilling();
    const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

    const pathname = usePathname();

    const onClick = () => {
        if (shouldBlock) {
            triggerPaywall();
            return;
        }

        billingMutation.mutate();
    };

    return (
        <div className="flex flex-col gap-y-4 flex-1">
            {shouldBlock && !isLoading && (
                <>
                    <div className="px-3">
                        <Button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                            className="w-full rounded-xl border-none hover:bg-white hover:opacity-75 transition"
                            variant="outline"
                            size="lg"
                        >
                            <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
                            Upgrade To Image AI Pro
                        </Button>
                    </div>
                    <div className="px-3">
                        <Separator />
                    </div>
                </>
            )}
            <ul className="flex flex-col gap-y-1 px-3">
                <SidebarItem
                    href="/"
                    icon={Home}
                    label="Home"
                    isActive={pathname === "/"}
                />
            </ul>
            <div className="px-3">
                <Separator />
            </div>
            <ul className="flex flex-col gap-y-1 px-3">
                <SidebarItem
                    href={pathname}
                    icon={CreditCard}
                    label="Billing"
                    onClick={onClick}
                />
                <SidebarItem
                    href="mailto:rohit310sh@gmail.com"
                    icon={MessageCircleQuestion}
                    label="Get Help"
                />
            </ul>
        </div>
    );
};
