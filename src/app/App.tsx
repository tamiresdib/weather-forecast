import { useState } from 'react';
import { WelcomeScreen } from '../features/welcome/components/WelcomeScreen';
import { WeatherSearchScreen } from '../features/weather/components/WeatherSearchScreen';
import { WeatherDetailsScreen } from '../features/weather/components/WeatherDetailsScreen';

type AppScreen = 'welcome' | 'weather-search' | 'weather-details';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');

  if (currentScreen === 'weather-details') {
    return (
      <WeatherDetailsScreen onBack={() => setCurrentScreen('weather-search')} />
    );
  }

  if (currentScreen === 'weather-search') {
    return (
      <WeatherSearchScreen
        onSelectCity={() => setCurrentScreen('weather-details')}
      />
    );
  }

  return <WelcomeScreen onStart={() => setCurrentScreen('weather-search')} />;
}

export default App;
