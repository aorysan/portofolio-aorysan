import { Terminal, Database, Wrench, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const techTree = [
  {
    category: 'Frontend Development',
    icon: <Terminal className="w-5 h-5 text-primary" />,
    items: ['React & Next.js', 'TypeScript', 'TailwindCSS', 'GSAP & Lenis'],
  },
  {
    category: 'Backend & Database',
    icon: <Database className="w-5 h-5 text-primary" />,
    items: ['Node.js & Express', 'Firebase', 'PostgreSQL', 'REST APIs'],
  },
  {
    category: 'Tools & Infrastructure',
    icon: <Wrench className="w-5 h-5 text-primary" />,
    items: ['Git & GitHub', 'Vercel / Netlify', 'Figma', 'Unity (Game Dev)'],
  },
];

const TechStackSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section id="media" className="section-padding relative overflow-hidden bg-background">
      <div className="container-portfolio relative">
        <div className="section-number left opacity-10">04</div>

        <div ref={sectionRef} className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Arsenal
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Tech <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tools and technologies used for combat and development.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {techTree.map((branch, idx) => (
              <div 
                key={branch.category}
                className={`glass-card-enhanced p-6 border border-primary/20 bg-card/50 transition-all duration-700 delay-[${idx * 200}ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-4">
                  {branch.icon}
                  <h3 className="font-display font-semibold text-lg text-foreground">{branch.category}</h3>
                </div>
                
                <ul className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-primary/20">
                  {branch.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-background border border-primary/40 flex items-center justify-center shrink-0">
                        <ChevronRight className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
