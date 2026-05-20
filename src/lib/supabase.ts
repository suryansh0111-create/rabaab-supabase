import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    })
  : null;

/**
 * Validates synchronously if an active administrator login session exists, 
 * preventing anonymous programmatic query executions or bypassing.
 */
export const hasAdminSession = (): boolean => {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const urlKey = supabaseUrl.split('//')[1]?.split('.')[0];
      if (urlKey) {
        const sessionString = localStorage.getItem(`sb-${urlKey}-auth-token`);
        if (sessionString) {
          const session = JSON.parse(sessionString);
          if (session?.user?.id) return true;
        }
      }
    } catch {
      return false;
    }
  }
  return false;
};

// ==========================================
// DUAL-MODE REACTIVE STORAGE & LOCAL ENGINE
// ==========================================

// Seed initial data for local store / first-time load
export const INITIAL_SITE_CONTENT: Record<string, any> = {
  brand: {
    logo: '',
    restaurantName: 'Rabaab'
  },
  text_content: {
    navbar: {
      nav_home: 'Home',
      nav_about: 'About',
      nav_menu: 'Menu',
      nav_gallery: 'Gallery',
      nav_reviews: 'Reviews',
      reserve_btn: 'Reserve Table',
      phone: '+91 91150 00123'
    },
    hero: {
      cta_btn: 'Explore Menu'
    },
    about: {
      p1: "Rabaab isn't just a restaurant; it's a sanctuary for those who appreciate the finer nuances of North Indian and Mughlai cuisine. Born in the heart of Panchkula, our mission was to recreate the grandeur of royal Indian kitchens for the modern gourmand.",
      p2: "Every dish at Rabaab is a tribute to heritage. From the robust, smoky flavors of our tandoors to the intricate, multi-layered gravies of our signature mutton curries, we use only the finest seasonal ingredients and hand-ground spices.",
      p3: "Our interiors reflect this philosophy — a seamless blend of dark, sophisticated wood textures, warm golden illumination, and an atmosphere that whispers tales of royal decadence and warm Indian hospitality.",
      stat1_value: '15+',
      stat1_label: 'Heritage Chefs',
      stat2_value: '5000+',
      stat2_label: 'Monthly Diners'
    },
    signatures: {
      tagline: 'Exquisite Selection',
      title1: 'Our',
      title_italic: 'Signature',
      title2: 'Masterpieces',
      view_menu_btn: 'View Full Menu',
      explore_btn: 'Explore Details'
    },
    gallery: {
      tagline: 'Visual Immersion',
      title1: 'The',
      title_italic: 'Atmosphere',
      description: 'Step into a world of golden light, rich textures, and royal elegance. Every corner of Rabaab tells a story of luxury.'
    },
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
    },
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
  },
  hero: {
    tagline: 'Sector 5, Panchkula',
    headline: 'Where Royal Flavours Meet Modern Luxury',
    subheadline: "Experience Panchkula's premium Mughlai & North Indian dining destination.",
    backgroundImage: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000'
  },
  about: {
    tagline: 'The Rabaab Story',
    headline: 'A Legacy of Royal Hospitality',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=1000'
  }
};

export const INITIAL_SIGNATURE_DISHES = [
  {
    id: 'dish-1',
    title: 'Mutton Rara',
    description: 'Tender mutton cooked in a rich, spiced minced meat gravy. A royal classic.',
    image_url: 'https://images.unsplash.com/photo-1545240103-12822a106e93?auto=format&fit=crop&q=80&w=800',
    tag: 'Signature',
    order: 0
  },
  {
    id: 'dish-2',
    title: 'Paneer Makhani Kulcha',
    description: 'Soft leavened bread stuffed with creamy paneer and glazed with clarified butter.',
    image_url: 'https://images.unsplash.com/photo-1601050638917-3f30f242aa25?auto=format&fit=crop&q=80&w=800',
    tag: 'Chef Special',
    order: 1
  },
  {
    id: 'dish-3',
    title: 'Butter Chicken Kulcha',
    description: 'The iconic flavors of Old Delhi butter chicken baked inside a crispy golden kulcha.',
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800',
    tag: 'Most Loved',
    order: 2
  },
  {
    id: 'dish-4',
    title: 'Jalebi Caviar with Rabri',
    description: 'A modern twist on an ancient dessert. Compressed jalebi pearls served over thick, chilled rabri.',
    image_url: 'https://images.unsplash.com/photo-1601050638917-3f30f242aa25?auto=format&fit=crop&q=80&w=800',
    tag: 'Innovative',
    order: 3
  },
  {
    id: 'dish-5',
    title: 'Himalayan Khatta Meat',
    description: 'Traditional slow-cooked mountain mutton with a distinct sour kick from dried mango and local spices.',
    image_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800',
    tag: 'Heritage',
    order: 4
  },
];

