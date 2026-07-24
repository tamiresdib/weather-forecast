import { useEffect, useState } from 'react';
import type { CityWeather } from '../features/types/cityWeather';
import { WelcomeScreen } from '../features/welcome/components/WelcomeScreen';
import { WeatherDetailsScreen } from '../features/weather/components/WeatherDetailsScreen';
import { WeatherSearchScreen } from '../features/weather/components/WeatherSearchScreen';
import { ANALYTICS_COLLECTION_EVENTS } from '../shared/analytics/analyticsParameters';
import {
  trackCollectionEvent,
  trackEvent,
} from '../shared/analytics/analyticsService';

type AppScreen = 'welcome' | 'weather-search' | 'weather-details';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [selectedCity, setSelectedCity] = useState<CityWeather | null>(null);

  useEffect(() => {
    const screenDisplayedEventByScreen = {
      welcome: ANALYTICS_COLLECTION_EVENTS.welcomeScreenDisplayed,
      'weather-search': ANALYTICS_COLLECTION_EVENTS.homeScreenDisplayed,
      'weather-details': ANALYTICS_COLLECTION_EVENTS.detailsScreenDisplayed,
    } satisfies Record<AppScreen, typeof ANALYTICS_COLLECTION_EVENTS[keyof typeof ANALYTICS_COLLECTION_EVENTS]>;

    trackCollectionEvent(screenDisplayedEventByScreen[currentScreen]);
  }, [currentScreen]);

  function handleSelectCity(weather: CityWeather) {
    trackEvent('city_selected', {
      city: weather.city,
      country: weather.locationLabel,
    });
    trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.homeSuggestionCitySelected, {
      city: weather.city,
      country: weather.locationLabel,
    });

    setSelectedCity(weather);
    setCurrentScreen('weather-details');
  }

  if (currentScreen === 'weather-details' && selectedCity) {
    return (
      <WeatherDetailsScreen
        selectedCity={selectedCity}
        onBack={() => {
          trackEvent('navigation_back_clicked', {
            from_screen: 'weather-details',
            to_screen: 'weather-search',
          });
          trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.detailsBackClicked);
          setCurrentScreen('weather-search');
        }}
      />
    );
  }

  if (currentScreen === 'weather-search') {
    return <WeatherSearchScreen onSelectCity={handleSelectCity} />;
  }

  return (
    <WelcomeScreen
      onStart={() => {
        trackEvent('welcome_started');
        trackCollectionEvent(ANALYTICS_COLLECTION_EVENTS.welcomeContinueClicked);
        setCurrentScreen('weather-search');
      }}
    />
  );
}

export default App;
