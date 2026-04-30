"use client"

import { DotPattern } from "@/components/ui/dot-pattern"
import { BlurFade } from "@/components/ui/blur-fade"

interface HeroWithGreetingProps {
  greeting?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  stats?: Array<{ value: string; label: string }>
  images?: string[]
}

export function HeroWithGreeting({
  greeting = "Welcome to Thewworks",
  title,
  subtitle,
  stats = [],
  images = [],
}: HeroWithGreetingProps) {

  return (
    <section className="relative w-full overflow-hidden bg-[#faf9f7]">
      <div className="absolute inset-0">
        <DotPattern
          className="opacity-30"
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={0.8}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        <BlurFade delay={0} duration={0.5}>
          <div className="mb-4">
            <span className="inline-block rounded-full bg-[#c9a87c]/20 px-4 py-1.5 text-sm font-medium text-[#8b6914]">
              {greeting}
            </span>
          </div>
        </BlurFade>

        <BlurFade delay={0.1} duration={0.5}>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1a1a1a] md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </BlurFade>

        {subtitle && (
          <BlurFade delay={0.2} duration={0.5}>
            <div className="mx-auto max-w-2xl text-lg text-[#55524d] md:text-xl">
              {subtitle}
            </div>
          </BlurFade>
        )}

        {stats.length > 0 && (
          <BlurFade delay={0.3} duration={0.5}>
            <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-[#c9a87c]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-[#55524d]">{stat.label}</div>
                </div>
              ))}
            </div>
          </BlurFade>
        )}

        {images.length > 0 && (
          <BlurFade delay={0.4} duration={0.6}>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {images.slice(0, 6).map((src, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-[#e8e4dc] cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-[#c9a87c] transition-all duration-300"
                >
                  <img
                    src={src}
                    alt={`Project ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </BlurFade>
        )}
      </div>
    </section>
  )
}