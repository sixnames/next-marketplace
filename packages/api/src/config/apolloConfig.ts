import { IN_PROD } from './appConfig';

export const APOLLO_OPTIONS = {
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include',
        },
      },
};
