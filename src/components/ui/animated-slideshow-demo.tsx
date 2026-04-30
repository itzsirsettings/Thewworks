"use client"

import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow"

const SLIDES = [
  {
    id: "slide-1",
    title: "3d Signages",
    imageUrl: "/images/3d signages.jpg",
  },
  {
    id: "slide-2",
    title: "Cap branding",
    imageUrl: "/images/Cap branding.jpg",
  },
  {
    id: "slide-3",
    title: "van branding",
    imageUrl: "/images/van branding.jpg",
  },
  {
    id: "slide-4",
    title: "Rollup stand",
    imageUrl: "/images/Rollup stand.jpg",
  },
  {
    id: "slide-5",
    title: "Mugs",
    imageUrl: "/images/mugs.jpg",
  },
  {
    id: "slide-6",
    title: "Vest branding",
    imageUrl: "/images/Vest branding.jpg",
  },
]

export function HoverSliderDemo() {
  return (
    <HoverSlider className="min-h-[60vh] w-full flex flex-col justify-center px-6 md:px-12 bg-[#faf9f5] text-[#3d3929]">
      <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
        <div className="flex flex-col space-y-2 md:space-y-4">
          {SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.title}
              index={index}
              className="cursor-pointer text-4xl font-bold uppercase tracking-tighter"
              text={slide.title}
            />
          ))}
        </div>
        <HoverSliderImageWrap>
          {SLIDES.map((slide, index) => (
            <div key={slide.id}>
              <HoverSliderImage
                index={index}
                imageUrl={slide.imageUrl}
                src={slide.imageUrl}
                alt={slide.title}
                className="size-full max-h-96 w-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </HoverSliderImageWrap>
      </div>
    </HoverSlider>
  )
}