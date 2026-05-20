import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Shield, LogOut, Image, Plus, Trash2, ChevronLeft, Bell, Check, Ban, Clock, Calendar, Users, FileText } from 'lucide-react';
import { 
  dbService, 
  authService, 
  storageService, 
  isSupabaseConfigured,
  INITIAL_SITE_CONTENT,
  INITIAL_SIGNATURE_DISHES,
  INITIAL_MENU_CATEGORIES,
  INITIAL_GALLERY
} from '../lib/supabase';
import { useSiteContent, useCollectionContent } from '../hooks/useContent';

// Web Audio API synthesised Royal announcement bell
function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chime
    osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5 chime
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn("Audio notification chime prevented by browser standards or lack of output devices:", e);
  }
}

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('brand');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Realtime Reservation States
  const [reservations, setReservations] = useState<any[]>([]);
  const [latestNewReservation, setLatestNewReservation] = useState<any | null>(null);
  const knownReservationsRef = useRef<Set<string>>(new Set());

  // Check auth session and handle real-time session loading / OAuth callback
  useEffect(() => {
    // Always force sign-out on panel open so admin must re-authenticate every time
    const forceLogout = async () => {
      await authService.logout();
      setUser(null);
    };
    forceLogout();
  }, []);

  // Subscribe to reservations in realtime
  useEffect(() => {
    if (!user) return;

    let isInitial = true;
    const unsub = dbService.subscribeReservations((list) => {
      setReservations(list);
      
      if (list.length > 0) {
        if (isInitial) {
          // Track existing reservation IDs to filter future real-time additions
          const ids = new Set<string>(list.map(r => r.id));
          knownReservationsRef.current = ids;
          isInitial = false;
        } else {
          // Hunt for new pending reservation added on live site
          const freshPending = list.find(r => r.status === 'pending' && !knownReservationsRef.current.has(r.id));
          if (freshPending) {
            playNotificationSound();
            setLatestNewReservation(freshPending);
            knownReservationsRef.current.add(freshPending.id);
          }
        }
      }
    });

    return unsub;
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email || !passwordInput) {
      setLoginError('Please enter both Email and Password.');
      return;
    }
    
    // Standard secure Email validation RFC 5322 regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setLoginError('Please enter a valid email address structure.');
      return;
    }

    if (passwordInput.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    setLoginError('');
    setLoggingIn(true);

    try {
      const u = await authService.login(email, passwordInput);
      setUser(u);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError('');
    setLoggingIn(true);
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      setLoginError(err.message || 'Google sign-in failed.');
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    knownReservationsRef.current.clear();
    setLatestNewReservation(null);
  };

  // If secure login is needed
  if (!user) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center glass backdrop-blur-xl p-6 select-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-secondary-bg border border-royal-gold/20 p-10 rounded-3xl text-center shadow-2xl relative"
        >
          <Shield size={56} className="mx-auto text-royal-gold mb-6 opacity-85" />
          <h2 className="text-3xl font-serif text-cream mb-2">Concierge Login</h2>
          <p className="text-royal-gold/60 text-[10px] uppercase tracking-widest font-bold mb-8">Rabaab Luxury Admin Panel</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-royal-gold font-bold ml-1">Admin Email</label>
              <input 
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Ex. admin@rabaab.in"
                className="w-full bg-primary-bg/70 border border-royal-gold/20 rounded-lg px-5 py-3 text-cream text-xs outline-none focus:border-royal-gold transition-all"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-royal-gold font-bold ml-1">Password</label>
              <input 
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-primary-bg/70 border border-royal-gold/20 rounded-lg px-5 py-3 text-cream text-xs outline-none focus:border-royal-gold transition-all"
                required
              />
            </div>
            
            {loginError && <p className="text-red-500 text-[11px] text-center mt-2 leading-relaxed">{loginError}</p>}
            
            <button 
              type="submit"
              disabled={loggingIn}
              className="w-full py-4 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest hover:bg-warm-gold transition-all duration-300 shadow-md text-xs mt-6 cursor-pointer"
            >
              {loggingIn ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {isSupabaseConfigured && (
            <>
              <div className="flex items-center my-5 font-sans text-[10px] uppercase tracking-widest text-cream/20">
                <span className="flex-1 border-t border-royal-gold/10"></span>
                <span className="px-3">or</span>
                <span className="flex-1 border-t border-royal-gold/10"></span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loggingIn}
                className="w-full py-3.5 border border-royal-gold/30 hover:border-royal-gold hover:bg-royal-gold/5 text-royal-gold rounded-lg font-bold uppercase tracking-widest transition-all duration-300 text-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.466 1 0 6.466 0 13.24s5.466 12.24 12.24 12.24c7.07 0 11.79-4.97 11.79-12 0-.808-.08-1.436-.19-2.195H12.24z"/>
                </svg>
                <span>Sign In with Google</span>
              </button>
            </>
          )}
          
          <div className="mt-4 text-[10px] text-cream/30 italic">
            {!isSupabaseConfigured && (
              <span>* Private keys not configured. Use fallback credentials (see documentation).</span>
            )}
          </div>
          
          <button onClick={onClose} className="mt-8 text-cream/40 text-xs uppercase tracking-widest hover:text-royal-gold transition-colors">
            Back to Website
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col md:flex-row bg-primary-bg overflow-hidden text-cream">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-secondary-bg border-r border-royal-gold/10 p-6 flex flex-col h-auto md:h-full shrink-0 shadow-2xl relative z-10">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full border border-royal-gold flex items-center justify-center">
              <span className="text-royal-gold font-serif text-lg">R</span>
            </div>
            <span className="text-sm font-serif tracking-widest text-royal-gold uppercase">Panel</span>
          </div>
          <button onClick={onClose} className="text-cream/50 hover:text-royal-gold md:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:space-y-2 pb-4 md:pb-0 custom-scrollbar">
          {['Brand', 'Text', 'Hero', 'About', 'Dishes', 'Menu', 'Gallery', 'Reservations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`whitespace-nowrap px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all min-w-[100px] md:min-w-0 text-center md:text-left cursor-pointer ${
                activeTab === tab.toLowerCase() 
                  ? 'bg-royal-gold text-primary-bg font-bold' 
                  : 'text-cream/60 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="hidden md:block pt-6 border-t border-royal-gold/10 mt-auto">
          <div className="flex items-center space-x-3 mb-6">
            <img src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100'} alt="" className="w-8 h-8 rounded-full border border-royal-gold/20" />
            <div className="overflow-hidden">
              <p className="text-[10px] text-cream font-bold truncate">{user.displayName || 'Administrator'}</p>
              <p className="text-[10px] text-cream/30 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 border border-red-500/20 text-red-500 rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
          <button 
            onClick={onClose}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-3 text-cream/30 hover:text-royal-gold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span>Close Panel</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar bg-primary-bg scroll-smooth relative"
        data-lenis-prevent
      >
        <div className="p-8 md:p-12 pb-32 min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              {activeTab === 'brand' && <BrandEditor />}
              {activeTab === 'text' && <TextEditor />}
              {activeTab === 'hero' && <HeroEditor />}
              {activeTab === 'about' && <AboutEditor />}
              {activeTab === 'dishes' && <DishesEditor />}
              {activeTab === 'menu' && <MenuEditor />}
              {activeTab === 'gallery' && <GalleryEditor />}
              {activeTab === 'reservations' && <ReservationsTab list={reservations} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Realtime Alert Popup Overlay */}
      <AnimatePresence>
        {latestNewReservation && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-[250] max-w-sm w-full bg-secondary-bg border-2 border-royal-gold/60 p-6 rounded-2xl shadow-2xl backdrop-blur-lg shadow-black/80 ring-4 ring-royal-gold/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2 text-royal-gold">
                <Bell size={18} className="animate-swing" />
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em]">Royal Table Call</span>
              </div>
              <button 
                onClick={() => setLatestNewReservation(null)}
                className="text-cream/30 hover:text-cream cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-xl font-serif text-cream leading-snug mb-1">{latestNewReservation.name}</p>
            <div className="flex items-center space-x-3 text-cream/60 text-xs mb-4 select-none">
              <span className="flex items-center space-x-1"><Users size={12} className="text-royal-gold/60" /> <span>{latestNewReservation.guests}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><Calendar size={12} className="text-royal-gold/60" /> <span>{latestNewReservation.date}</span></span>
              <span>•</span>
              <span className="flex items-center space-x-1"><Clock size={12} className="text-royal-gold/60" /> <span>{latestNewReservation.time}</span></span>
            </div>

            {latestNewReservation.request && (
              <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-xs italic text-cream/40 mb-5 max-h-20 overflow-y-auto custom-scrollbar">
                "{latestNewReservation.request}"
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={async () => {
                  try {
                    await dbService.updateReservationStatus(latestNewReservation.id, 'confirmed');
                    setLatestNewReservation(null);
                  } catch (e) { console.error(e); }
                }}
                className="py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg uppercase tracking-widest text-[9px] flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-lg shadow-green-900/30"
              >
                <Check size={12} />
                <span>Confirm</span>
              </button>
              <button 
                onClick={async () => {
                  try {
                    await dbService.updateReservationStatus(latestNewReservation.id, 'rejected');
                    setLatestNewReservation(null);
                  } catch (e) { console.error(e); }
                }}
                className="py-3 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-100 font-bold rounded-lg uppercase tracking-widest text-[9px] flex items-center justify-center space-x-1 cursor-pointer transition-colors"
              >
                <Ban size={12} />
                <span>Reject</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Input Group with Integrated Supabase Storage upload
function InputGroup({ label, value, onChange, type = 'text' }: any) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError('Image must be under 5MB. Please compress or resize the image before uploading.');
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDim = 1000;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height *= maxDim / width;
              width = maxDim;
            } else {
              width *= maxDim / height;
              height = maxDim;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          try {
            const uploadedUrl = await storageService.uploadImage(dataUrl);
            onChange(uploadedUrl);
          } catch (err) {
            console.error('Uploading fallback to Base64:', err);
            onChange(dataUrl);
          } finally {
            setUploading(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 mb-6">
      <label className="text-[10px] uppercase tracking-[0.2em] text-royal-gold font-bold block">{label}</label>
      {type === 'image' ? (
        <div className="space-y-4">
          {error && (
            <p id="upload-error-msg" className="text-red-500 text-xs font-semibold">{error}</p>
          )}
          <div className="flex gap-4">
            <input 
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste URL or upload image"
              className="flex-1 bg-secondary-bg border border-royal-gold/20 rounded-lg px-6 py-4 outline-none focus:border-royal-gold transition-all text-cream placeholder:text-cream/20 text-xs"
            />
            <label className="shrink-0 flex items-center justify-center w-14 h-14 bg-royal-gold/10 border border-royal-gold/20 rounded-lg cursor-pointer hover:bg-royal-gold/20 transition-all text-royal-gold group relative">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-royal-gold/20 border-t-royal-gold rounded-full animate-spin" />
              ) : (
                <Image size={20} className="group-hover:scale-110 transition-transform" />
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
          <div className="aspect-video relative rounded-xl overflow-hidden border border-royal-gold/10 group bg-secondary-bg/50">
            {value ? (
              <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image size={24} className="text-royal-gold/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-white font-bold">Image Preview</span>
            </div>
          </div>
        </div>
      ) : type === 'textarea' ? (
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-secondary-bg border border-royal-gold/20 rounded-lg px-6 py-4 outline-none focus:border-royal-gold transition-all text-cream placeholder:text-cream/20 text-xs"
          rows={3}
        />
      ) : (
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-secondary-bg border border-royal-gold/20 rounded-lg px-6 py-4 outline-none focus:border-royal-gold transition-all text-cream placeholder:text-cream/20 text-xs"
        />
      )}
    </div>
  );
}

// ----------------------
// EDITORS IMPLEMENTATION
// ----------------------

function BrandEditor() {
  const { data: brandData } = useSiteContent('brand', { logo: '', restaurantName: 'Rabaab' });
  const [data, setData] = useState<any>(brandData);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setData(brandData); }, [brandData]);

  async function save() {
    setLoading(true);
    try {
      await dbService.saveSiteContent('brand', data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">Brand Identity</h2>
          <p className="text-cream/40 text-[10px] mt-2 uppercase tracking-widest">Logo and restaurant naming</p>
        </div>
        <button onClick={save} disabled={loading} className="px-8 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 hover:bg-warm-gold transition-all cursor-pointer">
          <Save size={16} /> <span>{loading ? 'Saving...' : 'Save Brand'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
        <div className="space-y-6">
          <InputGroup 
            label="Restaurant Name" 
            value={data.restaurantName} 
            onChange={(v: string) => setData({...data, restaurantName: v})} 
          />
          <div className="p-6 bg-secondary-bg/50 rounded-2xl border border-royal-gold/10">
            <h4 className="text-[10px] uppercase tracking-widest text-royal-gold font-bold mb-4">Logo Guidelines</h4>
            <ul className="text-[10px] text-cream/40 space-y-2 list-disc pl-4 leading-relaxed font-sans">
              <li>Square or circular shapes look exceptionally paired</li>
              <li>Transparent PNGs are suggested for contrast</li>
              <li>Saves and uploads directly to Supabase Storage</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center p-10 glass rounded-3xl border border-royal-gold/20 bg-secondary-bg/25">
          <label className="text-[10px] uppercase tracking-widest text-royal-gold font-bold mb-4 block text-center">Identity Logo</label>
          <div className="w-32 h-32 rounded-full border-2 border-royal-gold flex items-center justify-center relative overflow-hidden bg-primary-bg shadow-2xl mb-6">
            {data.logo ? (
              <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-royal-gold font-serif text-6xl">R</span>
            )}
          </div>
          <div className="w-full">
            <InputGroup 
              label="Logo Upload" 
              value={data.logo} 
              onChange={(v: string) => setData({...data, logo: v})} 
              type="image" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextEditor() {
  const { data: textContent } = useSiteContent('text_content', INITIAL_SITE_CONTENT.text_content);
  const [data, setData] = useState<any>(textContent);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('navbar');

  useEffect(() => { setData(textContent); }, [textContent]);

  async function save() {
    setLoading(true);
    try {
      await dbService.saveSiteContent('text_content', data);
    } finally {
      setLoading(false);
    }
  }

  const updateField = (cat: string, field: string, value: string) => {
    setData({
      ...data,
      [cat]: {
        ...data[cat],
        [field]: value
      }
    });
  };

  const categories = [
    { id: 'navbar', label: 'Navigation' },
    { id: 'hero', label: 'Hero Block' },
    { id: 'about', label: 'About Story' },
    { id: 'signatures', label: 'Featured Title' },
    { id: 'gallery', label: 'Gallery Callout' },
    { id: 'reservation', label: 'Reservations' },
    { id: 'footer', label: 'Footer info' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">Copywriting</h2>
          <p className="text-cream/40 text-[10px] mt-2 uppercase tracking-widest">Global editorial website copy management</p>
        </div>
        <button onClick={save} disabled={loading} className="px-8 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 hover:bg-warm-gold transition-all cursor-pointer">
          <Save size={16} /> <span>{loading ? 'Saving...' : 'Save Copy'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest transition-all cursor-pointer ${
              category === cat.id ? 'bg-royal-gold text-primary-bg' : 'border border-royal-gold/20 text-royal-gold/60 hover:bg-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl border border-royal-gold/10 bg-secondary-bg/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {category === 'navbar' && data?.navbar && (
            <>
              <InputGroup label="Home Link" value={data.navbar.nav_home} onChange={(v: string) => updateField('navbar', 'nav_home', v)} />
              <InputGroup label="About Link" value={data.navbar.nav_about} onChange={(v: string) => updateField('navbar', 'nav_about', v)} />
              <InputGroup label="Menu Link" value={data.navbar.nav_menu} onChange={(v: string) => updateField('navbar', 'nav_menu', v)} />
              <InputGroup label="Gallery Link" value={data.navbar.nav_gallery} onChange={(v: string) => updateField('navbar', 'nav_gallery', v)} />
              <InputGroup label="Reviews Link" value={data.navbar.nav_reviews} onChange={(v: string) => updateField('navbar', 'nav_reviews', v)} />
              <InputGroup label="Reserve Button text" value={data.navbar.reserve_btn} onChange={(v: string) => updateField('navbar', 'reserve_btn', v)} />
              <InputGroup label="Hotline Contact" value={data.navbar.phone} onChange={(v: string) => updateField('navbar', 'phone', v)} />
            </>
          )}

          {category === 'hero' && data?.hero && (
            <>
              <InputGroup label="Hero CTA Button textual action" value={data.hero.cta_btn} onChange={(v: string) => updateField('hero', 'cta_btn', v)} />
            </>
          )}

          {category === 'about' && data?.about && (
            <>
              <div className="col-span-full">
                <InputGroup label="Story Paragraph 1" value={data.about.p1} onChange={(v: string) => updateField('about', 'p1', v)} type="textarea" />
                <InputGroup label="Story Paragraph 2" value={data.about.p2} onChange={(v: string) => updateField('about', 'p2', v)} type="textarea" />
                <InputGroup label="Story Paragraph 3" value={data.about.p3} onChange={(v: string) => updateField('about', 'p3', v)} type="textarea" />
              </div>
              <InputGroup label="Stat Chef count val" value={data.about.stat1_value} onChange={(v: string) => updateField('about', 'stat1_value', v)} />
              <InputGroup label="Stat Chef count text" value={data.about.stat1_label} onChange={(v: string) => updateField('about', 'stat1_label', v)} />
              <InputGroup label="Stat monthly guest val" value={data.about.stat2_value} onChange={(v: string) => updateField('about', 'stat2_value', v)} />
              <InputGroup label="Stat monthly guest text" value={data.about.stat2_label} onChange={(v: string) => updateField('about', 'stat2_label', v)} />
            </>
          )}

          {category === 'signatures' && data?.signatures && (
            <>
              <InputGroup label="Featured Subtitle Tag" value={data.signatures.tagline} onChange={(v: string) => updateField('signatures', 'tagline', v)} />
              <InputGroup label="Title part 1" value={data.signatures.title1} onChange={(v: string) => updateField('signatures', 'title1', v)} />
              <InputGroup label="Title part Italicized" value={data.signatures.title_italic} onChange={(v: string) => updateField('signatures', 'title_italic', v)} />
              <InputGroup label="Title part 2" value={data.signatures.title2} onChange={(v: string) => updateField('signatures', 'title2', v)} />
              <InputGroup label="Full Menu Button label" value={data.signatures.view_menu_btn} onChange={(v: string) => updateField('signatures', 'view_menu_btn', v)} />
              <InputGroup label="Detailed details button logo" value={data.signatures.explore_btn} onChange={(v: string) => updateField('signatures', 'explore_btn', v)} />
            </>
          )}

          {category === 'gallery' && data?.gallery && (
            <>
              <InputGroup label="Ambiance section tagline" value={data.gallery.tagline} onChange={(v: string) => updateField('gallery', 'tagline', v)} />
              <InputGroup label="Header Text part 1" value={data.gallery.title1} onChange={(v: string) => updateField('gallery', 'title1', v)} />
              <InputGroup label="Header Text Italicized" value={data.gallery.title_italic} onChange={(v: string) => updateField('gallery', 'title_italic', v)} />
              <div className="col-span-full">
                <InputGroup label="Subtitle layout explanation Copywriter" value={data.gallery.description} onChange={(v: string) => updateField('gallery', 'description', v)} type="textarea" />
              </div>
            </>
          )}

          {category === 'reservation' && data?.reservation && (
            <>
               <InputGroup label="Form decorative subtitle tagline" value={data.reservation.tagline} onChange={(v: string) => updateField('reservation', 'tagline', v)} />
               <InputGroup label="Header Text part 1" value={data.reservation.title1} onChange={(v: string) => updateField('reservation', 'title1', v)} />
               <InputGroup label="Header Text cursive" value={data.reservation.title_italic} onChange={(v: string) => updateField('reservation', 'title_italic', v)} />
               <div className="col-span-full">
                 <InputGroup label="Small alert guidelines description notice" value={data.reservation.description} onChange={(v: string) => updateField('reservation', 'description', v)} type="textarea" />
               </div>
               <InputGroup label="Call action submit copy text" value={data.reservation.btn_text} onChange={(v: string) => updateField('reservation', 'btn_text', v)} />
               <InputGroup label="Full name request tag" value={data.reservation.label_name} onChange={(v: string) => updateField('reservation', 'label_name', v)} />
               <InputGroup label="Guest quantity tag" value={data.reservation.label_guests} onChange={(v: string) => updateField('reservation', 'label_guests', v)} />
               <InputGroup label="Preferred booking date label value" value={data.reservation.label_date} onChange={(v: string) => updateField('reservation', 'label_date', v)} />
               <InputGroup label="Hour selector slot title" value={data.reservation.label_time} onChange={(v: string) => updateField('reservation', 'label_time', v)} />
               <InputGroup label="Freeform request text container" value={data.reservation.label_request} onChange={(v: string) => updateField('reservation', 'label_request', v)} />
            </>
          )}

          {category === 'footer' && data?.footer && (
            <>
               <div className="col-span-full">
                 <InputGroup label="Brand statement summary story" value={data.footer.about_text} onChange={(v: string) => updateField('footer', 'about_text', v)} type="textarea" />
               </div>
               <InputGroup label="Contact block header text" value={data.footer.contact_title} onChange={(v: string) => updateField('footer', 'contact_title', v)} />
               <InputGroup label="Physical address listing" value={data.footer.contact_addr} onChange={(v: string) => updateField('footer', 'contact_addr', v)} />
               <InputGroup label="Support phone number text" value={data.footer.contact_phone} onChange={(v: string) => updateField('footer', 'contact_phone', v)} />
               <InputGroup label="Corporate official mailing" value={data.footer.contact_email} onChange={(v: string) => updateField('footer', 'contact_email', v)} />
               <InputGroup label="Operating hours block tag" value={data.footer.hours_title} onChange={(v: string) => updateField('footer', 'hours_title', v)} />
               <InputGroup label="Weekdays schedules text" value={data.footer.hours_week} onChange={(v: string) => updateField('footer', 'hours_week', v)} />
               <InputGroup label="Saturdays and sundays slots" value={data.footer.hours_weekend} onChange={(v: string) => updateField('footer', 'hours_weekend', v)} />
               <InputGroup label="Operating advisory bottom warning" value={data.footer.hours_note} onChange={(v: string) => updateField('footer', 'hours_note', v)} />
               <InputGroup label="Sitemap header title quick links" value={data.footer.links_title} onChange={(v: string) => updateField('footer', 'links_title', v)} />
               <InputGroup label="Copyright legalities lines string" value={data.footer.copyright} onChange={(v: string) => updateField('footer', 'copyright', v)} />
               <InputGroup label="Luxury design credit tag" value={data.footer.credits} onChange={(v: string) => updateField('footer', 'credits', v)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HeroEditor() {
  const { data: heroData } = useSiteContent('hero', INITIAL_SITE_CONTENT.hero);
  const [data, setData] = useState<any>(heroData);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setData(heroData); }, [heroData]);

  async function save() {
    setLoading(true);
    try {
      await dbService.saveSiteContent('hero', data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">Hero Section</h2>
          <p className="text-cream/40 text-[10px] uppercase tracking-widest mt-2">Modify homepage visual cover page layout</p>
        </div>
        <button onClick={save} disabled={loading} className="px-8 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 cursor-pointer">
          <Save size={16} /> <span>{loading ? 'Saving...' : 'Save Hero'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InputGroup label="Hero Location tagline" value={data.tagline} onChange={(v: string) => setData({...data, tagline: v})} />
          <InputGroup label="Bold Headline" value={data.headline} onChange={(v: string) => setData({...data, headline: v})} type="textarea" />
          <InputGroup label="Story subtitle copy text" value={data.subheadline} onChange={(v: string) => setData({...data, subheadline: v})} type="textarea" />
        </div>
        <div>
          <InputGroup label="Cover Page background wallpaper image (Supabase Storage Enabled)" value={data.backgroundImage} onChange={(v: string) => setData({...data, backgroundImage: v})} type="image" />
        </div>
      </div>
    </div>
  );
}

function AboutEditor() {
  const { data: aboutContent } = useSiteContent('about', INITIAL_SITE_CONTENT.about);
  const [data, setData] = useState<any>(aboutContent);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setData(aboutContent); }, [aboutContent]);

  async function save() {
    setLoading(true);
    try {
      await dbService.saveSiteContent('about', data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">About Story</h2>
          <p className="text-cream/40 text-[10px] uppercase tracking-widest mt-2">Manage editorial story blocks visual assets</p>
        </div>
        <button onClick={save} disabled={loading} className="px-8 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 cursor-pointer">
          <Save size={16} /> <span>{loading ? 'Saving...' : 'Save Story'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <InputGroup label="About Section subtitle narrative tagline" value={data.tagline} onChange={(v: string) => setData({...data, tagline: v})} />
          <InputGroup label="Section focal title headline" value={data.headline} onChange={(v: string) => setData({...data, headline: v})} type="textarea" />
        </div>
        <div>
          <InputGroup label="Story side focal image asset file upload (Supabase Storage Enabled)" value={data.image} onChange={(v: string) => setData({...data, image: v})} type="image" />
        </div>
      </div>
    </div>
  );
}

function DishesEditor() {
  const { data: dishes, loading: dbLoading } = useCollectionContent('signature_dishes', []);
  const [loading, setLoading] = useState(false);

  const seedDishes = async () => {
    if (!confirm('This will seed the database signature dishes table with original template dishes. Proceed?')) return;
    setLoading(true);
    try {
      for (const dish of INITIAL_SIGNATURE_DISHES) {
        await dbService.addDocument('signature_dishes', { ...dish, id: undefined });
      }
    } finally {
      setLoading(false);
    }
  };

  const addDish = async () => {
    setLoading(true);
    try {
      const newDish = {
        title: 'Fresh Masterpiece Creation',
        description: 'Detail of fine spices combined inside our Royal charcoal ovens.',
        image_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
        tag: 'Heritage Specialty',
        order: dishes.length
      };
      await dbService.addDocument('signature_dishes', newDish);
    } finally {
      setLoading(false);
    }
  };

  const updateDishField = async (id: string, updates: any) => {
    await dbService.updateDocument('signature_dishes', id, updates);
  };

  const removeDish = async (id: string) => {
    if (!confirm('Delete featured signature masterpiece item?')) return;
    await dbService.deleteDocument('signature_dishes', id);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">Masterpieces</h2>
          <p className="text-cream/40 text-[10px] mt-2 uppercase tracking-widest font-sans">Featured marquee items spotlight slideshow slider</p>
        </div>
        <div className="flex gap-2">
          {dishes.length === 0 && !dbLoading && (
            <button onClick={seedDishes} className="px-6 py-3 border border-royal-gold/20 text-royal-gold/60 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer">Seed Defaults</button>
          )}
          <button onClick={addDish} disabled={loading || dbLoading} className="px-6 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 hover:bg-warm-gold transition-all text-[10px] cursor-pointer">
            <Plus size={14} /> <span>{loading ? 'Adding...' : 'New Masterpiece'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {dbLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-royal-gold/20 border-t-royal-gold rounded-full animate-spin" />
          </div>
        ) : dishes.map((dish) => (
          <div key={dish.id} className="glass p-8 rounded-3xl border border-royal-gold/10 relative group bg-secondary-bg/20">
            <button onClick={() => removeDish(dish.id)} className="absolute top-6 right-6 p-2 text-cream/20 hover:text-red-500 transition-colors cursor-pointer">
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <InputGroup label="Masterpiece Title" value={dish.title} onChange={(v: string) => updateDishField(dish.id, { title: v })} />
                <InputGroup label="Special Badge Tag" value={dish.tag} onChange={(v: string) => updateDishField(dish.id, { tag: v })} />
                <InputGroup label="Description copy" value={dish.description} onChange={(v: string) => updateDishField(dish.id, { description: v })} type="textarea" />
              </div>
              <div>
                <InputGroup label="Food aesthetic image (Supabase Storage Enabled)" value={dish.image_url} onChange={(v: string) => updateDishField(dish.id, { image_url: v })} type="image" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuEditor() {
  const { data: categories, loading: dbLoading } = useCollectionContent('menu_categories', []);
  const [loading, setLoading] = useState(false);

  const seedMenu = async () => {
    if (!confirm('This will seed the database categories and food recipe list. Proceed?')) return;
    setLoading(true);
    try {
      for (const cat of INITIAL_MENU_CATEGORIES) {
        await dbService.addDocument('menu_categories', { ...cat, id: undefined });
      }
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    setLoading(true);
    try {
      const newCat = {
        name: 'Fresh Menu Grouping',
        items: [],
        order: categories.length
      };
      await dbService.addDocument('menu_categories', newCat);
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryName = async (id: string, newName: string) => {
    await dbService.updateDocument('menu_categories', id, { name: newName });
  };

  const removeCategory = async (id: string) => {
    if (!confirm('Delete full content category section and all food listings within?')) return;
    await dbService.deleteDocument('menu_categories', id);
  };

  const addItemToCategory = async (cat: any) => {
    const newItem = { name: 'Untold Special Recipe', price: '₹350', desc: 'Scented jasmine herb infusions.' };
    const items = [...(cat.items || []), newItem];
    await dbService.updateDocument('menu_categories', cat.id, { items });
  };

  const updateItemInCategory = async (cat: any, index: number, fieldUpdates: any) => {
    const items = [...cat.items];
    items[index] = { ...items[index], ...fieldUpdates };
    await dbService.updateDocument('menu_categories', cat.id, { items });
  };

  const removeItemFromCategory = async (cat: any, index: number) => {
    const items = cat.items.filter((_: any, i: number) => i !== index);
    await dbService.updateDocument('menu_categories', cat.id, { items });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">Restaurant Menu</h2>
          <p className="text-cream/40 text-[10px] mt-2 uppercase tracking-widest font-sans">Manage all food offerings, rates, and catalog listings</p>
        </div>
        <div className="flex gap-2">
          {categories.length === 0 && !dbLoading && (
            <button onClick={seedMenu} className="px-6 py-3 border border-royal-gold/20 text-royal-gold/60 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer">Seed Menu defaults</button>
          )}
          <button onClick={addCategory} disabled={loading || dbLoading} className="px-6 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 hover:bg-warm-gold transition-all text-[10px] cursor-pointer">
            <Plus size={14} /> <span>{loading ? 'Adding...' : 'New Category'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {dbLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-royal-gold/20 border-t-royal-gold rounded-full animate-spin" />
          </div>
        ) : categories.map((cat) => (
          <div key={cat.id} className="glass p-8 rounded-3xl border border-royal-gold/10 bg-secondary-bg/15">
            <div className="flex items-center justify-between mb-8 border-b border-royal-gold/10 pb-4">
              <input 
                type="text" 
                value={cat.name} 
                onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                className="bg-transparent text-2xl font-serif text-royal-gold outline-none w-full max-w-xs font-bold"
              />
              <button onClick={() => removeCategory(cat.id)} className="text-red-500/40 hover:text-red-500 cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {cat.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl group relative">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => updateItemInCategory(cat, idx, { name: e.target.value })}
                      placeholder="Item Name"
                      className="bg-transparent text-cream font-bold outline-none border-b border-royal-gold/10 text-xs focus:border-royal-gold"
                    />
                    <input 
                      type="text" 
                      value={item.price} 
                      onChange={(e) => updateItemInCategory(cat, idx, { price: e.target.value })}
                      placeholder="Price (₹)"
                      className="bg-transparent text-royal-gold outline-none border-b border-royal-gold/10 text-xs focus:border-royal-gold"
                    />
                    <input 
                      type="text" 
                      value={item.desc} 
                      onChange={(e) => updateItemInCategory(cat, idx, { desc: e.target.value })}
                      placeholder="Description"
                      className="bg-transparent text-cream/50 text-[11px] outline-none border-b border-royal-gold/10 focus:border-royal-gold w-full"
                    />
                  </div>
                  <button onClick={() => removeItemFromCategory(cat, idx)} className="p-1 text-red-500/20 hover:text-red-500 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addItemToCategory(cat)}
                className="w-full py-3 border border-dashed border-royal-gold/20 rounded-xl text-royal-gold/40 hover:text-royal-gold hover:border-royal-gold/50 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Item to {cat.name}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryEditor() {
  const { data: galleryItems, loading: dbLoading } = useCollectionContent('gallery', []);
  const [loading, setLoading] = useState(false);

  const seedGallery = async () => {
    if (!confirm('This will seed the database gallery table with original template images. Proceed?')) return;
    setLoading(true);
    try {
      for (const item of INITIAL_GALLERY) {
        await dbService.addDocument('gallery', { ...item, id: undefined });
      }
    } finally {
      setLoading(false);
    }
  };

  const addImage = async () => {
    setLoading(true);
    try {
      const newItem = {
        url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
        caption: 'Chandelier Glow Lounge',
        order: galleryItems.length
      };
      await dbService.addDocument('gallery', newItem);
    } finally {
      setLoading(false);
    }
  };

  const updateImageField = async (id: string, updates: any) => {
    await dbService.updateDocument('gallery', id, updates);
  };

  const removeGalleryItem = async (id: string) => {
    if (!confirm('Delete ambiance photo from presentation gallery?')) return;
    await dbService.deleteDocument('gallery', id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-royal-gold/10 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">The Gallery</h2>
          <p className="text-cream/40 text-[10px] mt-2 uppercase tracking-widest">Co-ordinate restaurant dining space photographs</p>
        </div>
        <div className="flex gap-2">
          {galleryItems.length === 0 && !dbLoading && (
            <button onClick={seedGallery} className="px-6 py-3 border border-royal-gold/20 text-royal-gold/60 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer">Seed gallery defaults</button>
          )}
          <button onClick={addImage} disabled={loading || dbLoading} className="px-6 py-3 bg-royal-gold text-primary-bg rounded-lg font-bold uppercase tracking-widest flex items-center space-x-2 hover:bg-warm-gold transition-all text-[10px] cursor-pointer">
            <Plus size={14} /> <span>{loading ? 'Adding...' : 'Add Image'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dbLoading ? (
          <div className="col-span-full py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-royal-gold/20 border-t-royal-gold rounded-full animate-spin" />
          </div>
        ) : galleryItems.map((item) => (
          <div key={item.id} className="glass p-6 rounded-3xl border border-royal-gold/10 relative group bg-secondary-bg/20">
            <button onClick={() => removeGalleryItem(item.id)} className="absolute top-4 right-4 p-2 text-cream/20 hover:text-red-500 transition-colors cursor-pointer z-10 bg-secondary-bg/80 rounded-lg">
              <Trash2 size={16} />
            </button>
            <div className="space-y-4">
              <InputGroup label="Image File / URL" value={item.url} onChange={(v: string) => updateImageField(item.id, { url: v })} type="image" />
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <InputGroup label="Caption Text" value={item.caption || ''} onChange={(v: string) => updateImageField(item.id, { caption: v })} />
                </div>
                <div>
                  <InputGroup label="Sort Order" type="number" value={item.order} onChange={(v: string) => updateImageField(item.id, { order: parseInt(v) })} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------
// RESERVATIONS CONTROLLER
// ----------------------

function ReservationsTab({ list }: { list: any[] }) {
  const [filterState, setFilterState] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');

  const filtered = list.filter((res) => {
    if (filterState === 'all') return true;
    return res.status === filterState;
  });

  const changeStatus = async (id: string, status: 'pending' | 'confirmed' | 'rejected') => {
    await dbService.updateReservationStatus(id, status);
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('Delete reservation entry permanently?')) return;
    await dbService.deleteDocument('reservations', id);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-royal-gold/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif text-royal-gold">Conferencing</h2>
          <p className="text-cream/40 text-[10px] mt-2 uppercase tracking-widest font-sans">Active reservation log synced in Realtime</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg border border-royal-gold/15 select-none">
          {['All', 'Pending', 'Confirmed', 'Rejected'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilterState(opt.toLowerCase() as any)}
              className={`px-4 py-2 rounded-md text-[9px] uppercase tracking-widest transition-all cursor-pointer font-bold ${
                filterState === opt.toLowerCase()
                  ? 'bg-royal-gold text-primary-bg'
                  : 'text-cream/50 hover:text-cream'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-royal-gold/15 rounded-3xl select-none">
            <FileText size={48} className="mx-auto text-royal-gold/15 mb-4" />
            <p className="text-cream/30 uppercase tracking-widest text-xs">No reservations matching filter found</p>
          </div>
        ) : (
          filtered.map((res) => (
            <div key={res.id} className="glass p-6 md:p-8 rounded-3xl border border-royal-gold/10 bg-secondary-bg/20 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-royal-gold/30 transition-all">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-lg font-serif text-cream leading-none">{res.name}</span>
                  <span className={`px-2.5 py-1 text-[8px] uppercase font-bold tracking-widest border rounded ${
                    res.status === 'pending'
                      ? 'border-royal-gold/20 text-royal-gold bg-royal-gold/5'
                      : res.status === 'confirmed'
                      ? 'border-green-500/20 text-green-400 bg-green-500/5'
                      : 'border-red-500/20 text-red-400 bg-red-400/5'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 text-xs text-cream/60 select-none font-sans">
                  <div className="flex items-center space-x-2">
                    <Users size={14} className="text-royal-gold/60" />
                    <span>{res.guests}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-royal-gold/60" />
                    <span>{res.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={14} className="text-royal-gold/60" />
                    <span>{res.time}</span>
                  </div>
                </div>

                {res.request && (
                  <p className="text-[11px] text-cream/40 italic pl-3 border-l-2 border-royal-gold/20">
                    "{res.request}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {res.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => changeStatus(res.id, 'confirmed')}
                      className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer transition-colors"
                      title="Confirm Reservation"
                    >
                      <Check size={16} />
                    </button>
                    <button 
                      onClick={() => changeStatus(res.id, 'rejected')}
                      className="p-3 bg-red-600/20 hover:bg-red-600/80 hover:text-white text-red-400 border border-red-500/30 rounded-xl cursor-pointer transition-colors"
                      title="Reject Reservation"
                    >
                      <Ban size={16} />
                    </button>
                  </>
                )}
                {res.status !== 'pending' && (
                  <button 
                    onClick={() => changeStatus(res.id, 'pending')}
                    className="px-4 py-2.5 border border-royal-gold/20 hover:border-royal-gold hover:bg-royal-gold/15 text-royal-gold text-[9px] uppercase tracking-widest font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Set Pending
                  </button>
                )}
                <button 
                  onClick={() => deleteReservation(res.id)}
                  className="p-3 bg-white/5 hover:bg-red-600/30 hover:text-red-400 text-cream/30 rounded-xl cursor-pointer transition-all"
                  title="Delete Entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
