import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import { useGetRubricBySlugQuery } from 'generated/apolloComponents';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getAppInitialData } from 'lib/ssrUtils';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import RubricAttributes from 'routes/Rubrics/RubricAttributes';

const RubricAttributesPage: NextPage = () => {
  const { query } = useRouter();
  const { data, loading, error } = useGetRubricBySlugQuery({
    variables: {
      slug: `${query.rubricSlug}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getRubricBySlug) {
    return <RequestError />;
  }

  return (
    <AppLayout>
      <DataLayout
        title={data.getRubricBySlug.name}
        filterResult={() => {
          return (
            <DataLayoutContentFrame>
              <RubricAttributes rubric={data.getRubricBySlug} />
            </DataLayoutContentFrame>
          );
        }}
      />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default RubricAttributesPage;
