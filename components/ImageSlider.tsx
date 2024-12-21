"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";
import Image from "next/image";

interface ImageData {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

function ImageSlider() {

  const [images, setImages] = useState<ImageData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const interval = 3000;

  const fetchImages = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&per_page=10`
      );
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const nextImage = useCallback((): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(nextImage, interval);
      return () => clearInterval(id);
    }
  }, [isPlaying, nextImage]);

  const togglePlayPause = (): void => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Image Slider</h1>
      <p className="text-center text-gray-600 mb-8">
        A simple dynamic image slider/carousel with Unsplash.
      </p>
      <Carousel className="rounded-lg overflow-hidden relative shadow-md">
        <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
          key={image.id}
          className={index === currentIndex ? "block" : "hidden"}
          >
          <Image
            src={image.urls.regular}
            alt={image.alt_description}
            width={800}
            height={400}
            className="w-full h-auto object-cover"
          />
          <div className="p-4 bg-white/90 text-center">
            <h2 className="text-xl font-semibold text-gray-800">{image.user.name}</h2>
            <p className="text-sm text-gray-600">
            {image.description || image.alt_description}
            </p>
          </div>
          </CarouselItem>
        ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="bg-white/70 hover:bg-white/90 p-2 rounded-full shadow-md transition-colors"
        >
          {isPlaying ? (
          <PauseIcon className="w-6 h-6 text-gray-800" />
          ) : (
          <PlayIcon className="w-6 h-6 text-gray-800" />
          )}
          <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
        </div>
      </Carousel>
      </div>
    </div>
  )
}

export default ImageSlider