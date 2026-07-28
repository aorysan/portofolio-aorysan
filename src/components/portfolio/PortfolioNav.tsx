import { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Volume2, VolumeX } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useActiveSection } from '@/hooks/useScrollAnimation';
import { SECTION_IDS, NAV_ITEMS, GITHUB_URL, LINKEDIN_URL } from '@/lib/constants';

const PortfolioNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const activeSection = useActiveSection([...SECTION_IDS]);

  const toggleMute = () => {
    const newValue = !isMuted;
    setIsMuted(newValue);
    window.dispatchEvent(new CustomEvent('toggle-mute', { detail: { isMuted: newValue } }));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const renderNavLink = (item: typeof NAV_ITEMS[number]) => {
    const isActive = activeSection === item.href.replace('#', '');
    return (
      <a
        key={item.label}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          scrollToSection(item.href);
        }}
        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'text-primary bg-primary/10'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }`}
      >
        {item.label}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
        )}
      </a>
    );
  };

  const renderMobileNavLink = (item: typeof NAV_ITEMS[number]) => {
    const isActive = activeSection === item.href.replace('#', '');
    return (
      <a
        key={item.label}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          scrollToSection(item.href);
        }}
        className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
          isActive ? 'text-primary bg-primary/10' : 'text-foreground'
        }`}
      >
        {item.label}
      </a>
    );
  };

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="container-portfolio">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home');
              }}
              className="font-display font-bold text-xl tracking-tight"
            >
              <span className="gradient-text">Aryo</span>
              <span className="text-foreground">.dev</span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(renderNavLink)}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <button
                  onClick={toggleMute}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle Audio"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleMute}
                className="p-2 text-foreground"
                aria-label="Toggle Audio"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-foreground"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="container-portfolio py-4 space-y-1">
            {NAV_ITEMS.map(renderMobileNavLink)}
            <div className="flex items-center gap-4 pt-4 border-t border-border px-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="section-indicators">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.href.replace('#', '');
          return (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className={`section-indicator ${isActive ? 'active' : ''}`}
            >
              <span className="indicator-label">{item.label}</span>
              <span className="indicator-line" />
            </button>
          );
        })}
      </div>
    </>
  );
};

export default PortfolioNav;
