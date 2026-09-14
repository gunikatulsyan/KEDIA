import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Stats from '../components/Stats';
import About from '../components/About';
import Services from '../components/Services';
import Expertise from '../components/Expertise';
import WhyUs from '../components/WhyUs';
import Process from '../components/Process';
import CTA from '../components/CTA';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <Header />
    <main>
      <Hero />
      <Marquee />
      <Stats />
      <About />
      <Services />
      <Expertise />
      <WhyUs />
      <Process />
      <CTA />
      <Contact />
    </main>
    <Footer />
  </>
);

export default Home;
