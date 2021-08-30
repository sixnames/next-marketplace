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

type UseFetchHandler<T> = (init?: RequestInit) => Promise<T | null>;

export interface UseFetchDataPayloadInterface<T> {
  loading: boolean;
  error: any;
  data: T | null;
}

export type UseFetchPayload<T> = [
  handler: UseFetchHandler<T>,
  payload: UseFetchDataPayloadInterface<T>,
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
    async (init) => {
      let payload: any | null = null;

      try {
        if (onFetchStart) {
          onFetchStart();
        }

        setLoading(true);
        const fetchResult = await fetch(input, init);
        const json = await fetchResult.json();
        setData(json);
        payload = json;
        setLoading(false);
        if (json.success) {
          onSuccess(json);

          if (reload) {
            router.reload();
          }

          return payload;
        }
        onError(json);
      } catch (e) {
        setLoading(false);
        setError(e);
        return payload;
      }
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
  handler: (args: TArgs) => Promise<TPayload | null>,
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
