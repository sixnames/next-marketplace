interface CityInterface<T> {
  key: string;
  node: T;
  [key: string]: any;
}

function getCityData<T>(cities: CityInterface<T>[] | CityInterface<T>, chosenCity: string) {
  if (Array.isArray(cities)) {
    return cities.find(({ key }) => key === chosenCity)!;
  }
  return cities;
}

export default getCityData;
