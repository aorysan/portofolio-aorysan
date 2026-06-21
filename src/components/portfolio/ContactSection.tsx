import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { GITHUB_URL, LINKEDIN_URL, EMAIL, MAILTO } from '@/lib/constants';
import type { ContactInfo, SocialLink } from '@/lib/constants';

const contactInfo: ContactInfo[] = [
  {
    icon: Mail,
    label: 'Email',
    value: EMAIL,
    href: MAILTO,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+62 858-1534-6834',
    href: 'tel:+6285815346834',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Malang, Jawa Timur, Indonesia',
    href: null,
  },
];

const socialLinks: SocialLink[] = [
  {
    icon: Github,
    label: 'GitHub',
    href: GITHUB_URL,
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: LINKEDIN_URL,
  },
  {
    icon: Mail,
    label: 'Email',
    href: MAILTO,
  },
];

const ContactSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section id="contact" className="section-padding bg-card relative overflow-hidden">
      <div className="container-portfolio relative">
        <div className="section-number left" style={{ fontSize: '10rem' }}>05</div>

        <div ref={sectionRef} className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className={`section-divider mx-auto transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            <span className={`inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Contact
            </span>
            <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Let's work{' '}
              <span className="gradient-text">together</span>
            </h2>
            <p className={`text-lg text-muted-foreground transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              I'm currently available for freelance work and full-time positions. If you have a project that needs coding or just want to say hi, feel free to reach out!
            </p>
          </div>

          <div className={`max-w-xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-8">
              <div className="glass-card-enhanced p-8">
                <h3 className="font-display font-semibold text-xl mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card-enhanced p-8">
                <h3 className="font-display font-semibold text-xl mb-6">Follow Me</h3>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={link.label}
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
};

export default ContactSection;
