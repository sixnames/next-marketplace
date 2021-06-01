import Inner from 'components/Inner/Inner';
import Title from 'components/Title/Title';
import { ROUTE_CONSOLE, ROUTE_SIGN_IN } from 'config/common';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getCompanyAppInitialData } from 'lib/ssrUtils';

const App: NextPage<PagePropsInterface> = ({ sessionUser }) => {
  const router = useRouter();

  return (
    <Inner>
      <Title>Панель управления</Title>
      <div className='mb-8 text-lg'>Ваши компании</div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {(sessionUser?.companies || []).map((company) => {
          return (
            <div
              className='bg-secondary rounded-lg shadow-lg grid grid-cols-4 gap-4 px-4 py-6'
              key={`${company._id}`}
              onClick={() => {
                router.push(`${ROUTE_CONSOLE}/shops/${company._id}`).catch((e) => console.log(e));
              }}
            >
              <div className='rounded-full overflow-hidden col-span-1'>
                <img
                  className='w-full h-full object-contain'
                  src={company.logo.url}
                  width='100'
                  height='100'
                  alt=''
                />
              </div>
              <div className='col-span-3'>
                <div className='text-xl'>{company.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Inner>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> => {
  const { props } = await getCompanyAppInitialData({ context });

  if (!props?.sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (!props?.sessionUser?.role || noNaN(props?.sessionUser?.companies?.length) < 1) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (props?.sessionUser?.companies && noNaN(props.sessionUser.companies.length) === 1) {
    const company = props?.sessionUser?.companies[0];
    return {
      redirect: {
        destination: `${ROUTE_CONSOLE}/shops/${company?._id}`,
        permanent: false,
      },
    };
  }

  return {
    props,
  };
};

export default App;
