# 💻 Admin & Staff Management Dashboard

A high-performance management dashboard for the E-Commerce Book Store platform. Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, and modern **Shadcn UI** primitives.

---

## 🛠️ Technology Stack & Libraries

* **Core**: React 19, TypeScript, Vite.
* **Styling**: Tailwind CSS V4 for rapid, CSS-native design token structures.
* **State Management**: Zustand for light-weight client states.
* **Server State**: `@tanstack/react-query` for reliable api caching, synchronization, and retry behaviors.
* **Notifications**: `sonner` for rich, non-blocking toast animations.
* **Visual Data**: `recharts` for charts, tables, and metric breakdowns.
* **Icons**: `lucide-react` for smooth vector graphics.

---

## 🎨 UI Architecture & Migration

This dashboard has been fully migrated from traditional browser components to a premium design system:
1. **Shadcn UI Pagination**: Integrated in Promotions, Vouchers, Books, and Users directories to deliver dynamic, high-performance search engine page results.
2. **Shadcn UI AlertDialog**: Ensures destructive administrative actions (e.g. deleting books, promotions, or accounts) are verified through beautiful, accessible modals.
3. **Sonner Toast Alerts**: Dispatched instantly on API callback successes or failures, replacing legacy web browser popups.
4. **Clean Code Protocol (P0)**: Refactored complex source modules, ensuring no single component file exceeds the strict **300 lines of code** rule.

---

## 📂 Core Folder Structure

```
dashboard/
├── src/
│   ├── components/            # Reusable UI & Layout Components
│   │   ├── admin-users/       # Users lists, filters, and paginators
│   │   ├── admin-vouchers/    # Vouchers management tables & forms
│   │   ├── staff-books/       # Books inventory grids and details panels
│   │   ├── staff-categories/  # Categories & authors managers
│   │   ├── staff-promotions/  # Split bento promotions grid & paginators
│   │   ├── ui/                # Core Shadcn UI primitives (alert-dialog, pagination, sonner, etc.)
│   │   └── layout/            # Sidebar navigation and grid shell wrappers
│   ├── pages/                 # Routing Entrypoints
│   │   ├── admin/             # Administrator dashboards, roles, and user pages
│   │   ├── staff/             # Books, promotions, orders, inventory, and shipments pages
│   │   └── login.tsx          # Secure JWT login gateway
│   ├── services/              # Axios-driven API client abstraction services
│   ├── App.tsx                # Routing definitions and global Toaster mount
│   ├── index.css              # Core design tokens and custom scrollbars
│   └── main.tsx               # Client bootstrap entrypoint
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started Locally

### Setup
1. Install node packages:
   ```bash
   npm install
   ```
2. Configure your API base URL (defaults to `http://localhost:3000/api` in services).

### Run in Development Mode
```bash
npm run dev
```
*The dev server runs on [http://localhost:5173](http://localhost:5173).*

### Build for Production
```bash
npm run build
```
The highly optimized static bundle is compiled to `/dist`, ready for deployment to systems like Vercel, Netlify, or AWS S3.
