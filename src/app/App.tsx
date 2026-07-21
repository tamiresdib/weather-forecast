import { useState } from 'react';
import type { CityWeather } from '../features/types/cityWeather';
import { WelcomeScreen } from '../features/welcome/components/WelcomeScreen';
import { WeatherDetailsScreen } from '../features/weather/components/WeatherDetailsScreen';
import { WeatherSearchScreen } from '../features/weather/components/WeatherSearchScreen';

type AppScreen = 'welcome' | 'weather-search' | 'weather-details';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [selectedCity, setSelectedCity] = useState<CityWeather | null>(null);

  function handleSelectCity(weather: CityWeather) {
    setSelectedCity(weather);
    setCurrentScreen('weather-details');
  }

  if (currentScreen === 'weather-details' && selectedCity) {
    return (
      <WeatherDetailsScreen
        selectedCity={selectedCity}
        onBack={() => setCurrentScreen('weather-search')}
      />
    );
  }

  if (currentScreen === 'weather-search') {
    return <WeatherSearchScreen onSelectCity={handleSelectCity} />;
  }

  return <WelcomeScreen onStart={() => setCurrentScreen('weather-search')} />;
}

export default App;
