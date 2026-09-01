import React from 'react';
import { Navbar } from '../../components/landing/Navbar';
import { Hero } from '../../components/landing/Hero';
import { Stats } from '../../components/landing/Stats';
import { Features } from '../../components/landing/Features';
import { HowItWorks } from '../../components/landing/HowItWorks';
import { PlatformPreview } from '../../components/landing/PlatformPreview';
import { WhyGazaCare } from '../../components/landing/WhyGazaCare';
import { Testimonials } from '../../components/landing/Testimonials';
import { FAQ } from '../../components/landing/FAQ';
import { CTA } from '../../components/landing/CTA';
import { Footer } from '../../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <PlatformPreview />
        <WhyGazaCare />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
