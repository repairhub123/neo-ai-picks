import React, { useEffect } from 'react';
import { trackPageView } from '../utils/analytics';

interface SEOProps {
  title?: string;
  description?: string;
  path: string;
  ogType?: 'website' | 'article' | 'profile';
  keywords?: string | string[];
  jsonLd?: Record<string, unknown>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  path,
  ogType = 'website',
  keywords,
  jsonLd
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://neo-ai-picks.vercel.app';
  
  // 1. Auto-generate Title
  const displayTitle = title || (path === '/' ? 'Neo AI Picks - Find, Compare & Explore AI Tools' : `${path.substring(1).split('/')[0].replace(/-/g, ' ')} Reviews | Neo AI Picks`);
  
  // 2. Auto-generate Description
  const displayDescription = description || `Explore pricing tiers, features, pros and cons, and detailed product comparisons for ${displayTitle.split(' - ')[0]} on Neo AI Picks.`;
  
  // 3. Auto-generate Keywords
  const generateKeywords = (): string => {
    if (keywords) {
      return Array.isArray(keywords) ? keywords.join(', ') : keywords;
    }
    const cleanWords = displayTitle
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(w => w.length > 2 && !['and', 'the', 'for', 'best', 'reviewed', 'picks', 'neo', 'vs', 'with', 'reviews'].includes(w));
    
    const baseKeywords = ['ai tools', 'artificial intelligence', 'directory', 'software comparison', 'neo ai picks'];
    return [...new Set([...cleanWords, ...baseKeywords])].join(', ');
  };
  
  const resolvedKeywords = generateKeywords();
  const canonicalUrl = `${siteUrl}${path}`;

  useEffect(() => {
    // 1. Meta Title
    document.title = displayTitle;

    // Track page view in GA4
    trackPageView(path, displayTitle);

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', displayDescription);

    // 3. Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', resolvedKeywords);

    // 4. Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 5. Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: displayTitle },
      { property: 'og:description', content: displayDescription },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: 'Neo AI Picks' },
      { property: 'og:image', content: `${siteUrl}/og-image.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Neo AI Picks - AI Tools Directory' },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 6. Twitter Cards
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: displayTitle },
      { name: 'twitter:description', content: displayDescription },
      { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
      { name: 'twitter:image:alt', content: 'Neo AI Picks - AI Tools Directory' },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // 7. JSON-LD Structured Data
    const scriptId = 'json-ld-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (script) {
      script.remove();
    }

    if (jsonLd) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up script on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [displayTitle, displayDescription, resolvedKeywords, canonicalUrl, ogType, jsonLd, path, siteUrl]);

  return null; // This component operates solely in document head
};
export default SEO;
