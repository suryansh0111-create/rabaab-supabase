import { motion } from 'motion/react';
import { ChevronDown, Play } from 'lucide-react';
import { useSiteContent } from '../hooks/useContent';

export default function Hero() {
  const { data: heroData } = useSiteContent('hero', {
    tagline: 'Sector 5, Panchkula',
    headline: 'Where Royal Flavours Meet Modern Luxury',
    subheadline: "Experience Panchkula's premium Mughlai & North Indian dining destination.",
    backgroundImage: '/images/rabaab-hero.jpg'
  });

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with cinematic zoom */}
      <motion.div 
        key={heroData.backgroundImage}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/80 via-primary-bg/40 to-primary-bg z-10" />
        <img 
          src={heroData.backgroundImage || '/images/rabaab-hero.jpg'} 
          alt="Rabaab - Royal Mughlai Luxury Dining" 
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.5em] mb-4 block">{heroData.tagline}</span>
          <h1 className="text-5xl md:text-8xl font-serif text-cream mb-6 leading-tight whitespace-pre-line">
            {heroData.headline}
          </h1>
          <p className="text-cream/70 font-sans text-sm md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide">
            {heroData.subheadline}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a 
            href="#reserve" 
            className="group relative px-10 py-4 bg-royal-gold text-primary-bg font-sans text-sm uppercase tracking-widest rounded transition-all duration-500 hover:bg-warm-gold hover:shadow-[0_0_30px_rgba(200,169,107,0.4)] overflow-hidden"
          >
            <span className="relative z-10">Reserve A Table</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </a>
          <a 
            href="#menu" 
            className="flex items-center space-x-3 text-cream hover:text-royal-gold transition-colors duration-300 group"
          >
            <div className="w-12 h-12 rounded-full border border-cream/30 flex items-center justify-center group-hover:border-royal-gold transition-colors">
              <Play size={16} className="text-royal-gold fill-royal-gold" />
            </div>
            <span className="uppercase tracking-[0.2em] text-xs font-semibold">Explore Menu</span>
          </a>
        </motion.div>
      </div>

      {/* Ornament Decoration */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce opacity-50">
        <span className="text-[10px] uppercase tracking-[0.3em] font-sans mb-2">Scroll to Experience</span>
        <ChevronDown size={20} className="text-royal-gold" />
      </div>

      {/* Side Social Tags */}
      <div className="absolute left-10 bottom-20 hidden xl:flex flex-col space-y-6 items-center z-20 after:content-[''] after:w-[1px] after:h-20 after:bg-royal-gold/30">
        {['IG', 'FB', 'TW'].map((social) => (
          <a key={social} href="#" className="text-[10px] tracking-widest hover:text-royal-gold transition-colors rotate-90 mb-4">{social}</a>
        ))}
      </div>
    </section>
  );
}
