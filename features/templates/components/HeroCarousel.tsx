"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "tiny-slider/dist/tiny-slider.css";
import type { templates } from "@/app/generated/prisma/client";

interface HeroCarouselProps {
  templates: templates[];
}

export default function HeroCarousel({ templates }: HeroCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<any>(null);

    useEffect(() => {
    let cancelled = false;

    if (!containerRef.current || templates.length === 0) return;


    const initSlider = () => {
        import("tiny-slider").then(({ tns }) => {
        // Prevent initialization if effect was cleaned up or slider already exists
        if (cancelled || !containerRef.current || sliderRef.current) {
            return;
        }

        sliderRef.current = tns({
            container: containerRef.current,
            items: 1,
            slideBy: 1,
            gutter: 16,
            edgePadding: 100,
            loop: templates.length > 3,
            speed: 400,
            mouseDrag: true,
            swipeAngle: false,
            controls: false,
            nav: false,
            center: true,
            autoHeight: true,
            responsive: {
            640: {
                items: 2,
                edgePadding: 60,
            },
            1024: {
                items: 3,
                edgePadding: 160,
            },
            },
        });
        });
    };

    // Delay slider init if there are video elements to give them time to load
    let timeoutId: NodeJS.Timeout | null = null;
    initSlider();

    return () => {
        cancelled = true;
        if (timeoutId) clearTimeout(timeoutId);
        if (sliderRef.current) {
        sliderRef.current.destroy();
        sliderRef.current = null;
        }
    };
    }, [templates]);

    if (templates.length === 0) {
    return null;
    }

    return (
    <section className="relative sm:py-6 w-full overflow-hidden">
        <div className="w-full">
        <div className="relative w-full">
            <div ref={containerRef} className="hero-carousel select-none">
            {templates.map((template) => (
                <div key={template.id}>
                <Link
                    href={`/template/${template.id}`}
                    className="relative block aspect-video rounded-lg overflow-hidden bg-neutral-900"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                >
                    <Image
                        src={template.image_url ?? ""}
                        alt={template.name}
                        fill
                        className="object-contain pointer-events-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        draggable={false}
                    />
                </Link>
                </div>
            ))}
            </div>
        </div>
        </div>
    </section>
  );
}