export const INITIAL_MENU_CATEGORIES = [
  { id: 'starters', name: 'Starters', order: 0, items: [
    { name: 'Dahi Ke Sholey', price: '₹345', desc: 'Bread rolls stuffed with hung curd and bell peppers.' },
    { name: 'Mushroom Galouti', price: '₹395', desc: 'Melt-in-mouth mushroom patties with Awadhi spices.' },
    { name: 'Amritsari Machhi', price: '₹545', desc: 'Crispy gram flour coated river fish with carom seeds.' },
    { name: 'Soya Chaap Tikka', price: '₹365', desc: 'Soya chunks marinated in cashew and cream.' },
  ]},
  { id: 'kebabs', name: 'Kebabs & Tandoor', order: 1, items: [
    { name: 'Bhatti Ka Murgh', price: '₹495', desc: 'Smoky tandoori chicken marinated in house-special spices.' },
    { name: 'Mutton Seekh Kebab', price: '₹595', desc: 'Minced mutton skewers cooked over glowing charcoal.' },
    { name: 'Paneer Tikka Shaslik', price: '₹425', desc: 'Herb infused cottege cheese with charred vegetables.' },
    { name: 'Afghan Tikka', price: '₹525', desc: 'Creamy chicken chunks with green cardamom and cream.' },
  ]},
  { id: 'main', name: 'Main Course', order: 2, items: [
    { name: 'Mutton Rara', price: '₹645', desc: 'Combination of mutton chunks and minced mutton gravy.' },
    { name: 'Dal Rabaab', price: '₹395', desc: 'Slow cooked black lentils with churned butter and cream.' },
    { name: 'Paneer Makhani', price: '₹465', desc: 'Rich tomato gravy with velvety cottage cheese.' },
    { name: 'Himalayan Khatta Meat', price: '₹625', desc: 'Rustic goat meat with dry mango and mountain spices.' },
    { name: 'Kadhai Murgh', price: '₹545', desc: 'Chicken tossed with capsicum and pounded spices.' },
  ]},
  { id: 'breads', name: 'Breads & Rice', order: 3, items: [
    { name: 'Butter Chicken Kulcha', price: '₹195', desc: 'Stuffed with succulent butter chicken bits.' },
    { name: 'Kashmiri Pulao', price: '₹345', desc: 'Fragrant basmati with dry fruits and saffron.' },
    { name: 'Garlic Naan', price: '₹95', desc: 'Fresh tandoori bread with garlic and butter.' },
    { name: 'Rara Mutton Biryani', price: '₹695', desc: 'Royal biryani with mince and meat chunks.' },
  ]},
  { id: 'desserts', name: 'Desserts', order: 4, items: [
    { name: 'Jalebi Caviar', price: '₹325', desc: 'Pearl-sized crisp jalebi served with rich rabri.' },
    { name: 'Gulab Jamun Cheesecake', price: '₹345', desc: 'Fusion dessert with saffron infused cheese.' },
    { name: 'Shahi Tukda', price: '₹285', desc: 'Fried bread soaked in fragrant condensed milk.' },
  ]},
  { id: 'beverages', name: 'Mocktails', order: 5, items: [
    { name: 'Royal Rose Cooler', price: '₹245', desc: 'Fresh rose extract with mint and soda.' },
    { name: 'Paan Mojito', price: '₹225', desc: 'Betel leaf infused refreshing lemon drink.' },
    { name: 'Spiced Guava', price: '₹215', desc: 'Pink guava juice with chaat masala and salt rim.' },
  ]},
];

