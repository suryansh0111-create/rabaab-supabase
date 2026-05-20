import { motion } from 'motion/react';
import { useCollectionContent, useSiteContent } from '../hooks/useContent';

const fallbackImages = [
  { url: 'https://images.unsplash.com/photo-1550966842-2d1d0c1e8f3b?auto=format&fit=crop&q=80&w=800', size: 'large', caption: 'Royal Seating' },
  { url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800', size: 'small', caption: 'Intimate Dining' },
  { url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800', size: 'small', caption: 'Chef\'s Station' },
  { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800', size: 'medium', caption: 'Luxe Decor' },
  { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', size: 'large', caption: 'Grand Hall' },
  { url: 'https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?auto=format&fit=crop&q=80&w=800', size: 'medium', caption: 'Warm Ambience' },
];

export default function AmbienceGallery() {
  const { data: dbGalleryImages, loading } = useCollectionContent('gallery', []);
  const { data: textData } = useSiteContent('text_content', {
    gallery: {
      tagline: 'Visual Immersion',
      title1: 'The',
      title_italic: 'Atmosphere',
      description: 'Step into a world of golden light, rich textures, and royal elegance. Every corner of Rabaab tells a story of luxury.'
    }
  });
  
  // Use database gallery images if available, otherwise fallback to hardware defaults if not loading
  const displayImages = dbGalleryImages.length > 0 
    ? dbGalleryImages.map((img, i) => ({
        url: img.url,
        caption: img.caption || 'The Rabaab Experience',
        size: i % 5 === 0 || i % 5 === 4 ? 'large' : i % 5 === 3 ? 'medium' : 'small' 
      }))
    : loading ? [] : fallbackImages;

  if (loading && dbGalleryImages.length === 0) {
    return (
      <section className="py-24 bg-secondary-bg flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-royal-gold/20 border-t-royal-gold rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="gallery" className="pt-12 pb-24 md:py-24 bg-secondary-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 md:mb-16 gap-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.4em] mb-4 block">{textData.gallery.tagline}</span>
            <h2 className="text-4xl md:text-6xl font-serif">{textData.gallery.title1} <span className="italic text-royal-gold">{textData.gallery.title_italic}</span></h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream/50 max-w-sm text-center md:text-right text-sm leading-relaxed"
          >
            {textData.gallery.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {displayImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative overflow-hidden rounded group shadow-2xl ${
                img.size === 'large' ? 'md:row-span-2 md:col-span-2' : 
                img.size === 'medium' ? 'md:col-span-2' : ''
              }`}
            >
              {img.url ? (
                <img 
                  src={img.url} 
                  alt={img.caption} 
                  className="w-full h-full object-cover grayscale-0 scale-[1.05] md:grayscale-[40%] md:scale-100 md:group-hover:grayscale-0 md:group-hover:scale-110 transition-all duration-1000"
                />
              ) : (
                <div className="w-full h-full bg-secondary-bg" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/80 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 left-6 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                <span className="text-xs uppercase tracking-[0.3em] text-royal-gold font-sans font-bold">{img.caption}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
