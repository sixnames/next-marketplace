import { useAppContext } from 'context/appContext';

const useSessionCity = (): string => {
  const { sessionCity } = useAppContext();

  return sessionCity;
};

export default useSessionCity;
