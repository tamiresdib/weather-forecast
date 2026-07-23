import rainIcon from '../../../assets/images/Chuva.svg';
import sunnyIcon from '../../../assets/images/Ensolarado.svg';
import partlyCloudyIcon from '../../../assets/images/Inicio da Noite.svg';
import cloudyIcon from '../../../assets/images/Nublado.svg';
import nightIcon from '../../../assets/images/Noite.svg';

const iconByWeatherMain = {
  drizzle: rainIcon,
  rain: rainIcon,
  thunderstorm: rainIcon,
} satisfies Record<string, string>;

const iconByDayPeriod = {
  clear: {
    day: sunnyIcon,
    night: nightIcon,
  },
  clouds: {
    day: cloudyIcon,
    night: partlyCloudyIcon,
  },
} satisfies Record<string, { day: string; night: string }>;

export function getWeatherIcon(weatherMain: string, openWeatherIcon: string) {
  const normalizedWeather = weatherMain.toLowerCase();
  const isNight = openWeatherIcon.endsWith('n');

  const matchedFixedIcon = Object.entries(iconByWeatherMain).find(
    ([weatherCondition]) => normalizedWeather.includes(weatherCondition),
  );

  if (matchedFixedIcon) {
    return matchedFixedIcon[1];
  }

  const matchedDayPeriodIcon = Object.entries(iconByDayPeriod).find(
    ([weatherCondition]) => normalizedWeather.includes(weatherCondition),
  );

  if (matchedDayPeriodIcon) {
    const [, weatherIcons] = matchedDayPeriodIcon;

    return isNight ? weatherIcons.night : weatherIcons.day;
  }

  return isNight ? nightIcon : cloudyIcon;
}
