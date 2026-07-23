import rainIcon from '../../../assets/images/Chuva.svg';
import sunnyIcon from '../../../assets/images/Ensolarado.svg';
import partlyCloudyIcon from '../../../assets/images/Inicio da Noite.svg';
import cloudyIcon from '../../../assets/images/Nublado.svg';
import nightIcon from '../../../assets/images/Noite.svg';

export function getWeatherIcon(weatherMain: string, openWeatherIcon: string) {
  const normalizedWeather = weatherMain.toLowerCase();
  const isNight = openWeatherIcon.endsWith('n');

  if (
    normalizedWeather.includes('rain') ||
    normalizedWeather.includes('drizzle') ||
    normalizedWeather.includes('thunderstorm')
  ) {
    return rainIcon;
  }

  if (normalizedWeather.includes('clear')) {
    return isNight ? nightIcon : sunnyIcon;
  }

  if (normalizedWeather.includes('clouds')) {
    return isNight ? partlyCloudyIcon : cloudyIcon;
  }

  return isNight ? nightIcon : cloudyIcon;
}
