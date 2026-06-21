import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ANIMATION } from '@/lib/constants';
import type { SkillCategory } from '@/lib/constants';

const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Python', level: 70 },
      { name: 'Java', level: 65 },
      { name: 'PHP', level: 75 },
      { name: 'C++', level: 55 },
    ],
  },
  {
    title: 'Frontend Development',
    skills: [
      { name: 'React', level: 90 },
      { name: 'Vue.js', level: 75 },
      { name: 'HTML5/CSS3', level: 95 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'SASS', level: 80 },
    ],
  },
  {
    title: 'Backend Development',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 80 },
      { name: 'Laravel', level: 70 },
      { name: 'REST APIs', level: 85 },
      { name: 'GraphQL', level: 60 },
    ],
  },
  {
    title: 'Database & Tools',
    skills: [
      { name: 'MySQL', level: 80 },
      { name: 'PostgreSQL', level: 75 },
      { name: 'MongoDB', level: 70 },
      { name: 'Git', level: 85 },
      { name: 'Docker', level: 65 },
      { name: 'Linux', level: 70 },
    ],
  },
];

const SkillsSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="container-portfolio relative">
        <div className="section-number left">02</div>

        <div ref={sectionRef} className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className={`inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Skills
            </span>
            <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Technologies I{' '}
              <span className="gradient-text">work with</span>
            </h2>
            <p className={`text-lg text-muted-foreground transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              I'm constantly learning and expanding my skillset.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <div
                key={category.title}
                className={`glass-card-enhanced p-8 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${ANIMATION.BASE_DELAY + categoryIndex * ANIMATION.CATEGORY_STAGGER}ms` }}
              >
                <h3 className="font-display font-semibold text-xl mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 rounded-full gradient-bg" />
                  {category.title}
                </h3>
                <div className="space-y-5">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="skill-progress">
                        <div
                          className="skill-progress-bar"
                          style={{
                            width: isVisible ? `${skill.level}%` : '0%',
                            transitionDelay: `${ANIMATION.BASE_DELAY + ANIMATION.ITEM_STAGGER + categoryIndex * ANIMATION.CATEGORY_STAGGER + skillIndex * ANIMATION.SKILL_STAGGER}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
