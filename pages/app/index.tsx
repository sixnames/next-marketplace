import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_APP } from 'config/common';
import { useUserContext } from 'context/userContext';
import AppLayout from 'layout/AppLayout/AppLayout';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const AppConsumer: React.FC = () => {
  const router = useRouter();
  const { me } = useUserContext();

  return (
    <Inner>
      <Title>Панель управления</Title>
      <div className='mb-8 text-lg'>Выберите компанию</div>
      <div>
        {(me?.companies || []).map((company) => {
          return (
            <div
              key={`${company._id}`}
              onClick={() => {
                router.push(`${ROUTE_APP}/${company._id}/shops`).catch((e) => console.log(e));
              }}
            >
              <div>
                <img src={company.logo.url} width='100' height='100' alt='' />
              </div>
              <div>{company.name}</div>
            </div>
          );
        })}
      </div>
    </Inner>
  );
};

const App: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <AppLayout title={'Панель управления'} pageUrls={pageUrls}>
      <AppConsumer />
    </AppLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context });
};

export default App;
