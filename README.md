# NeoAIPicks - Professional AI Discovery Directory & Comparison Platform

NeoAIPicks is a production-ready, highly optimized, and content-rich AI discovery directory built to index, profile, and compare the world's leading generative artificial intelligence tools. It features dynamic SEO optimization, structured metadata schema mappings, clean client-side routing, and responsive mobile-first views.

---

## 🚀 Key Features

- ** Vetted Directory**: Over 50 premium AI tools profiled across 7 categories (Writing, Coding, Image Generation, Video Generation, Voice, Automation, Productivity) with detailed overviews, features lists, pricing details, pros/cons, use cases, and alternatives.
- ** Side-by-Side Comparisons**: Premium detailed comparison pages (e.g., ChatGPT vs Claude, Claude vs Gemini, Cursor vs Windsurf) featuring detailed introduction briefs, specification tables, pros & cons, demographics suitability maps, performance analyses, and FAQs.
- ** Hub-and-Spoke SEO Architecture**: Exhaustive SEO guides exceeding 1200+ words each, complete with structured data tables, list mappings, and zero-refresh client-side internal routing linking back to profiles.
- ** Clean URL State Router**: HTML5 history-based single-page application (SPA) routing with popstate history listeners to enable back/forward browser support and seamless routing.
- ** Google Analytics & Search Console Ready**: Out-of-the-box support for search console verification and GA4 tracking via commented placeholders inside `index.html`.
- ** XML Sitemap & robots.txt**: Complete search engine crawler listings index in `public/sitemap.xml` mapping 209 target routes.
- ** Premium Styling**: Sleek glassmorphic layout, customized scrollbars, and high contrast typography.

---

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build System**: Vite 8 (TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Hosting Configuration**: Vercel ready SPA rewrites (`vercel.json`)

---

## 📂 Directory Structure

```
neo_ai_picks/
├── public/
│   ├── favicon.svg        # Standard SVG favicon
│   ├── robots.txt         # Crawler indexing rules
│   └── sitemap.xml        # Dynamic XML sitemap indexing all routes
├── src/
│   ├── assets/            # Static assets
│   ├── components/        # Reusable global components
│   │   ├── Breadcrumbs.tsx # Breadcrumbs routing locator
│   │   ├── Footer.tsx      # Unified footer with legal navigation
│   │   ├── Navbar.tsx      # Sticky navbar with responsive panel
│   │   ├── SEO.tsx         # Head meta and JSON-LD injector
│   │   ├── ToolCard.tsx    # Card listing template
│   │   └── ToolIcon.tsx    # Dynamic tool logo renderer
│   ├── data/              # Structured datasets
│   │   ├── comparisons/   # Premium comparison pages (1500+ words each)
│   │   │   ├── chatgpt-vs-claude.ts
│   │   │   ├── cursor-vs-windsurf.ts
│   │   │   └── registry.ts
│   │   ├── blog.ts        # Blog feed index and dynamic article text
│   │   ├── comparisons.ts # Pairs listing configurations
│   │   ├── detailedComparisons.ts # Fallback comparisons specifications
│   │   └── tools.json     # Main tools database (50 tools)
│   ├── pages/             # Layout view components
│   │   ├── BlogDetail.tsx  # Article reader view
│   │   ├── BlogFeed.tsx    # Blog archives listing
│   │   ├── CompareDetail.tsx # Comparison side-by-side matrices
│   │   ├── CompareFeed.tsx # Comparison listings category index
│   │   ├── Contact.tsx     # Contact submission form page
│   │   ├── Home.tsx        # Directory explore dashboard
│   │   ├── NotFound.tsx    # Custom 404 page
│   │   ├── Privacy.tsx     # Privacy Policy page
│   │   ├── SubmitTool.tsx  # Submissions dashboard
│   │   └── Terms.tsx       # Terms of Service page
│   ├── App.tsx            # Main router and state coordinator
│   ├── index.css          # Styling tokens
│   └── main.tsx           # Entry coordinate
├── package.json           # Dependecy lists
├── vercel.json            # Vercel rewrite configuration for SPA routes
└── vite.config.ts         # Vite bundler parameters
```

---

## ⚙️ Development Setup

### Prerequisite
Ensure you have Node.js (v18+) and npm installed locally.

### 1. Clone & Install
```bash
git clone <your-repository-url>
cd neo_ai_picks
npm install
```

### 2. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build Check
Compile and bundle the project for release:
```bash
npm run build
```
Verify that the output is generated inside the `dist/` directory without compilation errors.

---

## 📈 Deployment & Launch Checklist

1. **Verify Google Search Console**: Replace `YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_ID_HERE` inside `index.html` with your verification string.
2. **Setup Google Analytics**: Replace `G-YOUR_MEASUREMENT_ID_HERE` inside `index.html` with your GA4 stream measurement tag.
3. **Vercel Deploy**: Ensure `vercel.json` rewrites are active on build parameters to avoid 404s on browser reloads.
4. **Connect Domain**: Point your custom domain A/CNAME records to Vercel/Netlify hosting networks.
