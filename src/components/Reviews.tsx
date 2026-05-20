import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Vikram Singh",
    rating: 5,
    text: "The Mutton Rara is absolutely divine. I haven't tasted such authentic Mughlai in years. The royal ambience in Sector 5 is just the cherry on top.",
    role: "Regular Guest"
  },
  {
    name: "Anjali Sharma",
    rating: 5,
    text: "Perfect for family dinner. The hospitality is warm, just like home. Their Paneer Makhani Kulcha is a must-try masterpiece!",
    role: "Food Enthusiast"
  },
  {
    name: "Rajesh Khanna",
    rating: 5,
    text: "Truly a luxury dining experience in Panchkula. The interiors are stunning and the food presentation is top-notch. Best Jalebi Caviar!",
    role: "Local Resident"
  },
  {
    name: "Sonia Mehra",
    rating: 5,
    text: "Amazing ambience and even better food. The Himalayan Khatta Meat had such unique flavors. Highly recommend for special occasions.",
    role: "Birthday Dinner"
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-24 bg-primary-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.4em] mb-4 block">Guest Chronicles</span>
          <h2 className="text-4xl md:text-6xl font-serif">Kind <span className="italic text-royal-gold">Words</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="p-8 glass rounded-2xl relative overflow-hidden group"
            >
              <Quote size={40} className="absolute -top-4 -right-4 text-royal-gold/10 group-hover:text-royal-gold/20 transition-colors" />
              
              <div className="flex space-x-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-royal-gold text-royal-gold" />
                ))}
              </div>

              <p className="text-cream/80 text-lg font-serif italic leading-relaxed mb-8">
                "{review.text}"
              </p>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full border border-royal-gold flex items-center justify-center bg-secondary-bg">
                  <span className="text-royal-gold font-serif text-xl">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="text-cream font-bold uppercase tracking-widest text-xs">{review.name}</h4>
                  <p className="text-cream/40 text-[10px] uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
