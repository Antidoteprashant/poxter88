# POXTER88 - Premium Poster Store

Welcome to **POXTER88**, a modern, high-performance e-commerce platform dedicated to premium art prints and posters. Built with a focus on aesthetics and user experience, this project features a seamless shopping experience for customers and a comprehensive dashboard for administrators.

## Key Features

### Client Storefront
-   **Premium UI/UX**: A dark, aesthetic design with glassmorphism elements and smooth animations.
-   **Product Browsing**: View a curated collection of posters with high-quality images.
-   **Search Functionality**: Quickly find posters by name.
-   **Shopping Cart**: Add items to cart, view subtotal, and manage quantities.
-   **Checkout System**: Secure checkout with support for Cash on Delivery (COD) and Online Payments (Razorpay).
-   **Order Tracking**: Track order status using Order ID.

### Admin Dashboard
-   **Overview Metrics**: Real-time stats for Total Sales, Orders, Active Users, and Products.
-   **Product Management**: Add, edit, and delete products (posters) with image upload support.
-   **Order Management**: View all orders, update statuses (Confirmed, Processing, Shipped, Delivered), and filter by status.
-   **Analytics**: Visual insights into sales performance and revenue.
-   **Admin Access Control**: Manage admin users securely.

## Technology Stack

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
-   **Build Tool**: [Vite](https://vitejs.dev/) - Fast development and optimized builds.
-   **Backend & Database**: [Supabase](https://supabase.com/) - PostgreSQL, Authentication, Realtime, and Storage.
-   **Payment Gateway**: [Razorpay](https://razorpay.com/) - Secure online payments.
-   **Icons**: [Lucide Icons](https://lucide.dev/) (via SVG)

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   Node.js (v16 or higher)
-   npm (v7 or higher)
-   A Supabase project (for database and auth)
-   A Razorpay account (for payments)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Antidoteprashant/poxter88.git
    cd poxter88
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Supabase and Razorpay credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Build for Production

To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

## Project Structure

-   `index.html`: Main storefront entry point.
-   `admin.html`: Admin dashboard entry point.
-   `track.html`: Order tracking page.
-   `css/`: Stylesheets for different sections (styles.css, admin.css, responsive.css).
-   `js/`: JavaScript modules for logic (main.js, admin.js, auth.js, etc.).
-   `supabase/`: Supabase configuration and migrations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
