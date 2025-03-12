"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";

interface VideoConfigurationProps {
  isOpen?: boolean;
  onClose: () => void;
  video: File | null;
}

export default function VideoConfiguration({ isOpen = false, onClose, video}: VideoConfigurationProps) {
    const [open, setOpen] = useState(false);

    console.log(video)
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
        {video?.name}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </>
  );
}