export const INITIAL_GALLERY = [
  { id: 'g-1', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=800', caption: 'The Royal Lounge', order: 0 },
  { id: 'g-2', url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800', caption: 'Glow of Rabaab', order: 1 },
  { id: 'g-3', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800', caption: 'Awadhi Diners', order: 2 },
  { id: 'g-4', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800', caption: 'Culinary Precision', order: 3 },
  { id: 'g-5', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800', caption: 'Vintage Sconces', order: 4 },
  { id: 'g-6', url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800', caption: 'Midnight Banquet', order: 5 },
];

// Initialize localStorage if keys do not exist
const initLocalStorage = () => {
  if (!localStorage.getItem('site_content_keys')) {
    localStorage.setItem('site_content_keys', JSON.stringify(Object.keys(INITIAL_SITE_CONTENT)));
    Object.entries(INITIAL_SITE_CONTENT).forEach(([k, v]) => {
      localStorage.setItem(`site_content_${k}`, JSON.stringify(v));
    });
  }
  if (!localStorage.getItem('signature_dishes')) {
    localStorage.setItem('signature_dishes', JSON.stringify(INITIAL_SIGNATURE_DISHES));
  }
  if (!localStorage.getItem('menu_categories')) {
    localStorage.setItem('menu_categories', JSON.stringify(INITIAL_MENU_CATEGORIES));
  }
  if (!localStorage.getItem('gallery')) {
    localStorage.setItem('gallery', JSON.stringify(INITIAL_GALLERY));
  }
  if (!localStorage.getItem('reservations')) {
    localStorage.setItem('reservations', JSON.stringify([]));
  }
};

initLocalStorage();

type Subscriber = (data: any) => void;
const listeners: Record<string, Set<Subscriber>> = {};

const triggerChange = (table: string, data: any) => {
  const tableListeners = listeners[table];
  if (tableListeners) {
    tableListeners.forEach((listener) => listener(data));
  }
};

// ==========================================
// DB SERVICE CLIENT WITH LOCAL FALLBACK
// ==========================================
export const dbService = {
  // --- Site Content (Key Value Store) ---
  async getSiteContent(key: string, initialFallback: any): Promise<any> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('site_content')
          .select('value')
          .eq('key', key)
          .single();
        if (data) return data.value;
        if (error && error.code === 'PGRST116') {
          // Row doesn't exist, create it with fallback
          await this.saveSiteContent(key, initialFallback);
          return initialFallback;
        }
        console.warn('Supabase site_content fetch error, falling back:', error);
      } catch (err) {
        console.error('Supabase getSiteContent exception:', err);
      }
    }
    const local = localStorage.getItem(`site_content_${key}`);
    return local ? JSON.parse(local) : initialFallback;
  },

  async saveSiteContent(key: string, value: any): Promise<void> {
    if (!hasAdminSession()) {
      throw new Error('Unauthorized action: Admin session required.');
    }
    const localKey = `site_content_${key}`;
    localStorage.setItem(localKey, JSON.stringify(value));
    triggerChange(`site_content_${key}`, value);

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('site_content')
          .upsert({ key, value });
        if (error) console.error('Supabase upsert site_content error:', error);
      } catch (err) {
        console.error('Supabase saveSiteContent exception:', err);
      }
    }
  },

  subscribeSiteContent(key: string, initialFallback: any, callback: Subscriber) {
    if (!listeners[`site_content_${key}`]) {
      listeners[`site_content_${key}`] = new Set();
    }
    listeners[`site_content_${key}`].add(callback);

    // Initial load
    this.getSiteContent(key, initialFallback).then(callback);

    let supabaseUnsub = () => {};
    if (isSupabaseConfigured && supabaseClient) {
      const uniqueId = Math.random().toString(36).slice(2, 11);
      const channel = supabaseClient
        .channel(`site_content_${key}_${uniqueId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_content', filter: `key=eq.${key}` },
          (payload) => {
            if (payload.new && 'value' in payload.new) {
              callback(payload.new.value);
            }
          }
        )
        .subscribe();
      supabaseUnsub = () => {
        supabaseClient.removeChannel(channel);
      };
    }

    return () => {
      listeners[`site_content_${key}`]?.delete(callback);
      supabaseUnsub();
    };
  },

  // --- Collection Store (Dishes, Menu, Gallery, etc.) ---
  async getCollection(tableName: string): Promise<any[]> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .select('*')
          .order('order', { ascending: true });
        if (data) return data;
        console.warn(`Supabase ${tableName} fetch error, falling back:`, error);
      } catch (err) {
        console.error(`Supabase getCollection ${tableName} exception:`, err);
      }
    }
    const local = localStorage.getItem(tableName);
    const parsed = local ? JSON.parse(local) : [];
    return parsed.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  },

  async addDocument(tableName: string, value: any): Promise<any> {
    if (tableName !== 'reservations' && !hasAdminSession()) {
      throw new Error('Unauthorized action: Admin session required.');
    }
    const local = localStorage.getItem(tableName);
    const items = local ? JSON.parse(local) : [];
    const newDoc = { ...value, id: value.id || `${tableName}-${Date.now()}` };
    items.push(newDoc);
    localStorage.setItem(tableName, JSON.stringify(items));
    triggerChange(tableName, items);

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from(tableName)
          .insert([newDoc])
          .select()
          .single();
        if (error) {
          console.error(`Supabase addDocument error in ${tableName}:`, error);
        } else if (data) {
          return data;
        }
      } catch (err) {
        console.error(`Supabase addDocument exception in ${tableName}:`, err);
      }
    }
    return newDoc;
  },

  async updateDocument(tableName: string, docId: string, updates: any): Promise<void> {
    if (tableName !== 'reservations' && !hasAdminSession()) {
      throw new Error('Unauthorized action: Admin session required.');
    }
    const local = localStorage.getItem(tableName);
    const items = local ? JSON.parse(local) : [];
    const updatedItems = items.map((item: any) =>
      item.id === docId ? { ...item, ...updates } : item
    );
    localStorage.setItem(tableName, JSON.stringify(updatedItems));
    triggerChange(tableName, updatedItems);

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from(tableName)
          .update(updates)
          .eq('id', docId);
        if (error) console.error(`Supabase update ${tableName} error:`, error);
      } catch (err) {
        console.error(`Supabase updateDocument exception in ${tableName}:`, err);
      }
    }
  },

  async deleteDocument(tableName: string, docId: string): Promise<void> {
    if (tableName !== 'reservations' && !hasAdminSession()) {
      throw new Error('Unauthorized action: Admin session required.');
    }
    const local = localStorage.getItem(tableName);
    const items = local ? JSON.parse(local) : [];
    const updatedItems = items.filter((item: any) => item.id !== docId);
    localStorage.setItem(tableName, JSON.stringify(updatedItems));
    triggerChange(tableName, updatedItems);

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from(tableName)
          .delete()
          .eq('id', docId);
        if (error) console.error(`Supabase delete ${tableName} error:`, error);
      } catch (err) {
        console.error(`Supabase deleteDocument exception in ${tableName}:`, err);
      }
    }
  },

  subscribeCollection(tableName: string, callback: Subscriber) {
    if (!listeners[tableName]) {
      listeners[tableName] = new Set();
    }
    listeners[tableName].add(callback);

    // Initial load
    this.getCollection(tableName).then(callback);

    let supabaseUnsub = () => {};
    if (isSupabaseConfigured && supabaseClient) {
      const uniqueId = Math.random().toString(36).slice(2, 11);
      const channel = supabaseClient
        .channel(`collection_${tableName}_${uniqueId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          async () => {
            // Re-fetch entire collection to keep in-app sorting and full items
            const fresh = await this.getCollection(tableName);
            callback(fresh);
          }
        )
        .subscribe();
      supabaseUnsub = () => {
        supabaseClient.removeChannel(channel);
      };
    }

    return () => {
      listeners[tableName]?.delete(callback);
      supabaseUnsub();
    };
  },

  // --- Reservations specific helpers with Realtime Trigger ---
  async getReservations(): Promise<any[]> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) return data;
      } catch (err) {
        console.error('Supabase getReservations exception:', err);
      }
    }
    const local = localStorage.getItem('reservations');
    const parsed = local ? JSON.parse(local) : [];
    return parsed.sort((a: any, b: any) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
  },

  async createReservation(resData: { name: string; guests: string; date: string; time: string; request: string }): Promise<any> {
    const newRes = {
      id: `res-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...resData
    };

    const local = localStorage.getItem('reservations');
    const list = local ? JSON.parse(local) : [];
    list.unshift(newRes);
    localStorage.setItem('reservations', JSON.stringify(list));
    triggerChange('reservations', list);

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('reservations')
          .insert([newRes])
          .select()
          .single();
        if (error) console.error('Supabase reservation placement error:', error);
        else if (data) return data;
      } catch (err) {
        console.error('Supabase createReservation exception:', err);
      }
    }
    return newRes;
  },

  async updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'rejected'): Promise<void> {
    if (!hasAdminSession()) {
      throw new Error('Unauthorized action: Admin session required.');
    }
    const local = localStorage.getItem('reservations');
    const list = local ? JSON.parse(local) : [];
    const updated = list.map((item: any) => item.id === id ? { ...item, status } : item);
    localStorage.setItem('reservations', JSON.stringify(updated));
    triggerChange('reservations', updated);

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('reservations')
          .update({ status })
          .eq('id', id);
        if (error) console.error('Supabase update reservation status error:', error);
      } catch (err) {
        console.error('Supabase updateReservationStatus exception:', err);
      }
    }
  },

  subscribeReservations(callback: Subscriber) {
    if (!listeners['reservations']) {
      listeners['reservations'] = new Set();
    }
    listeners['reservations'].add(callback);

    this.getReservations().then(callback);

    let supabaseUnsub = () => {};
    if (isSupabaseConfigured && supabaseClient) {
      const uniqueId = Math.random().toString(36).slice(2, 11);
      const channel = supabaseClient
        .channel(`reservations_realtime_${uniqueId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'reservations' },
          async () => {
            const fresh = await this.getReservations();
            callback(fresh);
          }
        )
        .subscribe();
      supabaseUnsub = () => {
        supabaseClient.removeChannel(channel);
      };
    }

    return () => {
      listeners['reservations']?.delete(callback);
      supabaseUnsub();
    };
  }
};

