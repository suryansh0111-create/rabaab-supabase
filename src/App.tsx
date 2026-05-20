/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SignatureDishes from './components/SignatureDishes';
import FullMenu from './components/FullMenu';
import About from './components/About';
import AmbienceGallery from './components/AmbienceGallery';
import Reviews from './components/Reviews';
import Reservation from './components/Reservation';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { isSupabaseConfigured, authService } from './lib/supabase';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl + Shift + 9 (Only when configured)
      if (isSupabaseConfigured && e.ctrlKey && e.shiftKey && e.key === '9') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-primary-bg text-cream overflow-x-hidden selection:bg-royal-gold selection:text-primary-bg">
      {/* Custom Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-royal-gold origin-left z-[100]"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero />
        <SignatureDishes />
        <FullMenu />
        <About />
        <AmbienceGallery />
        <Reviews />
        <Reservation />
      </main>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel onClose={async () => {
            await authService.logout();
            setIsAdminOpen(false);
          }} />
        )}
      </AnimatePresence>

      <Footer />
      
      {/* Floating Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-amber-glow/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-royal-gold/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
