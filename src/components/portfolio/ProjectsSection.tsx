import { ExternalLink, Github, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GITHUB_URL, ANIMATION } from '@/lib/constants';
import type { Project } from '@/lib/constants';

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
  },
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
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section id="projects" className="section-padding bg-card relative overflow-hidden">
      <div className="container-portfolio relative">
        <div className="section-number">03</div>

        <div ref={sectionRef} className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Projects
            </span>
            <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Some things I've{' '}
              <span className="gradient-text">built</span>
            </h2>
            <p className={`text-lg text-muted-foreground transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Here are some of my projects. Each one taught me something new and helped me grow as a developer.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`project-card group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${ANIMATION.BASE_DELAY + index * ANIMATION.CATEGORY_STAGGER}ms` }}
              >
                <ProjectImage src={project.img} label={project.imageLabel} />

                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-xl group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="View on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {(project.website || project.itchio) && (
                        <a
                          href={project.website ?? project.itchio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={project.website ? 'Visit site' : 'View on itch.io'}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-secondary rounded-full text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-12 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                View More on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
