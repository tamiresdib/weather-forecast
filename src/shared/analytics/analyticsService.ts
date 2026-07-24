import type { AnalyticsCollectionEvent } from './analyticsParameters';

type AnalyticsEventName =
  | 'api_error'
  | 'city_search_cleared'
  | 'city_search_completed'
  | 'city_search_retried'
  | 'city_selected'
  | 'forecast_day_selected'
  | 'navigation_back_clicked'
  | 'page_view'
  | 'welcome_started'
  | 'weather_details_retried';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_SCRIPT_ID = 'google-analytics-script';

function getGoogleAnalyticsMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
}

function isGoogleAnalyticsEnabled() {
  return Boolean(getGoogleAnalyticsMeasurementId());
}

export function initializeAnalytics() {
  const measurementId = getGoogleAnalyticsMeasurementId();

  if (!measurementId || document.getElementById(GA_SCRIPT_ID)) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.id = GA_SCRIPT_ID;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  document.head.appendChild(script);
}

export function trackPageView(pageTitle: string, pagePath: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

export function trackCollectionEvent(
  collectionEvent: AnalyticsCollectionEvent,
  eventParams: AnalyticsParams = {},
) {
  trackEvent(collectionEvent.eventAction, {
    event_label: collectionEvent.eventLabel,
    screen_name: collectionEvent.screenName,
    ...eventParams,
  });
}

export function trackEvent(
  eventName: AnalyticsEventName | AnalyticsCollectionEvent['eventAction'],
  eventParams: AnalyticsParams = {},
) {
  if (!isGoogleAnalyticsEnabled()) {
    return;
  }

  window.gtag?.('event', eventName, eventParams);
}
