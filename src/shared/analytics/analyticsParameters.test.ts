import { describe, expect, it } from 'vitest';
import {
  ANALYTICS_COLLECTION_EVENTS,
  ANALYTICS_EVENT_ACTIONS,
  ANALYTICS_EVENT_LABELS,
  ANALYTICS_SCREEN_NAMES,
} from './analyticsParameters';

describe('analyticsParameters', () => {
  it('maps the welcome screen events from the collection map', () => {
    expect(ANALYTICS_COLLECTION_EVENTS.welcomeScreenDisplayed).toEqual({
      eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
      screenName: ANALYTICS_SCREEN_NAMES.welcome,
    });

    expect(ANALYTICS_COLLECTION_EVENTS.welcomeContinueClicked).toEqual({
      eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
      eventLabel: ANALYTICS_EVENT_LABELS.welcomeContinueButton,
      screenName: ANALYTICS_SCREEN_NAMES.welcome,
    });
  });

  it('maps error screen retry events from the collection map', () => {
    expect(ANALYTICS_COLLECTION_EVENTS.cityNotFoundRetryClicked).toEqual({
      eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
      eventLabel: ANALYTICS_EVENT_LABELS.retryButton,
      screenName: ANALYTICS_SCREEN_NAMES.cityNotFound,
    });

    expect(ANALYTICS_COLLECTION_EVENTS.apiErrorRetryClicked).toEqual({
      eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
      eventLabel: ANALYTICS_EVENT_LABELS.retryButton,
      screenName: ANALYTICS_SCREEN_NAMES.apiError,
    });
  });
});
