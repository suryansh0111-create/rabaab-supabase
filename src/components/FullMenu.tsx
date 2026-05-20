import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Beer, Coffee, Cake, Flame, ChefHat } from 'lucide-react';
import { useCollectionContent } from '../hooks/useContent';

const initialCategories = [
  { id: 'starters', name: 'Starters', icon: <Flame size={16} />, order: 0, items: [
    { name: 'Dahi Ke Sholey', price: '₹345', desc: 'Bread rolls stuffed with hung curd and bell peppers.' },
    { name: 'Mushroom Galouti', price: '₹395', desc: 'Melt-in-mouth mushroom patties with Awadhi spices.' },
    { name: 'Amritsari Machhi', price: '₹545', desc: 'Crispy gram flour coated river fish with carom seeds.' },
    { name: 'Soya Chaap Tikka', price: '₹365', desc: 'Soya chunks marinated in cashew and cream.' },
  ]},
  { id: 'kebabs', name: 'Kebabs & Tandoor', icon: <ChefHat size={16} />, order: 1, items: [
    { name: 'Bhatti Ka Murgh', price: '₹495', desc: 'Smoky tandoori chicken marinated in house-special spices.' },
    { name: 'Mutton Seekh Kebab', price: '₹595', desc: 'Minced mutton skewers cooked over glowing charcoal.' },
    { name: 'Paneer Tikka Shaslik', price: '₹425', desc: 'Herb infused cottege cheese with charred vegetables.' },
    { name: 'Afghan Tikka', price: '₹525', desc: 'Creamy chicken chunks with green cardamom and cream.' },
  ]},
  { id: 'main', name: 'Main Course', icon: <Utensils size={16} />, order: 2, items: [
    { name: 'Mutton Rara', price: '₹645', desc: 'Combination of mutton chunks and minced mutton gravy.' },
    { name: 'Dal Rabaab', price: '₹395', desc: 'Slow cooked black lentils with churned butter and cream.' },
    { name: 'Paneer Makhani', price: '₹465', desc: 'Rich tomato gravy with velvety cottage cheese.' },
    { name: 'Himalayan Khatta Meat', price: '₹625', desc: 'Rustic goat meat with dry mango and mountain spices.' },
    { name: 'Kadhai Murgh', price: '₹545', desc: 'Chicken tossed with capsicum and pounded spices.' },
  ]},
  { id: 'breads', name: 'Breads & Rice', icon: <Utensils size={16} />, order: 3, items: [
    { name: 'Butter Chicken Kulcha', price: '₹195', desc: 'Stuffed with succulent butter chicken bits.' },
    { name: 'Kashmiri Pulao', price: '₹345', desc: 'Fragrant basmati with dry fruits and saffron.' },
    { name: 'Garlic Naan', price: '₹95', desc: 'Fresh tandoori bread with garlic and butter.' },
    { name: 'Rara Mutton Biryani', price: '₹695', desc: 'Royal biryani with mince and meat chunks.' },
  ]},
  { id: 'desserts', name: 'Desserts', icon: <Cake size={16} />, order: 4, items: [
    { name: 'Jalebi Caviar', price: '₹325', desc: 'Pearl-sized crisp jalebi served with rich rabri.' },
    { name: 'Gulab Jamun Cheesecake', price: '₹345', desc: 'Fusion dessert with saffron infused cheese.' },
    { name: 'Shahi Tukda', price: '₹285', desc: 'Fried bread soaked in fragrant condensed milk.' },
  ]},
  { id: 'beverages', name: 'Mocktails', icon: <Beer size={16} />, order: 5, items: [
    { name: 'Royal Rose Cooler', price: '₹245', desc: 'Fresh rose extract with mint and soda.' },
    { name: 'Paan Mojito', price: '₹225', desc: 'Betel leaf infused refreshing lemon drink.' },
    { name: 'Spiced Guava', price: '₹215', desc: 'Pink guava juice with chaat masala and salt rim.' },
  ]},
];

const categoryIcons:Record<string, any> = {
  'starters': <Flame size={16} />,
  'kebabs': <ChefHat size={16} />,
  'main': <Utensils size={16} />,
  'breads': <Utensils size={16} />,
  'desserts': <Cake size={16} />,
  'beverages': <Beer size={16} />
};

export default function FullMenu() {
  const { data: dbCategories } = useCollectionContent('menu_categories', []);
  const categories = dbCategories.length > 0 ? dbCategories : initialCategories;
  const [activeTab, setActiveTab] = useState(categories[0]?.id || 'starters');

  const currentTab = categories.some(c => c.id === activeTab) 
    ? activeTab 
    : (categories[0]?.id || '');

  return (
    <section id="menu" className="py-24 bg-primary-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.4em] mb-4 block">The Culinary Map</span>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-4">
            Our <span className="italic">Exquisite</span> Menu
          </h2>
          <div className="w-24 h-[2px] bg-royal-gold mx-auto" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all duration-300 uppercase tracking-widest text-[10px] font-bold ${
                currentTab === cat.id 
                  ? 'bg-royal-gold text-primary-bg border-royal-gold shadow-[0_0_20px_rgba(200,169,107,0.3)]' 
                  : 'bg-secondary-bg text-cream/60 border-royal-gold/10 hover:border-royal-gold/40'
              }`}
            >
              {categoryIcons[cat.id] || categoryIcons[cat.name ? cat.name.toLowerCase() : ''] || <Utensils size={16} />}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            {categories.find(c => c.id === currentTab)?.items.map((item, i) => (
              <motion.div 
                key={`${item.name}-${i}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group p-6 glass rounded-xl border-l-[3px] border-transparent hover:border-royal-gold transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-cream group-hover:text-royal-gold transition-colors">{item.name}</h3>
                  <span className="text-royal-gold font-sans font-bold">{item.price}</span>
                </div>
                <p className="text-cream/50 text-xs md:text-sm leading-relaxed italic tracking-wide group-hover:text-cream/80 transition-colors">
                  {item.desc}
                </p>
                <div className="mt-4 w-full h-[1px] bg-royal-gold/10 group-hover:bg-royal-gold/30 transition-all duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 text-center">
          <p className="text-cream/40 text-[10px] uppercase tracking-[0.3em] mb-8">
            * All prices are subject to applicable taxes
          </p>
          <a 
            href="/menu.pdf" 
            target="_blank"
            className="px-10 py-4 border border-royal-gold text-royal-gold hover:bg-royal-gold hover:text-primary-bg transition-all duration-500 uppercase tracking-widest text-xs font-bold inline-flex items-center space-x-3"
          >
            <Utensils size={14} />
            <span>Download PDF Menu</span>
          </a>
        </div>
      </div>

      {/* Decorative side ornament */}
      <div className="absolute top-1/2 -left-10 -translate-y-1/2 opacity-5 pointer-events-none rotate-90 hidden xl:block">
        <span className="text-8xl font-serif text-royal-gold tracking-[2rem] uppercase whitespace-nowrap">AUTHENTIC MUGHLAI</span>
      </div>
    </section>
  );
}
