"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="outline" onClick={() => router.back()} className="gap-2">
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  );
}
