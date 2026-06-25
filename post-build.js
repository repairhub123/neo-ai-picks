import fs from 'fs';
import path from 'path';

const siteUrl = process.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';
console.log('Post-build: Using site URL:', siteUrl);

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');

// Helper to parse file using regex to find all matches of a pattern
const extractIds = (filePath, regex) => {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(regex)];
  return [...new Set(matches.map(m => m[1]))];
};

// 1. Load Tools
let tools = [];
const toolsPath = path.resolve('src/data/tools.json');
if (fs.existsSync(toolsPath)) {
  tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
}

// 2. Load Comparison IDs
const comparisonsPath = path.resolve('src/data/comparisons.ts');
const comparisonIds = extractIds(comparisonsPath, /id:\s*['"]([^'"]+)['"]/g);

// 3. Load Blog Slugs
const blogPath = path.resolve('src/data/blog.ts');
const blogIds = extractIds(blogPath, /id:\s*['"]([^'"]+)['"]/g);

console.log(`Loaded from source files:\n- ${tools.length} Tools\n- ${comparisonIds.length} Comparisons\n- ${blogIds.length} Blogs`);

// 4. Generate sitemap_index.xml content
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Routes -->
  <url><loc>${siteUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${siteUrl}/compare</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${siteUrl}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${siteUrl}/submit</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${siteUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${siteUrl}/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${siteUrl}/privacy</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${siteUrl}/terms</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>

  <!-- AI Tool Profiles -->
`;

tools.forEach(t => {
  xml += `  <url><loc>${siteUrl}/tool/${t.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
});

xml += `\n  <!-- Comparison Matrices -->\n`;
comparisonIds.forEach(id => {
  xml += `  <url><loc>${siteUrl}/compare/${id}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
});

xml += `\n  <!-- Blog Articles -->\n`;
blogIds.forEach(id => {
  // Exclude duplicate matched IDs that are interfaces or category types
  if (['Writing', 'Coding', 'Image Generation', 'Video Generation', 'Productivity', 'Marketing', 'Automation'].includes(id)) return;
  xml += `  <url><loc>${siteUrl}/blog/${id}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
});

xml += `</urlset>\n`;

// Write to public/sitemap_index.xml (so it's in the repo with the fallback domain)
fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), xml.replace(new RegExp(siteUrl, 'g'), 'https://neo-ai-picks.vercel.app'), 'utf8');
console.log('Post-build: Re-generated public/sitemap_index.xml');

// Write to dist/sitemap_index.xml
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'sitemap_index.xml'), xml, 'utf8');
  console.log('Post-build: Wrote dist/sitemap_index.xml');
}

// 5. Generate robots.txt content
const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap_index.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt.replace(new RegExp(siteUrl, 'g'), 'https://neo-ai-picks.vercel.app'), 'utf8');
console.log('Post-build: Re-generated public/robots.txt');

if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log('Post-build: Wrote dist/robots.txt');
}
