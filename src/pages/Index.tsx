import PortfolioNav from '@/components/portfolio/PortfolioNav';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import TechStackSection from '@/components/portfolio/TechStackSection';
import ContactSection from '@/components/portfolio/ContactSection';
import PortfolioFooter from '@/components/portfolio/PortfolioFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PortfolioNav />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <PortfolioFooter />
    </div>
  );
};

export default Index;
