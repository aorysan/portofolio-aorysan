import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Folder, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GITHUB_URL } from '@/lib/constants';
import type { Project } from '@/lib/constants';
// Removed ReactPlayer import since native iframe works more reliably here


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
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser autoplay policy
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleToggleMute = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMuted(customEvent.detail.isMuted);
    };
    window.addEventListener('toggle-mute', handleToggleMute);
    return () => window.removeEventListener('toggle-mute', handleToggleMute);
  }, []);

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const message = JSON.stringify({
        event: 'command',
        func: isMuted ? 'mute' : 'unMute',
        args: []
      });
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  }, [isMuted]);

  return (
    <section id="projects" className="h-screen relative overflow-hidden flex flex-col justify-center bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] min-w-[177.77vh] min-h-[56.25vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src="https://www.youtube.com/embed/IYF4hg9-e8A?autoplay=1&mute=1&loop=1&playlist=IYF4hg9-e8A&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1"
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="absolute top-10 left-6 md:top-16 md:left-16 z-30">
        <div className="absolute -top-16 -left-4 text-9xl font-bold text-white/[0.03] z-[-1] select-none pointer-events-none tracking-tighter">03</div>
        <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-white backdrop-blur-md text-sm font-medium mb-4 border border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          Projects
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Passing <span className="text-primary">By</span>
        </h2>
      </div>

      {/* Audio Toggle Button moved to Top Navbar */}

      {/* Carousel */}
      <div className="w-full relative z-10 overflow-hidden -mt-24 md:-mt-48">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...projects, ...projects].map((project, index) => (
            <div
              key={`${project.title}-${index}`}
              className="flex-[0_0_250px] min-w-0 pl-[72px]"
            >
              <div className="project-card group relative bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl overflow-hidden h-full flex flex-col">
                <ProjectImage src={project.img} label={project.imageLabel} />

                <div className="p-4 relative z-10 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-lg group-hover:text-primary transition-colors text-foreground line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {(project.website || project.itchio) && (
                        <a
                          href={project.website ?? project.itchio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-full z-20"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium bg-secondary rounded-full text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Repository Link Overlay */}
                {project.github && (
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                    <Button asChild variant="default" className="gap-2 shadow-lg">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        View Repository
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
