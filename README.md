# VeeduMart Backend

A real, working e-commerce backend for VeeduMart — products, cart, orders,
and an admin panel. Built with Node.js + Express, using a simple file-based
database (lowdb) so it's easy to understand and run with zero setup.

## What's inside

```
veedumart-backend/
├── server.js          <- starts the server
├── routes/
│   ├── products.js    <- product API (list, add, edit, delete)
│   ├── orders.js       <- order API (place order, view orders, update status)
│   └── payments.js    <- Razorpay payment integration (demo mode until you add real keys)
├── db/
│   └── database.js    <- database setup (creates db/data.json automatically)
├── public/
│   ├── index.html     <- the customer-facing shop (connects to the real API)
│   └── admin.html     <- the admin panel (manage products & orders)
├── .env.example        <- copy this to .env for your real settings/keys
└── package.json
```

## Running it on your own computer

You'll need [Node.js](https://nodejs.org) installed (version 18 or newer is fine).

1. Open a terminal in this folder
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser:
   - Shop: http://localhost:4000
   - Admin panel: http://localhost:4000/admin.html

That's it — you now have a real working store running on your computer.
Try adding a product in the admin panel, then refresh the shop page to see it appear.
Place a test order on the shop page, then check the Orders tab in admin — it'll show up immediately.

## How the data is stored

All your products and orders are saved in `db/data.json`, a plain text file
that gets created automatically the first time you run the server. You can
even open it in a text editor to see your data directly. This is great for
learning and for a small store, but isn't built for heavy traffic — see
"Growing beyond this" below for when to upgrade.

## Going live (deploying so customers can actually use it)

Right now this only runs on your own computer. To make it a real public
website, you need to put it on a hosting service. Here's the simplest path:

1. **Push this code to GitHub** (create a free GitHub account if you don't have one,
   create a new repository, and upload this folder).
2. **Deploy on [Render.com](https://render.com)** (has a generous free tier, beginner friendly):
   - Sign up, click "New Web Service", connect your GitHub repo
   - Build command: `npm install`
   - Start command: `npm start`
   - Render gives you a live URL like `veedumart.onrender.com`
3. **Buy a domain** (e.g. veedumart.com) from Namecheap or GoDaddy (~₹700-1000/year),
   then point it to your Render service (Render's docs show exactly how — it's a few DNS settings).

Other good beginner-friendly hosts: Railway.app, Fly.io — all have similar free/cheap tiers.

## Adding real payments (Razorpay)

The payments route (`routes/payments.js`) currently runs in **demo mode** —
it doesn't move real money, but lets your checkout flow work end-to-end for testing.

To accept real payments:
1. Sign up at [razorpay.com](https://razorpay.com) and complete their business KYC
   (you'll need your PAN card and bank account details). This usually takes 1-3 days for approval.
2. Once approved, go to Settings > API Keys in your Razorpay dashboard and generate your keys.
3. Copy `.env.example` to a new file called `.env`, and paste your keys in:
   ```
   RAZORPAY_KEY_ID=your_key_here
   RAZORPAY_KEY_SECRET=your_secret_here
   ```
4. Run `npm install razorpay`
5. Open `routes/payments.js` and follow the comments — uncomment the real
   implementation block, it's ready to go.

**Important: never commit your `.env` file to GitHub.** It contains secret
keys. This project already includes a `.gitignore` that excludes it.

## Growing beyond this

This setup is great for learning and for your first hundred orders. When your
store grows and you want sturdier infrastructure, the things to upgrade are:

- **Database**: swap `lowdb` for a real database like PostgreSQL or MongoDB
  (your `routes/` files won't need much rewriting — just the `db/database.js` file)
- **Authentication**: add a login system to the admin panel so only you can access it
  (right now, anyone with the link can open `/admin.html` — fine for personal use,
  but add a password before sharing your domain widely)
- **Image uploads**: currently products don't have real photos — you can add
  image upload support, or just paste image URLs into the `image` field

## Quick troubleshooting

- **"Cannot find module" error**: run `npm install` again
- **Port already in use**: another program is using port 4000. Either close it,
  or change `PORT=4000` in your `.env` file to a different number like `5000`
- **Orders not showing in admin**: make sure both the shop and admin pages are
  open on the same server (same `http://localhost:4000` address)
