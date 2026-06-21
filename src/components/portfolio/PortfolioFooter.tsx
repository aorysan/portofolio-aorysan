import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { GITHUB_URL, LINKEDIN_URL, EMAIL, MAILTO, NAV_ITEMS } from '@/lib/constants';

const PortfolioFooter = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-border bg-card">
      <div className="container-portfolio relative">
        <div className="section-number" style={{ fontSize: '6rem', top: '-3rem' }}>05</div>
      </div>

      <div className="container-portfolio py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display font-bold text-xl mb-3">
              <span className="gradient-text">Aryo</span>
              <span className="text-foreground">.dev</span>
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Full Stack Developer based in Malang, Indonesia. Building modern web applications and digital experiences.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">Quick Links</h4>
            <div className="space-y-2">
              {NAV_ITEMS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={MAILTO}
                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">{EMAIL}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>© {currentYear} Aryo Adi Putro. Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
