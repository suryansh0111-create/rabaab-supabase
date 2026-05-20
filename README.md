# Rabaab — Royal Mughlai Fine Dining

Rabaab is Panchkula's premier modern luxury Mughlai & North Indian culinary destination. This repository houses the highly detailed, reactive client-side dining portal, reservation scheduler, and custom administrative management suite integrated seamlessly with **Supabase**.

---

## 🚀 Features & Intentional Architecture

- **Visual Sophistication**: Royal Gold animations, modern luxury typography pairings, dynamic gallery displays, and elegant parallax styling utilizing Lenis and motion transitions.
- **Robust Realtime System**: High fidelity table status updates, custom content, and imagery synchronization powered by Supabase.
- **Administrative Suite**: Locked behind a secure, secret administrative console with advanced form validation, client-side rate-limiting, and sanitized DOM structures to eradicate XSS/injection vulnerabilities.

---

## 🛠️ Step-by-Step Production Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [Supabase](https://supabase.com) account

---

### 2. Configure Your Supabase Project

1. Log in to your **Supabase Dashboard** and click **New Project**.
2. Go to the **SQL Editor** tab from the left sidebar navigation menu.
3. Complete database setup and RLS rules by copying all contents from `supabase/schema.sql` into the SQL Editor panel and executing the query. This creates the following secure schemas:
   - `site_content`
   - `signature_dishes`
   - `menu_categories`
   - `gallery`
   - `reservations`
4. Setup a **Public Storage Bucket**:
   - Go to the **Storage** dashboard.
   - Click **New Bucket**, name it exactly `rabaab-assets`, and toggle on **Public bucket**.
   - Ensure you configure proper policies allowing authenticated users full edit control, while permitting anyone to view objects.

---

### 3. Create Administrative Credentials

To authenticate as an administrator to manage the reservations and content:
1. Go to **Authentication** > **Users** in the Supabase Dashboard.
2. Click **Add User** -> **Create User** with a formal email and a strong password. This will serve as your admin login credential on the website.

---

### 4. Setup Local Environment Variables

Create a file named `.env.local` (or `.env` in the root folder) and configure your public Supabase keys:

```env
# Public Supabase configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
```

*(Note: Never check actual credentials or API keys into git.)*

---

### 5. Install Dependencies and Run

Execute these terminal commands in your repository root directory:

```bash
# Install optimized, secured packages
npm install

# Start development server on port 3000
npm run dev
```

---

## 🛡️ Administrative Panel Access Controls

For security reasons, the administrative controls are hidden from standard users on the website:
1. The administrative panel is accessible via a private keyboard shortcut. Contact the developer for access details.
2. If Supabase is configured correctly, this will instantly mount the secure Rabaab Administrator gateway.
3. Log in using the email and password you created in your Supabase Auth dashboard.
