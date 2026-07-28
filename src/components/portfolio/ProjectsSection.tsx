import { useRef } from 'react';
import { ExternalLink, Github, Folder } from 'lucide-react';
import { GITHUB_URL } from '@/lib/constants';
import type { Project } from '@/lib/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;
    
    // Calculate how far to scroll the track horizontally
    const getScrollAmount = () => {
      const trackWidth = trackRef.current?.scrollWidth || 0;
      return -(trackWidth - window.innerWidth + window.innerWidth * 0.1); // Keep a bit of padding at the end
    };

    const tween = gsap.to(trackRef.current, {
      x: getScrollAmount,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
    });

  }, { scope: containerRef });

  return (
    <section id="projects" ref={containerRef} className="h-screen bg-card relative overflow-hidden flex items-center">
      <div className="absolute top-10 left-10 z-50">
        <div className="section-number opacity-20">03</div>
        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          Projects
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold">
          Passing <span className="gradient-text">By</span>
        </h2>
      </div>

      <div ref={trackRef} className="flex gap-16 px-[10vw] items-center w-max h-full">
        {projects.map((project, index) => (
          <div
            key={project.title}
            className="w-[80vw] md:w-[600px] shrink-0 project-card group bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden"
          >
            <ProjectImage src={project.img} label={project.imageLabel} />

            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-2xl group-hover:text-primary transition-colors">
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
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
