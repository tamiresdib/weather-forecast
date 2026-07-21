export type OpenWeatherLocation = {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type OpenWeatherCurrentResponse = {
  dt: number;
  timezone: number;
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
};

export type OpenWeatherForecastResponse = {
  city: {
    name: string;
    country: string;
    timezone: number;
  };
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
};
