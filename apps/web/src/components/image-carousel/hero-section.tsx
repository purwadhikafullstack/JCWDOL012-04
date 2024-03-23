"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import { Card, CardContent } from "../ui/card"
import Image from "next/image"

export default function HeroCarousel() {
    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    )

    const images = [
        { url: 'http://localhost:8000/images/hero/slide-1.jpg', alt: 'hero image 1' },
        { url: 'http://localhost:8000/images/hero/slide-2.jpg', alt: 'hero image 2' },
        { url: 'http://localhost:8000/images/hero/slide-3.jpg', alt: 'hero image 3' },
        { url: 'http://localhost:8000/images/hero/slide-4.jpg', alt: 'hero image 4' },
        { url: 'http://localhost:8000/images/hero/slide-5.jpg', alt: 'hero image 5' },
    ]

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full  md:max-w-[1024px]"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.isPlaying}
            opts={{
                align: "start",
            }}
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="basis-1/2 sm:basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-[2/1] items-center justify-center p-0 rounded-md overflow-hidden">
                                    <Image src={image.url} alt={image.alt} width={1280} height={721} />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}
