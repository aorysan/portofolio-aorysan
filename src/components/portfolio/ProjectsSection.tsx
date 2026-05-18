import { ExternalLink, Github, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectsSection = () => {
  const projects = [
    {
      title: 'POS-System',
      description: 'A Point of Sale system designed for efficient transaction management and inventory tracking.',
      tags: ['Laravel', 'MySQL', 'PHP'],
      github: 'https://github.com/aorysan/POS-System',
    },
    {
      title: 'Rest Area Business - Idle Tycoon Game',
      description: 'A game jam project about managing a rest area business and handling the mudik rush with a tycoon-style loop.',
      tags: ['Unity', 'Game Jam', 'Simulation', 'Tycoon'],
      itchio: 'https://itch.io/jam/tsa-gamefest-game-jam/rate/2845746',
    },
    {
      title: 'TrasMart',
      description: 'A modern web storefront for TrasMart. Live site and source code linked below.',
      tags: ['Website', 'Vercel'],
      github: 'https://github.com/aorysan/trasmart-web',
      website: 'https://trasmart-web.vercel.app/',
    },
  ];

  return (
    <section id="projects" className="section-padding bg-card">
      <div className="container-portfolio">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Projects
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Some things I've{' '}
            <span className="gradient-text">built</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Here are some of my projects. Each one taught me something new and helped me grow as a developer.
          </p>
        </div>

        {/* Projects */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative bg-background rounded-2xl border border-border overflow-hidden card-hover"
            >
              {/* Project Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Folder className="w-16 h-16 text-primary/40" />
              </div>

              <div className="p-6">
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
                        <Github className="w-5 h-5" />
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
                        <ExternalLink className="w-5 h-5" />
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

        {/* View More */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
            asChild
          >
            <a href="https://github.com/aorysan" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View More on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
