import { useState } from 'react';
import { ExternalLink, Github, Folder, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_URL } from '@/lib/constants';
import type { Project } from '@/lib/constants';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ReactPlayer from 'react-player';

const projects: Project[] = [
  {
    title: 'KampungKu',
    description: 'A Flutter app for kampung management with role-based authentication, warga data, iuran keuangan, marketplace, activity history, and real-time dashboard metrics.',
    tags: ['Flutter', 'Firebase', 'Dart', 'Cloudinary'],
    github: `${GITHUB_URL}/jawara_kel3`,
    imageLabel: 'kampungku.png',
  },
  {
    title: 'Rest Area Business - Idle Tycoon Game',
    description: 'A game jam project about managing a rest area business and handling the mudik rush with a tycoon-style loop.',
    tags: ['Unity', 'Game Jam', 'Simulation', 'Tycoon'],
    github: `${GITHUB_URL}/rest-area-tycoon`,
    itchio: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746',
    img: 'img/tycoon/tycoon.png',
    imageLabel: 'Rest Area Tycoon',
  },
  {
    title: 'TrasMart',
    description: 'A modern web storefront for TrasMart. Live site and source code linked below.',
    tags: ['Website', 'Vercel'],
    github: `${GITHUB_URL}/trasmart-web`,
    website: 'https://trasmart-web.vercel.app/',
    img: 'img/trasmart/trasmart.png',
    imageLabel: 'TrasMart',
  },
  {
    title: 'SarPras',
    description: 'A group project for managing facilities and infrastructure (Sarana Prasarana) with collaborative features.',
    tags: ['Web', 'Kelompok', 'Manajemen'],
    github: `${GITHUB_URL}/Kel6-SarPras`,
    imageLabel: 'sarpras.png',
  },
  {
    title: 'FrameWork',
    description: 'A framework exploration project showcasing software architecture and design patterns.',
    tags: ['Framework', 'Architecture', 'Web'],
    github: `${GITHUB_URL}/frameWork`,
    imageLabel: 'framework.png',
  },
  {
    title: 'Jawara',
    description: 'A web-based application built for community and organizational management needs.',
    tags: ['Web', 'Community', 'Management'],
    github: `${GITHUB_URL}/jawara`,
    imageLabel: 'jawara.png',
  }
];

const gridPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='none' stroke='%23fff' stroke-width='0.5'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3C/g%3E%3C/svg%3E")`;

const ProjectImage = ({ src, label }: { src?: string; label: string }) => {
  if (src) {
    return (
      <div className="aspect-video overflow-hidden rounded-t-2xl">
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video placeholder-img relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: gridPattern }} />
      <div className="relative z-10 flex flex-col items-center gap-3 text-white/60">
        <Folder className="w-12 h-12" />
        <span className="text-sm font-mono">{label}</span>
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <section id="projects" className="h-screen relative overflow-hidden flex items-center bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <ReactPlayer
          url="https://youtu.be/IYF4hg9-e8A?si=PGs1ur77kMuf982d"
          playing={true}
          loop={true}
          muted={isMuted}
          width="100%"
          height="200%"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.5] md:scale-[1.2]"
          config={{
            youtube: {
              playerVars: { controls: 0, showinfo: 0, rel: 0, autoplay: 1 }
            }
          }}
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute top-10 left-10 z-50">
        <div className="section-number opacity-20">03</div>
        <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground backdrop-blur-md text-sm font-medium mb-2 border border-primary/50">
          Projects
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
          Passing <span className="text-primary">By</span>
        </h2>
      </div>

      {/* Audio Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-10 right-10 z-50 bg-black/50 border-primary/50 text-white hover:bg-black/80"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>

      {/* Carousel */}
      <div className="w-full relative z-10">
        <div className="overflow-hidden w-full" ref={emblaRef}>
          <div className="flex">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="flex-[0_0_85%] md:flex-[0_0_600px] min-w-0 pl-6"
              >
                <div className="project-card group bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl overflow-hidden h-full">
                  <ProjectImage src={project.img} label={project.imageLabel} />

                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-semibold text-2xl group-hover:text-primary transition-colors text-foreground">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-full"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {(project.website || project.itchio) && (
                          <a
                            href={project.website ?? project.itchio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-full"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-base mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-sm font-medium bg-secondary rounded-full text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
