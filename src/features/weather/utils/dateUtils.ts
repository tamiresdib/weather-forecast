export function capitalizeFirstLetter(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatTime(timestamp: number, timezone: number) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date((timestamp + timezone) * 1000));
}

export function formatDateKey(timestamp: number, timezone: number) {
  return new Date((timestamp + timezone) * 1000).toISOString().slice(0, 10);
}

export function formatDayLabel(timestamp: number, timezone: number) {
  const todayKey = formatDateKey(Date.now() / 1000, timezone);
  const forecastKey = formatDateKey(timestamp, timezone);

  if (forecastKey === todayKey) {
    return 'Hoje';
  }

  const day = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date((timestamp + timezone) * 1000));

  return `${capitalizeFirstLetter(day.replace('.', ''))}.`;
}

export function isTodayForecast(timestamp: number, timezone: number) {
  const todayKey = formatDateKey(Date.now() / 1000, timezone);
  const forecastKey = formatDateKey(timestamp, timezone);

  return forecastKey === todayKey;
}
