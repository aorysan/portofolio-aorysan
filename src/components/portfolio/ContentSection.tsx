import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { GITHUB_URL, ANIMATION } from '@/lib/constants';
import type { CarouselApi } from '@/components/ui/carousel';
import type { GallerySlide, GalleryImage } from '@/lib/constants';

const slides: GallerySlide[] = [
  {
    title: 'KampungKu',
    subtitle: 'Mobile App',
    description: 'A Flutter app for kampung management with role-based authentication, warga data, iuran keuangan, marketplace, and activity history.',
    link: `${GITHUB_URL}/jawara_kel3`,
    images: [],
  },
  {
    title: 'Rest Area Tycoon',
    subtitle: 'Game Development',
    description: 'An idle tycoon game about managing a rest area business during mudik rush, built for TSA GameFest game jam.',
    link: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746',
    images: [
      { src: 'img/tycoon/tycoon.png', label: 'Main Menu' },
      { src: 'img/tycoon/tycoon1.png', label: 'Gameplay' },
    ],
  },
  {
    title: 'TrasMart',
    subtitle: 'E-Commerce',
    description: 'A modern web storefront with product listings, shopping cart, and order management system.',
    link: `${GITHUB_URL}/trasmart-web`,
    images: [
      { src: 'img/trasmart/trasmart.png', label: 'Homepage' },
      { src: 'img/trasmart/dashboard.png', label: 'Dashboard' },
      { src: 'img/trasmart/reward.png', label: 'Rewards' },
    ],
  },
  {
    title: 'SarPras',
    subtitle: 'Group Project',
    description: 'A collaborative project for managing facilities and infrastructure (Sarana Prasarana).',
    link: `${GITHUB_URL}/Kel6-SarPras`,
    images: [],
  },
  {
    title: 'FrameWork',
    subtitle: 'Architecture',
    description: 'A framework exploration project showcasing software architecture and design patterns.',
    link: `${GITHUB_URL}/frameWork`,
    images: [],
  },
  {
    title: 'Jawara',
    subtitle: 'Web App',
    description: 'A web-based application built for community and organizational management needs.',
    link: `${GITHUB_URL}/jawara`,
    images: [],
  },
];

const ProjectSlide = ({ slide }: { slide: GallerySlide }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = slide.images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % slide.images.length);
    }, ANIMATION.INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slide.images.length, hasMultiple]);

  return (
    <div className="glass-card-enhanced overflow-hidden">
      <div className="aspect-video bg-card relative overflow-hidden">
        {slide.images.length > 0 ? (
          <>
            {slide.images.map((img: GalleryImage, i: number) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.label}
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
                  i === imgIndex ? 'opacity-100' : 'opacity-0'
                )}
              />
            ))}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-mono text-foreground">
              {imgIndex + 1} / {slide.images.length}
            </div>
            {hasMultiple && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {slide.images.map((_: GalleryImage, i: number) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={cn(
                      'w-1.5 h-1.5 rounded-full transition-all duration-300',
                      i === imgIndex
                        ? 'w-4 bg-primary'
                        : 'bg-white/50 hover:bg-white/80'
                    )}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full placeholder-img flex flex-col items-center justify-center gap-3 text-white/60">
            <Folder className="w-12 h-12" />
            <span className="text-sm font-mono">No screenshot yet</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {slide.title}
          </span>
          <span className="text-xs text-muted-foreground">{slide.subtitle}</span>
        </div>
        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
          {slide.description}
        </p>
      </div>
    </div>
  );
};

const ContentSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleApi = useCallback((api: CarouselApi) => {
    if (!api) return;
    const update = () => setActiveSlide(api.selectedScrollSnap());
    api.on('select', update);
    update();
  }, []);

  return (
    <section id="media" className="section-padding relative overflow-hidden">
      <div className="container-portfolio relative">
        <div className="section-number left">04</div>

        <div ref={sectionRef} className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className={`inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Gallery
            </span>
            <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Project{' '}
              <span className="gradient-text">Gallery</span>
            </h2>
            <p className={`text-lg text-muted-foreground transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Screenshots and previews from my projects.
            </p>
          </div>

          <div className={`max-w-4xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Carousel
              opts={{ loop: true, align: 'center' }}
              setApi={handleApi}
            >
              <div className="relative">
                <CarouselContent>
                  {slides.map((slide) => (
                    <CarouselItem key={slide.title} className="md:basis-4/5 lg:basis-3/4">
                      <ProjectSlide slide={slide} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="hidden md:flex -left-4 bg-background/80 border-border" />
                <CarouselNext className="hidden md:flex -right-4 bg-background/80 border-border" />
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      index === activeSlide
                        ? 'w-6 gradient-bg'
                        : 'bg-secondary hover:bg-secondary-foreground/30'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>

          <div className={`text-center mt-10 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5 mr-2" />
                View More on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
