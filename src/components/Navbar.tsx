import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { useSiteContent } from '../hooks/useContent';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Menu', href: '#menu' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Reviews', href: '#reviews' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: brandData } = useSiteContent('brand', {
    logo: '',
    restaurantName: 'Rabaab'
  });
  
  const { data: textData } = useSiteContent('text_content', {
    navbar: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_menu: 'Menu',
      nav_gallery: 'Gallery',
      nav_reviews: 'Reviews',
      reserve_btn: 'Reserve Table',
      phone: '+91 91150 00123'
    }
  });

  const customNavLinks = [
    { name: textData.navbar.nav_home, href: '#' },
    { name: textData.navbar.nav_about, href: '#about' },
    { name: textData.navbar.nav_menu, href: '#menu' },
    { name: textData.navbar.nav_gallery, href: '#gallery' },
    { name: textData.navbar.nav_reviews, href: '#reviews' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-3 glass border-b border-royal-gold/20' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 rounded-full border border-royal-gold flex items-center justify-center relative overflow-hidden group shrink-0">
             {brandData.logo ? (
               <img 
                 src={brandData.logo} 
                 alt={brandData.restaurantName} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
               />
             ) : (
               <span className="text-royal-gold font-serif text-2xl group-hover:scale-110 transition-transform duration-500">
                 {brandData.restaurantName ? brandData.restaurantName.charAt(0) : 'R'}
               </span>
             )}
             <div className="absolute inset-0 bg-royal-gold/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <span className="text-2xl font-serif tracking-widest text-royal-gold uppercase">{brandData.restaurantName}</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10">
          {customNavLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-cream/80 hover:text-royal-gold font-sans text-sm uppercase tracking-widest transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-royal-gold transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex items-center space-x-6"
        >
          <a href={`tel:${textData.navbar.phone}`} className="flex items-center text-cream/70 hover:text-royal-gold transition-colors">
            <Phone size={16} className="mr-2" />
            <span className="text-xs tracking-tighter">{textData.navbar.phone}</span>
          </a>
          <a 
            href="#reserve" 
            className="px-6 py-2 bg-royal-gold text-primary-bg font-sans text-xs uppercase tracking-widest hover:bg-warm-gold transition-all duration-300 rounded shadow-lg shadow-royal-gold/10 transform hover:-translate-y-1"
          >
            {textData.navbar.reserve_btn}
          </a>
        </motion.div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-royal-gold p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-royal-gold/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {customNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-cream text-lg font-serif tracking-widest border-l-2 border-transparent hover:border-royal-gold pl-4 transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-4">
                <a href="#reserve" className="w-full py-3 bg-royal-gold text-primary-bg text-center uppercase tracking-widest text-sm font-semibold">
                  {textData.navbar.reserve_btn}
                </a>
                <a href={`tel:${textData.navbar.phone}`} className="flex items-center justify-center text-cream/70 py-2">
                  <Phone size={18} className="mr-2" />
                  <span>{textData.navbar.phone}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
