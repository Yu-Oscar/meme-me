"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { consumeCookieByKey } from "@/actions/cookies";

export default function RedirectToast() {
  const pathname = usePathname();
  
  useEffect(() => {
    consumeCookieByKey("toast").then((message) => {
      if (message) toast.success(message);
    });
  }, [pathname]);

  return null;
}
