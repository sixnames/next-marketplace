interface CityInterface<T> {
  key: string;
  node: T;
  [key: string]: any;
}

function getCityData<T>(cities: CityInterface<T>[], chosenCity: string) {
  return cities.find(({ key }) => key === chosenCity);
}

export default getCityData;
