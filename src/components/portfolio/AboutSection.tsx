import { Code2, Lightbulb, Target, Users, GraduationCap, Briefcase } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ANIMATION } from '@/lib/constants';
import type { Highlight, Journey, Stat } from '@/lib/constants';

const highlights: Highlight[] = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable and scalable code is my priority',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solver',
    description: 'I love tackling complex challenges with creative solutions',
  },
  {
    icon: Target,
    title: 'Goal Oriented',
    description: 'Focused on delivering results that exceed expectations',
  },
  {
    icon: Users,
    title: 'Team Player',
    description: 'Collaborating effectively to achieve common goals',
  },
];

const journey: Journey[] = [
  {
    icon: GraduationCap,
    title: 'Started Learning',
    period: '2022',
    description: 'Began my journey into web development, learning HTML, CSS, and JavaScript.',
  },
  {
    icon: Briefcase,
    title: 'First Projects',
    period: '2023',
    description: 'Built my first full-stack applications and participated in game jams.',
  },
  {
    icon: Code2,
    title: 'Skill Expansion',
    period: '2024',
    description: 'Mastered React, TypeScript, and modern development tools.',
  },
  {
    icon: Target,
    title: 'Ongoing Growth',
    period: 'Now',
    description: 'Continuously learning and building impactful projects.',
  },
];

const stats: Stat[] = [
  { value: '2+', label: 'Years Experience' },
  { value: '3+', label: 'Projects Completed' },
  { value: '5+', label: 'Technologies' },
  { value: '100%', label: 'Dedication' },
];

const AboutSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="section-padding bg-card relative overflow-hidden">
      <div className="container-portfolio relative">
        <div className="section-number">01</div>

        <div ref={sectionRef} className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className={`inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              About Me
            </span>
            <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Passionate about creating{' '}
              <span className="gradient-text">digital experiences</span>
            </h2>
            <p className={`text-lg text-muted-foreground leading-relaxed transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              I'm a developer based in Malang, East Java, Indonesia. I enjoy turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies and continuously learning to improve my craft.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className={`group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-lg ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${ANIMATION.BASE_DELAY + index * ANIMATION.ITEM_STAGGER}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className={`max-w-3xl mx-auto transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="font-display text-2xl font-bold text-center mb-12">
              My <span className="gradient-text">Journey</span>
            </h3>
            <div className="relative pl-8 space-y-12">
              <div className="timeline-line" />
              {journey.map((item) => (
                <div key={item.title} className="relative">
                  <div className="timeline-dot" style={{ top: '0.5rem' }} />
                  <div className="pl-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-mono text-primary">{item.period}</span>
                        <h4 className="font-display font-semibold">{item.title}</h4>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm ml-[3.25rem]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
