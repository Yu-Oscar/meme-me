"use client";

import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, FreeMode, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/free-mode";
import "swiper/css/pagination";

export type PopularTemplatesSlide = {
  id: string;
  content: ReactNode;
};

interface PopularTemplatesCarouselProps {
  slides: PopularTemplatesSlide[];
}

export default function PopularTemplatesCarousel({
  slides,
}: PopularTemplatesCarouselProps) {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Grid, FreeMode, Pagination]}
        slidesPerView={2}
        spaceBetween={24}
        grid={{
          rows: 2,
          fill: "row",
        }}
        freeMode={true}
        speed={400}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 3,
            grid: {
              rows: 2,
              fill: "row",
            },
          },
          1024: {
            slidesPerView: 4,
            grid: {
              rows: 2,
              fill: "row",
            },
          },
        }}
        className="popular-carousel pb-10! select-none"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>{slide.content}</SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .popular-carousel .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
        }

        .popular-carousel .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </div>
  );
}