// ==========================================
// SUPABASE AUTHENTICATION CONTROLLER
// ==========================================
export const authService = {
  // Session Persistence Admin email password login
  async login(email: string, password: string): Promise<any> {
    if (isSupabaseConfigured && supabaseClient) {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data.user;
    } else {
      throw new Error(
        'Admin login requires Supabase to be configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
      );
    }
  },

  async loginWithGoogle(): Promise<void> {
    if (isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
    } else {
      throw new Error('Supabase is not configured yet. Please declare your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.');
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabaseClient) {
      await supabaseClient.auth.signOut();
    }
  },

  getCurrentUser(): any {
    if (isSupabaseConfigured && supabaseClient) {
      // Read active supabase session if present
      try {
        const urlKey = supabaseUrl.split('//')[1]?.split('.')[0];
        const sessionString = localStorage.getItem(`sb-${urlKey}-auth-token`);
        if (sessionString) {
          const session = JSON.parse(sessionString);
          if (session?.user) {
            return {
              id: session.user.id,
              email: session.user.email,
              displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Admin Partner',
              photoURL: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=100'
            };
          }
        }
      } catch (e) {
        console.error('Error parsing synchronous Supabase local session:', e);
      }
    }
    return null;
  },

  async getCurrentUserAsync(): Promise<any> {
    if (isSupabaseConfigured && supabaseClient) {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          return {
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Admin Partner',
            photoURL: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=100'
          };
        }
      } catch (err) {
        console.error('Error fetching asynchronous Supabase user session:', err);
      }
    }
    return null;
  },

  onAuthStateChange(callback: (user: any) => void): (() => void) | null {
    if (isSupabaseConfigured && supabaseClient) {
      const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          callback({
            id: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Admin Partner',
            photoURL: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=100'
          });
        } else {
          callback(null);
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
    return null;
  }
};

