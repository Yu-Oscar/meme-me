"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPath } from "@/utils/path";
import { cn } from "@/lib/utils";

export type NavbarNavItem = {
  label: string;
  href: string;
};

type NavbarMobileNavProps = {
  navItems: NavbarNavItem[];
  guestAuth?: {
    signUpHref: string;
    signInHref: string;
  };
};

export function NavbarMobileNav({ navItems, guestAuth }: NavbarMobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        aria-expanded={open}
        aria-controls="navbar-mobile-drawer"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" aria-hidden />
        <span className="sr-only">Open navigation</span>
      </Button>

      <div
        id="navbar-mobile-drawer"
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/50 transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          aria-label="Close navigation"
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(100vw-3rem,280px)] flex-col gap-4 border-r bg-background p-4 shadow-lg transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" aria-hidden />
              <span className="sr-only">Close navigation</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-lg hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild variant="default" className="mt-2 w-full">
              <Link href={createPath()} onClick={() => setOpen(false)}>
                自製 meme
              </Link>
            </Button>
            {guestAuth ? (
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                <Button asChild variant="secondary" className="w-full">
                  <Link
                    href={guestAuth.signUpHref}
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
                <Button asChild variant="default" className="w-full">
                  <Link
                    href={guestAuth.signInHref}
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
              </div>
            ) : null}
          </nav>
        </div>
      </div>
    </>
  );
}
