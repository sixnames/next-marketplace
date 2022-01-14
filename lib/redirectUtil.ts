import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export const redirectUtil = (context: GetServerSidePropsContext): GetServerSidePropsResult<any> => {
  const { resolvedUrl } = context;
  const resolvedUrlArray = resolvedUrl.split('/');
  const companySlug = resolvedUrlArray[1];
  const citySlug = resolvedUrlArray[2];

  return {
    redirect: {
      destination: resolvedUrl.replace(`/${companySlug}/${citySlug}`, ''),
      permanent: true,
    },
  };
};