// ==========================================
// SUPABASE FILE STORAGE SYSTEM
// ==========================================
export const storageService = {
  // Compression & upload to Supabase bucket 'rabaab-assets'
  async uploadImage(fileOrDataUrl: string | File): Promise<string> {
    // If it's a base64 DataURL (this is what InputGroup outputs), convert or use as-is
    let fileToUpload: File | Blob;
    let fileName = `image-${Date.now()}.jpg`;

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      // Base64 string from canvas
      const arr = fileOrDataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      fileToUpload = new Blob([u8arr], { type: mime });
    } else if (fileOrDataUrl instanceof File) {
      fileToUpload = fileOrDataUrl;
      fileName = `${Date.now()}-${fileOrDataUrl.name}`;
    } else {
      throw new Error('Invalid image data type');
    }

    if (isSupabaseConfigured && supabaseClient) {
      try {
        const bucketName = 'rabaab-assets';

        // Check/create bucket would be ideal, but upload directly is standard.
        // We will do a simple upload.
        const { data, error } = await supabaseClient.storage
          .from(bucketName)
          .upload(fileName, fileToUpload, {
            cacheControl: '31536000',
            upsert: true
          });

        if (error) {
          console.warn('Storage upload error, falling back to dataUrl:', error);
        } else if (data) {
          // Retrieve public url
          const { data: publicUrlData } = supabaseClient.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          if (publicUrlData?.publicUrl) {
            return publicUrlData.publicUrl;
          }
        }
      } catch (err) {
        console.error('Storage system exception:', err);
      }
    }

    // Fallback: If not configured, or if bucket upload fails, we just return the DataURL itself!
    // Since we compress the image down in the canvas to 0.6 quality before upload,
    // storing Base64 works incredibly well as a local sandbox persistence helper!
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl);
  }
};
