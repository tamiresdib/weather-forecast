import { useState } from 'react';
import { WelcomeScreen } from '../features/welcome/components/WelcomeScreen';
import { WeatherSearchScreen } from '../features/weather/components/WeatherSearchScreen';

type AppScreen = 'welcome' | 'weather-search';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');

  function handleStartSearch() {
    setCurrentScreen('weather-search');
  }

  if (currentScreen === 'weather-search') {
    return <WeatherSearchScreen />;
  }

  return <WelcomeScreen onStart={handleStartSearch} />;
}

export default App;
