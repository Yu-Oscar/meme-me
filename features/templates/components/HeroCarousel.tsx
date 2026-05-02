"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { templates } from "@/app/generated/prisma/client";
import Image from "next/image";

interface HeroCarouselProps {
  templates: templates[];
}

export default function HeroCarousel({ templates }: HeroCarouselProps) {
  return (
    <section className="relative sm:py-6 w-full overflow-hidden">
      <Swiper
        spaceBetween={16}
        slidesPerView={2.5}
        centeredSlides
        normalizeSlideIndex={false}
        autoHeight
        preventClicks={false}
        preventClicksPropagation={false}
        breakpoints={{
          640: { slidesPerView: 2.25 },
          768: { slidesPerView: 2.75 },
          1024: { slidesPerView: 3.5 },
        }}
        loop
      >
        {templates.map((template) => (
          <SwiperSlide key={template.id} className="bg-background rounded-lg overflow-hidden">
            <Image
              src={template.image_url ?? ""}
              alt={template.name}
              width={1000}
              height={1000}
              className="aspect-video w-full h-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
