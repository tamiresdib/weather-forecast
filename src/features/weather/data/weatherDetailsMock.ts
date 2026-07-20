import type { WeatherDetails } from "../../types/weatherDetails";
import sunnyIcon from "../../../assets/images/Ensolarado.svg";
import cloudyIcon from "../../../assets/images/Nublado.svg";
import rainIcon from "../../../assets/images/Chuva.svg";
import partlyCloudyIcon from "../../../assets/images/Inicio da Noite.svg";
import nascerDoSolIcon from "../../../assets/images/Nascer do Sol.svg";

export const weatherDetailsMock: WeatherDetails = {
  city: "São Paulo",
  locationLabel: "Minha localização",
  currentTemperature: 20,
  maxTemperature: 25,
  minTemperature: 18,
  hourlyForecast: [
    {
      id: "now",
      time: "Agora",
      temperature: 20,
      condition: "Chuva fraca",
      icon: rainIcon,
    },
    {
      id: "06",
      time: "06:00",
      temperature: 21,
      condition: "Sol",
      icon: sunnyIcon,
    },
    {
      id: "0640",
      time: "06:40",
      temperature: 22,
      condition: "Nascer do Sol",
      icon: nascerDoSolIcon,
    },
    {
      id: "09",
      time: "09:00",
      temperature: 24,
      condition: "Nublado",
      icon: cloudyIcon,
    },
    {
      id: "12",
      time: "12:00",
      temperature: 20,
      condition: "Nublado",
      icon: cloudyIcon,
    },
  ],
  dailyForecast: [
    {
      id: "today",
      day: "Hoje",
      minTemperature: 18,
      maxTemperature: 25,
      condition: "Ensolarado",
      icon: sunnyIcon,
    },
    {
      id: "sun",
      day: "Dom.",
      minTemperature: 18,
      maxTemperature: 25,
      condition: "Nublado",
      icon: cloudyIcon,
    },
    {
      id: "mon",
      day: "Seg.",
      minTemperature: 18,
      maxTemperature: 25,
      condition: "Parcialmente nublado",
      icon: partlyCloudyIcon,
    },
    {
      id: "tue",
      day: "Ter.",
      minTemperature: 18,
      maxTemperature: 25,
      condition: "Ensolarado",
      icon: sunnyIcon,
    },
    {
      id: "wed",
      day: "Qua.",
      minTemperature: 18,
      maxTemperature: 25,
      condition: "Chuva fraca",
      icon: rainIcon,
    },
    {
      id: "thu",
      day: "Qui.",
      minTemperature: 18,
      maxTemperature: 25,
      condition: "Ensolarado",
      icon: sunnyIcon,
    },
  ],
};