import { motion } from 'motion/react';
import { useSiteContent } from '../hooks/useContent';

export default function About() {
  const { data: aboutData } = useSiteContent('about', {
    tagline: 'The Rabaab Story',
    headline: 'A Legacy of Royal Hospitality',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1000'
  });

  const { data: textData } = useSiteContent('text_content', {
    about: {
      p1: "Rabaab isn't just a restaurant; it's a sanctuary for those who appreciate the finer nuances of North Indian and Mughlai cuisine. Born in the heart of Panchkula, our mission was to recreate the grandeur of royal Indian kitchens for the modern gourmand.",
      p2: "Every dish at Rabaab is a tribute to heritage. From the robust, smoky flavors of our tandoors to the intricate, multi-layered gravies of our signature mutton curries, we use only the finest seasonal ingredients and hand-ground spices.",
      p3: "Our interiors reflect this philosophy — a seamless blend of dark, sophisticated wood textures, warm golden illumination, and an atmosphere that whispers tales of royal decadence and warm Indian hospitality.",
      stat1_value: '15+',
      stat1_label: 'Heritage Chefs',
      stat2_value: '5000+',
      stat2_label: 'Monthly Diners'
    }
  });

  return (
    <section id="about" className="py-24 bg-secondary-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl z-10 border border-royal-gold/10">
            {aboutData.image ? (
              <img 
                src={aboutData.image} 
                alt="Culinary Excellence" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-secondary-bg" />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-primary-bg/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          
          {/* Decorative frames */}
          <div className="absolute -inset-4 md:-inset-6 border border-royal-gold/10 rounded-3xl -z-0" />
        </motion.div>

        {/* Text Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.4em] mb-4 block">{aboutData.tagline}</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8 whitespace-pre-line">
              {aboutData.headline}
            </h2>
            
            <div className="space-y-6 text-cream/70 font-sans text-sm md:text-base leading-relaxed tracking-wide">
              <p>{textData.about.p1}</p>
              <p>{textData.about.p2}</p>
              <p>{textData.about.p3}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-royal-gold/10">
              <div>
                <p className="text-3xl font-serif text-royal-gold mb-1">{textData.about.stat1_value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">{textData.about.stat1_label}</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-royal-gold mb-1">{textData.about.stat2_value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">{textData.about.stat2_label}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
