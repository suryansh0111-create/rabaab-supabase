import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useCollectionContent, useSiteContent } from '../hooks/useContent';

const initialDishes = [
// ... (omitting for brevity in this thought, will use the full file expansion in actual tool call)
  {
    id: '1',
    title: 'Mutton Rara',
    description: 'Tender mutton cooked in a rich, spiced minced meat gravy. A royal classic.',
    image: 'https://images.unsplash.com/photo-1545240103-12822a106e93?auto=format&fit=crop&q=80&w=800',
    tag: 'Signature',
    order: 0
  },
  {
    id: '2',
    title: 'Paneer Makhani Kulcha',
    description: 'Soft leavened bread stuffed with creamy paneer and glazed with clarified butter.',
    image: 'https://images.unsplash.com/photo-1601050638917-3f30f242aa25?auto=format&fit=crop&q=80&w=800',
    tag: 'Chef Special',
    order: 1
  },
  {
    id: '3',
    title: 'Butter Chicken Kulcha',
    description: 'The iconic flavors of Old Delhi butter chicken baked inside a crispy golden kulcha.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    tag: 'Most Loved',
    order: 2
  },
  {
    id: '4',
    title: 'Jalebi Caviar with Rabri',
    description: 'A modern twist on an ancient dessert. Compressed jalebi pearls served over thick, chilled rabri.',
    image: 'https://images.unsplash.com/photo-1601050638917-3f30f242aa25?auto=format&fit=crop&q=80&w=800',
    tag: 'Innovative',
    order: 3
  },
  {
    id: '5',
    title: 'Himalayan Khatta Meat',
    description: 'Traditional slow-cooked mountain mutton with a distinct sour kick from dried mango and local spices.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
    tag: 'Heritage',
    order: 4
  },
];

export default function SignatureDishes() {
  const { data: dbDishes, loading } = useCollectionContent('signature_dishes', []);
  const { data: textData } = useSiteContent('text_content', {
    signatures: {
      tagline: 'Exquisite Selection',
      title1: 'Our',
      title_italic: 'Signature',
      title2: 'Masterpieces',
      view_menu_btn: 'View Full Menu',
      explore_btn: 'Explore Details'
    }
  });
  
  const dishes = dbDishes.length > 0 ? dbDishes : initialDishes;

  if (loading && dbDishes.length === 0) {
    return (
      <section className="py-24 bg-primary-bg flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-royal-gold/20 border-t-royal-gold rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section id="signatures" className="py-16 md:py-24 bg-primary-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.4em] mb-4 block">{textData.signatures.tagline}</span>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight">
              {textData.signatures.title1} <span className="italic">{textData.signatures.title_italic}</span> {textData.signatures.title2}
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <a href="#menu" className="group flex items-center space-x-3 text-royal-gold hover:text-warm-gold transition-colors font-sans text-sm tracking-widest uppercase">
              <span>{textData.signatures.view_menu_btn}</span>
              <div className="w-10 h-10 rounded-full border border-royal-gold/30 flex items-center justify-center group-hover:bg-royal-gold group-hover:text-primary-bg transition-all duration-300">
                <ArrowRight size={16} />
              </div>
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dishes.map((dish: any, index: number) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative h-[380px] md:h-[500px] rounded-lg overflow-hidden glass border-transparent hover:border-royal-gold/20 transition-all duration-500"
            >
              {/* Image with zoom on hover */}
              <div className="absolute inset-0 overflow-hidden">
                {dish.image_url ? (
                  <img 
                    src={dish.image_url} 
                    alt={dish.title}
                    className="w-full h-full object-cover grayscale-0 scale-[1.05] md:grayscale-[30%] md:scale-100 md:group-hover:grayscale-0 md:group-hover:scale-110 transition-all duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary-bg" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-primary-bg/20 to-transparent opacity-90 md:opacity-80 md:group-hover:opacity-90 transition-opacity duration-500" />
              </div>

              {/* Tag */}
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 bg-royal-gold/90 text-primary-bg text-[10px] uppercase font-bold tracking-widest rounded-full">
                  {dish.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-0 md:translate-y-8 lg:translate-y-6 md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl md:text-2xl font-serif text-royal-gold mb-2 md:mb-3 md:group-hover:text-warm-gold transition-colors">{dish.title}</h3>
                <p className="text-cream/60 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {dish.description}
                </p>
                <button className="flex items-center space-x-2 text-[10px] md:text-xs uppercase tracking-widest text-royal-gold md:group-hover:text-warm-gold transition-colors">
                  <span>{textData.signatures.explore_btn}</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Golden Glow effect on hover */}
              <div className="absolute inset-0 border-[1px] border-royal-gold/0 group-hover:border-royal-gold/20 transition-all duration-500 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-royal-gold group-hover:w-[80%] transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative SVG Ornament */}
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none hidden lg:block">
        <svg width="300" height="300" viewBox="0 0 100 100" className="text-royal-gold">
          <path fill="currentColor" d="M50 0 A50 50 0 0 1 100 50 A50 50 0 0 1 50 100 A50 50 0 0 1 0 50 A50 50 0 0 1 50 0 M50 10 A40 40 0 0 0 10 50 A40 40 0 0 0 50 90 A40 40 0 0 0 90 50 A40 40 0 0 0 50 10" />
        </svg>
      </div>
    </section>
  );
}
