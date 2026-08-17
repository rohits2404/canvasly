"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptionModal } from "../store/use-subscription-modal";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "../api/use-checkout";

export const SubscriptionModal = () => {
    const mutation = useCheckout();
    const { isOpen, onClose } = useSubscriptionModal();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="flex items-center space-y-4">
                    <Image src="/logo.svg" alt="Logo" width={36} height={36} />
                    <DialogTitle className="text-center">
                        Upgrade To a Paid Plan
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Upgrade To a Paid Plan To Unlock More Features
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <ul className="space-y-2">
                    <li className="flex items-center">
                        <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
                        <p className="text-sm text-muted-foreground">
                            Unlimited Projects
                        </p>
                    </li>
                    <li className="flex items-center">
                        <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
                        <p className="text-sm text-muted-foreground">
                            Unlimited Templates
                        </p>
                    </li>
                    <li className="flex items-center">
                        <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
                        <p className="text-sm text-muted-foreground">
                            AI Background Removal
                        </p>
                    </li>
                    <li className="flex items-center">
                        <CheckCircle2 className="size-5 mr-2 fill-blue-500 text-white" />
                        <p className="text-sm text-muted-foreground">
                            AI Image Generation
                        </p>
                    </li>
                </ul>
                <DialogFooter className="pt-2 mt-4 gap-y-2">
                    <Button
                        className="w-full"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        Upgrade
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
