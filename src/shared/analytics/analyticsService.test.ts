import { afterEach, describe, expect, it, vi } from 'vitest';
import { ANALYTICS_COLLECTION_EVENTS } from './analyticsParameters';
import {
  initializeAnalytics,
  trackCollectionEvent,
  trackEvent,
  trackPageView,
} from './analyticsService';

describe('analyticsService', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    document.head.innerHTML = '';
    window.dataLayer = undefined;
    window.gtag = undefined;
  });

  it('does not initialize Google Analytics without measurement id', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');

    initializeAnalytics();

    expect(document.getElementById('google-analytics-script')).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  it('initializes Google Analytics with measurement id', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');

    initializeAnalytics();

    const script = document.getElementById(
      'google-analytics-script',
    ) as HTMLScriptElement;

    expect(script).toBeInTheDocument();
    expect(script.src).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
    expect(window.dataLayer).toHaveLength(2);
  });

  it('does not initialize Google Analytics more than once', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');

    initializeAnalytics();
    initializeAnalytics();

    expect(
      document.querySelectorAll('#google-analytics-script'),
    ).toHaveLength(1);
  });

  it('tracks custom events when Google Analytics is enabled', () => {
    const gtag = vi.fn();

    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    window.gtag = gtag;

    trackEvent('city_selected', {
      city: 'São Paulo',
    });

    expect(gtag).toHaveBeenCalledWith('event', 'city_selected', {
      city: 'São Paulo',
    });
  });

  it('does not track events when Google Analytics is disabled', () => {
    const gtag = vi.fn();

    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    window.gtag = gtag;

    trackEvent('city_selected');

    expect(gtag).not.toHaveBeenCalled();
  });

  it('tracks page views', () => {
    const gtag = vi.fn();

    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    window.gtag = gtag;

    trackPageView('Weather Search', '/weather-search');

    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/weather-search',
      page_title: 'Weather Search',
    });
  });

  it('tracks collection events using the tracking map parameters', () => {
    const gtag = vi.fn();

    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    window.gtag = gtag;

    trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.welcomeContinueClicked);

    expect(gtag).toHaveBeenCalledWith('event', 'clicou', {
      event_label: 'botao:continuar',
      screen_name: 'tela-boas-vindas',
    });
  });

  it('tracks collection events without labels', () => {
    const gtag = vi.fn();

    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    window.gtag = gtag;

    trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.welcomeScreenDisplayed);

    expect(gtag).toHaveBeenCalledWith('event', 'tela-exibiu', {
      event_label: undefined,
      screen_name: 'tela-boas-vindas',
    });
  });
});
