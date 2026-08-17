"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSuccessModal } from "../store/use-success-modal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const SuccessModal = () => {
    const router = useRouter();
    const { isOpen, onClose } = useSuccessModal();

    const handleClose = () => {
        router.replace("/");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader className="flex items-center space-y-4">
                    <Image src="/logo.svg" alt="Logo" width={36} height={36} />
                    <DialogTitle className="text-center">
                        Subscription Successfull!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        You Have Successfully Subscribed To Our Service
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2 mt-4 gap-y-2">
                    <Button className="w-full" onClick={handleClose}>
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
