import { Code2, Lightbulb, Target, Users } from 'lucide-react';

const AboutSection = () => {
  const highlights = [
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

  return (
    <section id="about" className="section-padding bg-card">
      <div className="container-portfolio">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Passionate about creating{' '}
            <span className="gradient-text">digital experiences</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm a developer based in Malang, East Java, Indonesia. I enjoy turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies and continuously learning to improve my craft.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '2+', label: 'Years Experience' },
            { value: '3+', label: 'Projects Completed' },
            { value: '5+', label: 'Technologies' },
            { value: '100%', label: 'Dedication' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl md:text-5xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
