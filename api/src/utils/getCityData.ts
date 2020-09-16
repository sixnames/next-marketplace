import { DEFAULT_CITY } from '../config';

interface CityInterface<T> {
  key: string;
  node?: T;
  [key: string]: any;
}

function getCityData<T>(cities: CityInterface<T>[] | CityInterface<T>, chosenCity: string) {
  if (Array.isArray(cities)) {
    const currentCity = cities.find(({ key }) => key === chosenCity);
    if (!currentCity) {
      return cities.find(({ key }) => key === DEFAULT_CITY);
    }
    return currentCity;
  }
  return cities;
}

export default getCityData;
