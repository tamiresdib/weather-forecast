export const ANALYTICS_SCREEN_NAMES = {
  apiError: 'tela-erro-api',
  cityNotFound: 'tela-erro-cidade-nao-encontrada',
  details: 'tela-detalhes-cidade',
  home: 'tela-inicio',
  searchCity: 'tela-buscar-cidade',
  welcome: 'tela-boas-vindas',
} as const;

export const ANALYTICS_EVENT_ACTIONS = {
  clicked: 'clicou',
  filled: 'preencheu',
  screenDisplayed: 'tela-exibiu',
  selected: 'selecionou',
  viewed: 'visualizou',
} as const;

export const ANALYTICS_EVENT_LABELS = {
  backButton: 'botao:voltar',
  citySearchResult: 'cidade:resultado-busca',
  nextDaysForecastSection: 'secao:previsao-proximos-dias',
  retryButton: 'botao:tentar-novamente',
  searchButton: 'botao:buscar',
  searchField: 'campo:buscar',
  suggestionCity: 'cidade:sugestao',
  welcomeContinueButton: 'botao:continuar',
} as const;

export type AnalyticsScreenName =
  (typeof ANALYTICS_SCREEN_NAMES)[keyof typeof ANALYTICS_SCREEN_NAMES];

export type AnalyticsEventAction =
  (typeof ANALYTICS_EVENT_ACTIONS)[keyof typeof ANALYTICS_EVENT_ACTIONS];

export type AnalyticsEventLabel =
  (typeof ANALYTICS_EVENT_LABELS)[keyof typeof ANALYTICS_EVENT_LABELS];

export type AnalyticsCollectionEvent = {
  eventAction: AnalyticsEventAction;
  eventLabel?: AnalyticsEventLabel;
  screenName: AnalyticsScreenName;
};

export const ANALYTICS_COLLECTION_EVENTS = {
  apiErrorRetryClicked: {
    eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
    eventLabel: ANALYTICS_EVENT_LABELS.retryButton,
    screenName: ANALYTICS_SCREEN_NAMES.apiError,
  },
  apiErrorScreenDisplayed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
    screenName: ANALYTICS_SCREEN_NAMES.apiError,
  },
  cityNotFoundRetryClicked: {
    eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
    eventLabel: ANALYTICS_EVENT_LABELS.retryButton,
    screenName: ANALYTICS_SCREEN_NAMES.cityNotFound,
  },
  cityNotFoundScreenDisplayed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
    screenName: ANALYTICS_SCREEN_NAMES.cityNotFound,
  },
  detailsBackClicked: {
    eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
    eventLabel: ANALYTICS_EVENT_LABELS.backButton,
    screenName: ANALYTICS_SCREEN_NAMES.details,
  },
  detailsNextDaysForecastViewed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.viewed,
    eventLabel: ANALYTICS_EVENT_LABELS.nextDaysForecastSection,
    screenName: ANALYTICS_SCREEN_NAMES.details,
  },
  detailsScreenDisplayed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
    screenName: ANALYTICS_SCREEN_NAMES.details,
  },
  homeScreenDisplayed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
    screenName: ANALYTICS_SCREEN_NAMES.home,
  },
  homeSearchButtonClicked: {
    eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
    eventLabel: ANALYTICS_EVENT_LABELS.searchButton,
    screenName: ANALYTICS_SCREEN_NAMES.home,
  },
  homeSearchFieldFilled: {
    eventAction: ANALYTICS_EVENT_ACTIONS.filled,
    eventLabel: ANALYTICS_EVENT_LABELS.searchField,
    screenName: ANALYTICS_SCREEN_NAMES.home,
  },
  homeSuggestionCitySelected: {
    eventAction: ANALYTICS_EVENT_ACTIONS.selected,
    eventLabel: ANALYTICS_EVENT_LABELS.suggestionCity,
    screenName: ANALYTICS_SCREEN_NAMES.home,
  },
  searchCityResultSelected: {
    eventAction: ANALYTICS_EVENT_ACTIONS.selected,
    eventLabel: ANALYTICS_EVENT_LABELS.citySearchResult,
    screenName: ANALYTICS_SCREEN_NAMES.searchCity,
  },
  searchCityScreenDisplayed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
    screenName: ANALYTICS_SCREEN_NAMES.searchCity,
  },
  searchCitySearchButtonClicked: {
    eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
    eventLabel: ANALYTICS_EVENT_LABELS.searchButton,
    screenName: ANALYTICS_SCREEN_NAMES.searchCity,
  },
  searchCitySearchFieldFilled: {
    eventAction: ANALYTICS_EVENT_ACTIONS.filled,
    eventLabel: ANALYTICS_EVENT_LABELS.searchField,
    screenName: ANALYTICS_SCREEN_NAMES.searchCity,
  },
  welcomeContinueClicked: {
    eventAction: ANALYTICS_EVENT_ACTIONS.clicked,
    eventLabel: ANALYTICS_EVENT_LABELS.welcomeContinueButton,
    screenName: ANALYTICS_SCREEN_NAMES.welcome,
  },
  welcomeScreenDisplayed: {
    eventAction: ANALYTICS_EVENT_ACTIONS.screenDisplayed,
    screenName: ANALYTICS_SCREEN_NAMES.welcome,
  },
} satisfies Record<string, AnalyticsCollectionEvent>;
