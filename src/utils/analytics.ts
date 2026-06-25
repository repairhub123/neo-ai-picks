const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Declare global window properties for TypeScript compilation
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Initialize dataLayer and gtag placeholder immediately on import (module scope)
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
}

export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('GA4 Measurement ID (VITE_GA_MEASUREMENT_ID) is missing. Analytics is disabled.');
    return;
  }

  // Check if script already exists to avoid duplicate scripts
  if (document.getElementById('ga-gtag')) return;

  const script = document.createElement('script');
  script.id = 'ga-gtag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  if (window.gtag) {
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false // Manual page views in SPA
    });
  }
};

export const trackPageView = (path: string, title: string) => {
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      send_to: GA_MEASUREMENT_ID
    });
  }
};

export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};
