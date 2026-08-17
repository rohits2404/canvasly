"use client";

import { useRouter } from "next/navigation";
import { useFailModal } from "../store/use-fail-modal";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const FailModal = () => {
    const router = useRouter();
    const { isOpen, onClose } = useFailModal();

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
                        Something Went Wrong
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        We Could Not Process Your Payment
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
