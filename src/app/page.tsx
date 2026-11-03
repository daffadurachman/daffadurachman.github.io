import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { FeaturedProjectsSection } from '@/components/projects/FeaturedProjectsSection';
import { ExperienceDeckSection } from '@/components/experience/ExperienceDeckSection';
import { ProfileAndSkillsSection } from '@/components/profile/ProfileAndSkillsSection';
import { Footer } from '@/components/layout/Footer';
import { FloatingContactDock } from '@/components/layout/FloatingContactDock';

export default function HomePage() {
  return (
    <div>
      <div className="structuralOuterFrame">
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <FeaturedProjectsSection />
          <ExperienceDeckSection />
          <ProfileAndSkillsSection />
        </main>
        <Footer />
      </div>
      <FloatingContactDock />
    </div>
  );
}
