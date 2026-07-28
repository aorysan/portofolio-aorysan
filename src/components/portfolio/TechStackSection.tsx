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

        <div ref={sectionRef} className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Arsenal
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Tech <span className="gradient-text">Stack</span>
            </h2>
          </div>

          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative w-full overflow-x-auto pb-12 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8 md:gap-0 min-w-max px-4">
                
                {/* Root Node */}
                <div className="flex items-center h-full relative z-20 md:mt-auto md:mb-auto shrink-0">
                  <div className="glass-card-enhanced p-6 px-8 border-primary/30 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-default bg-card/80">
                    <h3 className="font-display font-bold text-2xl text-foreground whitespace-nowrap">
                      Tech Arsenal
                    </h3>
                  </div>
                  {/* Root Connector */}
                  <div className="hidden md:block w-16 h-px bg-primary/40 shrink-0" />
                </div>

                {/* Branches Container */}
                <div className="flex flex-col gap-10 relative">
                  {/* Main Vertical Spine connecting all branches */}
                  <div className="hidden md:block absolute top-[15%] bottom-[15%] left-0 w-px bg-primary/40" />

                  {techTree.map((branch, idx) => (
                    <div key={branch.category} className="flex flex-col md:flex-row items-start md:items-center gap-6 relative group">
                      {/* Branch Connector (from spine to branch) */}
                      <div className="hidden md:block absolute top-1/2 left-0 w-12 h-px bg-primary/40 transition-colors group-hover:bg-primary/80" />

                      {/* Branch Node */}
                      <div className="glass-card-enhanced p-4 px-6 border-primary/20 bg-card/60 ml-0 md:ml-12 z-20 flex items-center gap-4 w-[300px] shrink-0 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-default group-hover:shadow-lg group-hover:shadow-primary/10">
                        <div className="p-2.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          {branch.icon}
                        </div>
                        <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {branch.category}
                        </h3>
                      </div>

                      {/* Leaves Connector (from branch to leaves) */}
                      <div className="hidden md:block w-12 h-px bg-primary/30 transition-colors group-hover:bg-primary/60 shrink-0" />
                      
                      {/* Leaves Container */}
                      <div className="flex flex-col gap-3 relative w-full">
                        {/* Secondary Vertical Spine connecting leaves */}
                        <div className="hidden md:block absolute top-[15%] bottom-[15%] left-0 w-px bg-primary/20 group-hover:bg-primary/40 transition-colors" />

                        {branch.items.map((item) => (
                          <div key={item} className="relative flex items-center group/leaf hover:-translate-x-1 hover:-translate-y-0.5 transition-transform z-10 pl-0 md:pl-8">
                            {/* Leaf Connector */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-8 h-px bg-primary/20 group-hover/leaf:bg-primary/60 transition-colors" />
                            
                            <div className="glass-card-enhanced py-2 px-5 border-primary/10 bg-background/50 text-muted-foreground font-medium text-sm hover:border-primary/40 hover:text-foreground transition-all duration-300 shadow-sm whitespace-nowrap min-w-[180px] group-hover/leaf:bg-primary/5 group-hover/leaf:shadow-md group-hover/leaf:shadow-primary/5">
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
