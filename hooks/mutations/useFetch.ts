import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { PayloadModel } from 'db/dbModels';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface UseFetchInterface<T> {
  input: RequestInfo;
  onSuccess: (payload: T) => void;
  onError: (payload?: T) => void;
  onFetchStart?: () => void;
  reload?: boolean;
}

export type UseFetchPayload<T> = [
  handler: (init?: RequestInit) => void,
  payload: {
    loading: boolean;
    error: any;
    data: T | null;
  },
];

export function useFetch<T>({
  input,
  onError,
  onSuccess,
  onFetchStart,
  reload,
}: UseFetchInterface<T>): UseFetchPayload<T> {
  const router = useRouter();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>(null);

  const handler = React.useCallback(
    (init) => {
      if (onFetchStart) {
        onFetchStart();
      }

      setLoading(true);
      fetch(input, init)
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setLoading(false);
          if (json.success) {
            onSuccess(json);

            if (reload) {
              router.reload();
            }

            return;
          }
          onError(json);
        })
        .catch((e) => {
          setLoading(false);
          setError(e);
          onError();
        });
    },
    [input, onError, onFetchStart, onSuccess, reload, router],
  );

  return [
    handler,
    {
      loading,
      error,
      data,
    },
  ];
}

export interface UseMutationInterface<T> {
  input: RequestInfo;
  onSuccess?: (payload: T) => void;
  onError?: (payload?: T) => void;
  reload?: boolean;
}

export type UseMutationConsumerPayload<TPayload, TArgs> = [
  handler: (args: TArgs) => void,
  payload: {
    loading: boolean;
    error: any;
    data: TPayload | null;
  },
];

export function useMutation<T extends PayloadModel>({
  input,
  onError,
  onSuccess,
  reload,
}: UseMutationInterface<T>): UseFetchPayload<T> {
  const { showErrorNotification, showSuccessNotification } = useNotificationsContext();
  const { showLoading, hideLoading } = useAppContext();
  const [handler, { data, error, loading }] = useFetch<T>({
    input,
    reload,
    onFetchStart: showLoading,
    onError: (payload) => {
      hideLoading();
      showErrorNotification({
        title: payload?.message,
      });
      if (onError) {
        onError(payload);
      }
    },
    onSuccess: (payload) => {
      hideLoading();
      showSuccessNotification({
        title: payload.message,
      });
      if (onSuccess) {
        onSuccess(payload);
      }
    },
  });

  return [
    handler,
    {
      data,
      error,
      loading,
    },
  ];
}
