
# 🌍 WorldTripAgency – Modern Tourism & Travel Booking Platform

A complete tourism and travel booking system built for a Saudi client in **Jeddah, KSA**.
This project delivers a seamless travel discovery and booking experience with a powerful admin dashboard, dynamic content management, and smooth performance optimized for production deployment.

---

## ✨ Overview

**WorldTripAgency** is a fully responsive travel platform built using **Nuxt 3** and **Supabase**, offering users the ability to explore travel destinations, browse trip packages, make bookings, receive notifications, and contact the travel agency directly.

The admin system provides full control over the site content including destinations, travel packages, bookings, invoices, and homepage sections.

✅ Built for production
✅ Optimized performance
✅ Multi-language ready
✅ Modern UI with real-time updates
✅ Supports image uploads, invoices, notifications & analytics

---

## 🚀 Live Demo

**Website:** [https://www.worldtripagency.com/](https://www.worldtripagency.com/)
**Repository:** [https://github.com/khaled312001/TravelAgency](https://github.com/khaled312001/TravelAgency)

---

## 🧩 Features

### ✅ **User Features**

* Browse destinations with images, descriptions & highlights
* Explore travel packages with pricing & details
* Booking system with confirmation and invoice generation
* Push notifications
* Contact form with email forwarding
* Multi-language interface (AR/EN ready)
* Fully responsive and optimized for mobile

### ✅ **Admin Dashboard Features**

* Manage destinations (add/edit/delete + image uploads)
* Manage travel packages with hero images
* Manage bookings with invoice management
* Real-time notifications for new bookings & messages
* Contact messages management
* Website content editor (homepage, About, FAQ, etc.)
* SEO settings and metadata control
* Admin profile system
* Analytics and statistical insights

---

## 🛠️ Tech Stack

### **Frontend**

* ✅ Nuxt 3
* ✅ Vue 3 + Composition API
* ✅ TypeScript
* ✅ Tailwind CSS
* ✅ i18n for multilingual support
* ✅ Cloudinary for image hosting (optional)

### **Backend / Services**

* ✅ Supabase Database
* ✅ Supabase Auth
* ✅ Supabase REST APIs
* ✅ Vercel for deployment
* ✅ Push Notifications (Web Push, VAPID Keys)

### **Other Tools**

* VueUse
* Workbox for caching
* Node.js scripts
* API security layers

---

## 📦 Project Structure

```
TravelAgency/
│
├── assets/              # Global styles & assets
├── components/          # Reusable Vue components
├── composables/         # Pinia stores & composables
├── layouts/             # Application layouts
├── locales/             # Multi-language files
├── middleware/          # Auth & routing rules
├── pages/               # Main pages (Home, Destinations, Packages, etc.)
├── plugins/             # Global plugins
├── public/              # Static files
├── server/              # API routes & backend logic
├── supabase/            # SQL schemas, DB setup, service keys
├── utils/               # Helper functions
└── nuxt.config.ts       # Main Nuxt configuration
```

---

## 🗃️ Database (Supabase)

### Main Tables

* `destinations`
* `packages`
* `bookings`
* `invoices`
* `contact_messages`
* `notifications`
* `site_content`
* `settings`
* `admins`

SQL files are included inside:
`/supabase/*.sql`

---

## 📸 Screenshots

> Add your real screenshots here.

```
/public/screenshots/
```

---

## ⚙️ Installation & Setup

### ✅ 1. Clone the repository

```bash
git clone https://github.com/khaled312001/TravelAgency.git
cd TravelAgency
```

### ✅ 2. Install dependencies

```bash
npm install
```

### ✅ 3. Configure environment

Create a `.env` file based on `.env.example` and add:

* Supabase URL
* Supabase anon & service keys
* Cloudinary config
* VAPID keys for push notifications

### ✅ 4. Run development server

```bash
npm run dev
```

Visit: **[http://localhost:3000](http://localhost:3000)**

### ✅ 5. Build for production

```bash
npm run build
npm run preview
```

---

## 🛡️ Security

* CORS protection
* API key validation
* Rate-limited endpoints
* Supabase row-level security (RLS)
* Escaped inputs & safe SQL operations

---

## 🔧 Deployment

This project is optimized for:

✅ **Vercel (recommended)**
✅ Netlify
✅ Hostinger
✅ GoDaddy

Full guides included in:
`DEPLOYMENT_GUIDE.md`
`GODADDY_DEPLOYMENT_GUIDE.md`

---

## 📬 Contact

For any enhancements, technical support, or custom development:

**Developer:** Khaled Ahmed
**Email:** [khaledahmedhaggay@gmail.com](mailto:khaledahmedhaggay@gmail.com)
**LinkedIn:** [https://www.linkedin.com/in/khaled312001](https://www.linkedin.com/in/khaled312001)
**Website:** [https://khaledahmed.net](https://khaledahmed.net)

---

## ⭐ Contribute

Pull requests are welcome!
Feel free to open issues for bugs or feature requests.

---

## 📄 License

This project is licensed under the **MIT License**.

