import { cityWeatherMock } from "../data/cityWeatherMock";
import type { CityWeather } from "../../types/cityWeather";

export function getCityWeatherList(): CityWeather[] {
  return cityWeatherMock;
}