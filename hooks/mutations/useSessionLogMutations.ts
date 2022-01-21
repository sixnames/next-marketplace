import { useRouter } from 'next/router';
import * as React from 'react';
import { REQUEST_METHOD_POST } from '../../config/common';
import { useAppContext } from '../../context/appContext';
import {
  SessionLogAddToCartEventInputModel,
  SessionNavLogEventInputModel,
  SessionLogMakeAnOrderEventInputModel,
  SetSessionLogInputInterface,
} from '../../db/dao/sessionLogs/setSessionLog';
import { SessionLogPayloadModel } from '../../db/dbModels';

const basePath = '/api/logs';

interface UseSetSessionLogInputInterface {
  event:
    | SessionNavLogEventInputModel
    | SessionLogAddToCartEventInputModel
    | SessionLogMakeAnOrderEventInputModel;
}

// set log
const useSetSessionLog = () => {
  const { ipInfo } = useAppContext();

  const handler = React.useCallback(
    ({ event }: UseSetSessionLogInputInterface) => {
      if (ipInfo) {
        const input: SetSessionLogInputInterface = {
          ipInfo,
          event,
        };
        fetch(`${basePath}`, {
          method: REQUEST_METHOD_POST,
          body: JSON.stringify(input),
        })
          .then<SessionLogPayloadModel>((response) => response.json())
          /*.then((logPayload) => {
            console.log('logPayload', logPayload);
          })*/
          .catch(console.log);
      }
    },
    [ipInfo],
  );

  return handler;
};

// set nav log
export const useSetSessionNavLog = () => {
  const router = useRouter();
  const handler = useSetSessionLog();
  const { ipInfo } = useAppContext();

  // visit
  React.useEffect(() => {
    if (ipInfo) {
      handler({
        event: {
          asPath: router.asPath,
          variant: 'visit',
        },
      });
    }
  }, [handler, ipInfo, router.asPath]);

  // leave
  React.useEffect(() => {
    const handleRouteStart = () => {
      handler({
        event: {
          asPath: router.asPath,
          variant: 'leave',
        },
      });
    };
    router.events.on('routeChangeStart', handleRouteStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
    };
  }, [router.events, router.asPath, handler]);
};
