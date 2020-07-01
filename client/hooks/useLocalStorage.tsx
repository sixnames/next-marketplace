import { useCallback, useEffect, useState } from 'react';
import { isBrowser } from '../config';
import { Theme } from '../types';

type DefaultValue = () => Theme;

const useLocalStorage = (key: string, defaultValue: DefaultValue) => {
  const [value, setValue] = useState(() => {
    if (isBrowser) {
      const storedValue = localStorage.getItem(key);
      const result = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      return storedValue === null ? result : JSON.parse(storedValue);
    }
    return defaultValue;
  });

  useEffect(() => {
    if (isBrowser) {
      const listener = (e: StorageEvent) => {
        if (e.storageArea === localStorage && e.key === key) {
          setValue(JSON.parse(`${e.newValue}`));
        }
      };
      window.addEventListener('storage', listener);

      return () => {
        window.removeEventListener('storage', listener);
      };
    }
    return;
  }, [key]);

  const setValueHandler = useCallback(
    (newValue) => {
      setValue((currentValue: any) => {
        const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
        if (localStorage) {
          localStorage.setItem(key, JSON.stringify(result));
        }
        return result;
      });
    },
    [key],
  );
  return [value, setValueHandler];
};

export default useLocalStorage;
