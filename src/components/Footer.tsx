import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useSiteContent } from '../hooks/useContent';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: brandData } = useSiteContent('brand', {
    restaurantName: 'Rabaab'
  });
  const { data: textData } = useSiteContent('text_content', {
    footer: {
      about_text: 'Where heritage recipe meets modern luxury. The destination for authentic North Indian and Mughlai fine dining in Panchkula.',
      contact_title: 'Contact Us',
      contact_addr: 'SCO 44, Sector 5, Panchkula, Haryana 134109',
      contact_phone: '+91 91150 00123',
      contact_email: 'hello@rabaab.luxury',
      hours_title: 'Opening Hours',
      hours_week: 'Monday - Friday',
      hours_weekend: 'Saturday - Sunday',
      hours_note: 'Last order 45 mins before close',
      links_title: 'Quick Links',
      copyright: '© 2026 Rabaab Panchkula. All Royal Rights Reserved.',
      credits: 'Crafted by Luxury Digital'
    }
  });

  return (
    <footer className="bg-primary-bg pt-24 pb-10 relative overflow-hidden">
      {/* Decorative large logo in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif text-royal-gold/5 pointer-events-none whitespace-nowrap uppercase tracking-[0.2em]">
        {brandData.restaurantName}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full border border-royal-gold flex items-center justify-center">
                <span className="text-royal-gold font-serif text-lg">{brandData.restaurantName ? brandData.restaurantName.charAt(0) : 'R'}</span>
              </div>
              <span className="text-xl font-serif tracking-widest text-royal-gold uppercase">{brandData.restaurantName}</span>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs font-light tracking-wide">
              {textData.footer.about_text}
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { Icon: Instagram, label: 'Follow Rabaab on Instagram', href: 'https://www.instagram.com/rabaabpanchkula' },
                { Icon: Facebook, label: 'Follow Rabaab on Facebook', href: 'https://www.facebook.com/rabaabpanchkula' },
                { Icon: Twitter, label: 'Follow Rabaab on Twitter', href: '#' }
              ].map(({ Icon, label, href }) => (
                <a 
                  key={label} 
                  href={href} 
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-royal-gold/20 flex items-center justify-center text-cream/40 hover:border-royal-gold hover:text-royal-gold transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-royal-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8">{textData.footer.contact_title}</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin size={18} className="text-royal-gold shrink-0 mt-1" />
                <address 
                  className="not-italic text-cream/60 text-sm leading-relaxed whitespace-pre-line"
                  itemScope 
                  itemType="https://schema.org/LocalBusiness"
                >
                  <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    {textData.footer.contact_addr}
                  </span>
                </address>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={18} className="text-royal-gold" />
                <a href={`tel:${textData.footer.contact_phone}`} className="text-cream/60 text-sm hover:text-royal-gold transition-colors">{textData.footer.contact_phone}</a>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={18} className="text-royal-gold" />
                <a href={`mailto:${textData.footer.contact_email}`} className="text-cream/60 text-sm hover:text-royal-gold transition-colors">{textData.footer.contact_email}</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-royal-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8">{textData.footer.hours_title}</h4>
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-sm border-b border-royal-gold/10 pb-2">
                <span className="text-cream/60">{textData.footer.hours_week}</span>
                <span className="text-royal-gold">12:00 - 23:00</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-royal-gold/10 pb-2">
                <span className="text-cream/60">{textData.footer.hours_weekend}</span>
                <span className="text-royal-gold">12:00 - 00:00</span>
              </li>
              <li className="flex items-center space-x-2 pt-2">
                <Clock size={16} className="text-royal-gold/40" />
                <span className="text-[10px] uppercase tracking-widest text-cream/30 italic font-medium">{textData.footer.hours_note}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-royal-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-8">{textData.footer.links_title}</h4>
            <ul className="space-y-4 text-sm uppercase tracking-widest text-[10px]">
              <li><a href="#" className="text-cream/40 hover:text-royal-gold transition-colors">Our Story</a></li>
              <li><a href="#signatures" className="text-cream/40 hover:text-royal-gold transition-colors">Signature Dishes</a></li>
              <li><a href="#gallery" className="text-cream/40 hover:text-royal-gold transition-colors">The Gallery</a></li>
              <li><a href="#" className="text-cream/40 hover:text-royal-gold transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-royal-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-cream/30 text-[10px] uppercase tracking-[0.2em]">
            {textData.footer.copyright.replace('{currentYear}', currentYear.toString())}
          </p>
          <div className="flex items-center space-x-2 text-cream/20">
            <span className="text-[10px] uppercase tracking-[0.2em]">{textData.footer.credits}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
