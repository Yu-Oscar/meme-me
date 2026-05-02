"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, FreeMode, Pagination } from "swiper/modules";
import type { templates } from "@/app/generated/prisma/client";
import TemplateCard from "./TemplateCard";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/free-mode";
import "swiper/css/pagination";

interface PopularTemplatesCarouselProps {
  templates: templates[];
}

export default function PopularTemplatesCarousel({
  templates,
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
        {templates.map((template) => (
          <SwiperSlide key={template.id}>
            <TemplateCard template={template} />
          </SwiperSlide>
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
