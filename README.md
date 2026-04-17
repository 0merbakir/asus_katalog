# Asus Catalog Project

A high-performance product catalog and inventory management application built with Next.js 16 and Tailwind CSS.

## Features
- **Dynamic Catalog**: Real-time product listing and sorting (Price / Model).
- **Admin Dashboard**: Manage prices, stock levels, and SPIFF rewards.
- **Persistent Storage**: Data is synced to a server-side `products.json` for shared access.
- **SPIFF System**: Interactive reward tags for sales teams.
- **Glassmorphism Design**: High-end, premium UI with smooth animations and dark mode.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Icons**: Lucide React
- **Storage**: Server-side JSON with custom API sync.

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/`: Next.js pages and API routes.
- `components/`: Reusable UI components (Modals, List Items, etc.).
- `lib/`: Core logic and storage abstractions.
- `public/`: Assets and the central `products.json` data store.
