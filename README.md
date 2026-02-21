<div align="center">
  <h1>🌌 P O X T E R 8 8 🌌</h1>
  <p><strong>A Modern, High-Performance Premium Poster Store</strong></p>
</div>

<br />

Welcome to **POXTER88**, an immersive e-commerce platform dedicated to premium art prints and posters. Built with an uncompromising focus on aesthetics, smooth animations, and top-tier user experience, POXTER88 offers a seamless shopping journey for customers and a powerful backend for administrators.

---

## ✨ Features

### 🛍️ Client Storefront
- **Premium UI/UX**: Dark mode by default, glassmorphism elements, minimal typography, and fluid CSS animations.
- **Product Gallery**: Browse curated collections of high-quality posters with real-time updates.
- **Instant Search**: Quickly filter and find products by name.
- **Refined Shopping Cart**: Add items, adjust quantities, and instantly view your subtotal.
- **Secure Checkout**: Support for Cash on Delivery (COD) and Online Payments (via Razorpay integration).
- **Order Tracking**: Dedicated portal to track real-time order status via Order ID.

### 🔐 Admin Dashboard
- **Analytics Overview**: Real-time sales metrics, active users, total orders, and revenue insights.
- **Inventory Management**: Effortlessly add, edit, or delete products and upload high-res poster images.
- **Order Management**: Monitor all incoming orders and update statuses effortlessly (*Processing, Confirmed, Shipped, Delivered*).
- **Secure Access Control**: Robust authentication flow for store administrators.

---


## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
- **Build Tool**: [Vite](https://vitejs.dev/) - Blazing fast hot module replacement (HMR) and optimized builds.
- **Backend & Database**: [Supabase](https://supabase.com/) - PostgreSQL DB, secure Authentication, and scalable Cloud Storage for images.
- **Payment Gateway**: [Razorpay](https://razorpay.com/) - Handling secure online transactions.
- **Icons**: [Lucide Icons](https://lucide.dev/) for crisp, scalable vector icons.

---

## 🚀 Getting Started

Follow these steps to set up the project locally for development and testing.

### 📋 Prerequisites
Ensure you have the following installed and configured:
-   **Node.js** (v16.x or higher)
-   **npm** (Node Package Manager)
-   A **Supabase** account and project
-   A **Razorpay** account for Test/Live API keys

### ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Antidoteprashant/poxter88.git
   cd poxter88
   ```

2. **Install node dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory and populate it with your credentials:
   ```ini
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Database Setup**
   Go to your Supabase project dashboard -> SQL Editor -> New query.
   Copy the contents of `supabase/setup.sql` into the editor and run it to create the necessary tables, policies, and authentication triggers.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   > Your application is now running at `http://localhost:5173`. Changes will live-reload automatically.

### 📦 Build for Production

To create an optimized, minified production build:
```bash
npm run build
```
To serve and preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Structure

```text
poxter88/
├── css/                  # Modular stylesheets (styles.css, admin.css, etc.)
├── js/                   # Vanilla JS logic modules (main.js, cart.js, etc.)
├── images/               # Static image assets
├── supabase/             # DB Schema & Migrations (setup.sql)
├── index.html            # Main Storefront Layout
├── admin.html            # Admin Dashboard Portal
├── track.html            # Order Tracking View
├── package.json          # Node dependencies and scripts
└── vite.config.js        # Optional: Vite bundler configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! 
Feel free to check the [issues page](https://github.com/Antidoteprashant/poxter88/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---
<div align="center">
  Crafted with ❤️ for aesthetic web minimalists.
</div>
