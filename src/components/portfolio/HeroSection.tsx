import { ArrowDown, MapPin, Mail, Code2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import profileAvatar from '@/assets/profile-avatar.jpg';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { EMAIL, MAILTO } from '@/lib/constants';

const HERO_PARTICLES = [0, 1, 2, 3, 4];
const BLOB_DELAYS = ['0s', '2s', '4s'];
const FLOAT_DELAYS = ['0s', '2s', '4s'];

const gridPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23000' stroke-width='1'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/svg%3E")`;

const HeroSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-gradient-shift bg-[length:200%_200%]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: BLOB_DELAYS[1] }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: BLOB_DELAYS[2] }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]" style={{
        backgroundImage: gridPattern,
      }} />

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {HERO_PARTICLES.map((i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${4 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div ref={ref} className="container-portfolio pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Available for opportunities
              <Sparkles className="w-3 h-3 text-accent" />
            </div>

            <h1
              className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Hi, I'm{' '}
              <span className="gradient-text">Aryo Adi Putro</span>
            </h1>

            <p
              className={`text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              A passionate developer based in Malang, East Java. I love building things that live on the internet and solving problems through code.
            </p>

            <div
              className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Malang, Jawa Timur</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={MAILTO} className="hover:text-foreground transition-colors">
                  {EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <span>Full Stack Developer</span>
              </div>
            </div>

            <div
              className={`flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button
                size="lg"
                className="gradient-bg text-primary-foreground hover:opacity-90 transition-opacity rounded-full px-8 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                onClick={() => scrollToSection('#contact')}
              >
                Get in Touch
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={() => scrollToSection('#projects')}
              >
                View Projects
              </Button>
            </div>
          </div>

          {/* Profile Image with ZZZ-style decorative rings */}
          <div
            className={`relative transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-slow" />
              <div className="absolute inset-4 rounded-full border border-accent/20 animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <div className="absolute inset-8 rounded-full border border-primary/10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

              <div className="absolute inset-10 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                <img
                  src={profileAvatar}
                  alt="Aryo Adi Putro"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="absolute -right-4 top-1/4 px-4 py-2 bg-card rounded-xl shadow-lg border border-border animate-float">
                <span className="text-2xl">💻</span>
              </div>
              <div className="absolute -left-4 bottom-1/3 px-4 py-2 bg-card rounded-xl shadow-lg border border-border animate-float" style={{ animationDelay: FLOAT_DELAYS[1] }}>
                <span className="text-2xl">🚀</span>
              </div>
              <div className="absolute -right-2 bottom-1/4 px-4 py-2 bg-card rounded-xl shadow-lg border border-border animate-float" style={{ animationDelay: FLOAT_DELAYS[2] }}>
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection('#about')}
            className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Scroll to about section"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
