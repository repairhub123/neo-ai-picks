import fs from 'fs';
import path from 'path';

const siteUrl = process.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';
console.log('Post-build: Using site URL:', siteUrl);

const distDir = path.resolve('dist');
const sitemapPath = path.join(distDir, 'sitemap_index.xml');
const robotsPath = path.join(distDir, 'robots.txt');

if (fs.existsSync(sitemapPath)) {
  let content = fs.readFileSync(sitemapPath, 'utf8');
  content = content.replace(/https:\/\/neo-ai-picks\.vercel\.app/g, siteUrl);
  fs.writeFileSync(sitemapPath, content, 'utf8');
  console.log('Post-build: Updated dist/sitemap_index.xml');
} else {
  console.error('Post-build: dist/sitemap_index.xml not found!');
}

if (fs.existsSync(robotsPath)) {
  let content = fs.readFileSync(robotsPath, 'utf8');
  content = content.replace(/https:\/\/neo-ai-picks\.vercel\.app/g, siteUrl);
  fs.writeFileSync(robotsPath, content, 'utf8');
  console.log('Post-build: Updated dist/robots.txt');
} else {
  console.error('Post-build: dist/robots.txt not found!');
}
