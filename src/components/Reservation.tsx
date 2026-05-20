import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, Send, CheckCircle } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useSiteContent } from '../hooks/useContent';
import { dbService } from '../lib/supabase';

export default function Reservation() {
  const { data: textData } = useSiteContent('text_content', {
    reservation: {
      tagline: 'Private Dining',
      title1: 'Secure Your',
      title_italic: 'Royal Table',
      description: 'For same-day reservations, please call us directly at +91 91150 00123',
      btn_text: 'Request Reservation',
      label_name: 'Full Name',
      label_guests: 'Guest Count',
      label_date: 'Preferred Date',
      label_time: 'Preferred Time',
      label_request: 'Special Occasion/Request'
    }
  });

  const [name, setName] = useState('');
  const [guests, setGuests] = useState('2 Persons');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('7:00 PM');
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side rate limiting (last 30 minutes check)
    try {
      const lastResTimeStr = localStorage.getItem('last_reservation_time');
      if (lastResTimeStr) {
        const lastResTime = parseInt(lastResTimeStr, 10);
        const timeDiff = Date.now() - lastResTime;
        if (timeDiff < 30 * 60 * 1000) {
          setErrorMsg(
            'Please wait 30 minutes before submitting another reservation, or call us directly at +91 91150 00123.'
          );
          return;
        }
      }
    } catch (err) {
      console.warn('LocalStorage error in rate check:', err);
    }

    const trimmedName = name.trim();
    const trimmedRequest = request.trim();

    if (!trimmedName) {
      setErrorMsg('Please specify your full name.');
      return;
    }
    if (trimmedName.length > 120) {
      setErrorMsg('Full Name must be 120 characters or less.');
      return;
    }
    if (!date) {
      setErrorMsg('Please select your preferred date.');
      return;
    }
    
    // Prevent past booking dates safely across timezone bounds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      setErrorMsg('Preferred Date cannot be in the past.');
      return;
    }

    if (trimmedRequest.length > 1000) {
      setErrorMsg('Special requests must be 1000 characters or less.');
      return;
    }

    // DOMPurify sanitization
    const sanitizeHTML = (str: string) => {
      return DOMPurify.sanitize(str, { ALLOWED_TAGS: [] }).trim();
    };

    setErrorMsg('');
    setLoading(true);

    try {
      await dbService.createReservation({
        name: sanitizeHTML(trimmedName),
        guests,
        date,
        time,
        request: sanitizeHTML(trimmedRequest)
      });
      
      // Store current reservation timestamp to persist spam prevention
      try {
        localStorage.setItem('last_reservation_time', Date.now().toString());
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      setSuccess(true);
      setName('');
      setRequest('');
      setDate('');
    } catch (err) {
      console.error('Reservation exception:', err);
      setErrorMsg('Could not place your reservation. Please try again or call concierge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reserve" className="py-24 bg-secondary-bg relative">
      {/* Decorative background image with low opacity */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=2000" 
          alt="Kitchen" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="glass p-10 md:p-16 rounded-3xl border border-royal-gold/20 shadow-2xl backdrop-blur-2xl"
        >
          <div className="text-center mb-12">
            <span className="text-royal-gold font-sans text-xs uppercase tracking-[0.4em] mb-4 block">{textData.reservation.tagline}</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">{textData.reservation.title1} <span className="italic">{textData.reservation.title_italic}</span></h2>
            <p className="text-cream/50 text-sm tracking-wide">{textData.reservation.description}</p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-royal-gold font-bold ml-1">{textData.reservation.label_name}</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex. Suraj Malhotra"
                    className="w-full bg-primary-bg/40 border border-royal-gold/20 rounded-lg px-6 py-4 outline-none focus:border-royal-gold focus:ring-1 focus:ring-royal-gold/20 transition-all text-cream placeholder:text-cream/20"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-royal-gold font-bold ml-1">{textData.reservation.label_guests}</label>
                  <div className="relative">
                    <Users size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-royal-gold/40" />
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full bg-primary-bg/40 border border-royal-gold/20 rounded-lg px-14 py-4 outline-none focus:border-royal-gold focus:ring-1 focus:ring-royal-gold/20 transition-all text-cream appearance-none"
                    >
                      <option>2 Persons</option>
                      <option>4 Persons</option>
                      <option>6 Persons</option>
                      <option>8+ Persons</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-royal-gold font-bold ml-1">{textData.reservation.label_date}</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-royal-gold/40" />
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-primary-bg/40 border border-royal-gold/20 rounded-lg px-14 py-4 outline-none focus:border-royal-gold transition-all text-cream [color-scheme:dark]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-royal-gold font-bold ml-1">{textData.reservation.label_time}</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-royal-gold/40" />
                    <select 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-primary-bg/40 border border-royal-gold/20 rounded-lg px-14 py-4 outline-none focus:border-royal-gold transition-all text-cream appearance-none"
                    >
                      <option>7:00 PM</option>
                      <option>8:00 PM</option>
                      <option>9:00 PM</option>
                      <option>10:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-royal-gold font-bold ml-1">{textData.reservation.label_request}</label>
                  <textarea 
                    rows={4}
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    placeholder="Is it a birthday, anniversary or any dietary preference?"
                    className="w-full bg-primary-bg/40 border border-royal-gold/20 rounded-lg px-6 py-4 outline-none focus:border-royal-gold transition-all text-cream placeholder:text-cream/20 resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="md:col-span-2 text-red-500 text-xs font-bold font-sans text-center">
                    {errorMsg}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="md:col-span-2 group relative w-full py-5 bg-royal-gold text-primary-bg rounded-lg font-sans font-bold uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:bg-warm-gold hover:shadow-[0_10px_40px_rgba(200,169,107,0.3)] disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-3">
                    <Send size={18} />
                    <span>{loading ? 'Requesting...' : textData.reservation.btn_text}</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10 space-y-6"
              >
                <CheckCircle size={64} className="mx-auto text-royal-gold animate-bounce" />
                <h3 className="text-3xl font-serif text-cream">Reservation Requested</h3>
                <p className="text-cream/60 max-w-md mx-auto text-sm leading-relaxed">
                  Your request for a royal table has been recorded in our reservation log. Our concierge team will review and update your table request in real time. Thank you for choosing Rabaab.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-10 py-4 bg-transparent border border-royal-gold/30 text-royal-gold hover:border-royal-gold hover:bg-royal-gold/10 transition-all font-sans font-bold uppercase tracking-[0.2em] text-[10px] rounded"
                >
                  Book Another Table
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
