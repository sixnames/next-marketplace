import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CONSOLE, ROUTE_SIGN_IN } from 'config/common';
import { noNaN } from 'lib/numbers';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getConsoleInitialData, GetConsoleInitialDataPropsInterface } from 'lib/ssrUtils';

const App: NextPage<GetConsoleInitialDataPropsInterface> = ({ layoutProps }) => {
  const router = useRouter();

  return (
    <Inner>
      <Title>Панель управления</Title>
      <div className='mb-8 text-lg'>Ваши компании</div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {(layoutProps.sessionUser.me.companies || []).map((company) => {
          return (
            <div
              className='bg-secondary rounded-lg shadow-lg grid grid-cols-4 gap-4 px-4 py-6 cursor-pointer'
              key={`${company._id}`}
              onClick={() => {
                router.push(`${ROUTE_CONSOLE}/${company?._id}`).catch((e) => console.log(e));
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
  const { props } = await getConsoleInitialData({ context });
  if (!props?.layoutProps.sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  if (
    !props?.layoutProps.sessionUser?.me.role ||
    noNaN(props?.layoutProps.sessionUser?.me.companies?.length) < 1
  ) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }

  if (
    props.layoutProps.sessionUser?.me.companies &&
    noNaN(props.layoutProps.sessionUser.me.companies.length) === 1
  ) {
    const company = props?.layoutProps.sessionUser?.me.companies[0];
    return {
      redirect: {
        destination: `${ROUTE_CONSOLE}/${company?._id}`,
        permanent: false,
      },
    };
  }

  return {
    props,
  };
};

export default App;
