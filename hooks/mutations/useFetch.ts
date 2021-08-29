import * as React from 'react';

export interface UseFetchInterface {
  input: RequestInfo;
  init?: RequestInit;
  onSuccess: () => void;
  onError: () => void;
}

export interface UseFetchPayloadInterface<T> {
  loading: boolean;
  error: any;
  data: T | null;
  fetchHandler: () => void;
}

export function useFetch<T>({
  input,
  init,
  onError,
  onSuccess,
}: UseFetchInterface): UseFetchPayloadInterface<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>(null);

  const fetchHandler = React.useCallback(() => {
    setLoading(true);
    fetch(input, init)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
        if (json.success) {
          onSuccess();
          return;
        }
        onError();
      })
      .catch((e) => {
        setLoading(false);
        setError(e);
        onError();
      });
  }, [init, input, onError, onSuccess]);

  return {
    loading,
    error,
    data,
    fetchHandler,
  };
}
