import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../components/Inner';
import WpTitle from '../../components/WpTitle';
import { ROUTE_SIGN_IN } from '../../config/common';
import { getConsoleCompanyLinks } from '../../lib/linkUtils';
import { noNaN } from '../../lib/numbers';
import { getConsoleMainPageData, GetConsoleMainPageDataPropsInterface } from '../../lib/ssrUtils';

const App: NextPage<GetConsoleMainPageDataPropsInterface> = ({ layoutProps }) => {
  const router = useRouter();

  return (
    <Inner>
      <WpTitle>Панель управления</WpTitle>
      <div className='mb-8 text-lg'>Ваши компании</div>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {(layoutProps.sessionUser.me.companies || []).map((company) => {
          const links = getConsoleCompanyLinks({
            companyId: company._id,
          });
          return (
            <div
              className='grid cursor-pointer grid-cols-4 gap-4 rounded-lg bg-secondary px-4 py-6 shadow-lg'
              key={`${company._id}`}
              onClick={() => {
                router.push(links.root).catch((e) => console.log(e));
              }}
            >
              <div className='col-span-1 overflow-hidden rounded-full'>
                <img
                  className='h-full w-full object-contain'
                  src={company.logo}
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
): Promise<GetServerSidePropsResult<GetConsoleMainPageDataPropsInterface>> => {
  const { props } = await getConsoleMainPageData({ context });
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
    const links = getConsoleCompanyLinks({
      companyId: company._id,
    });
    return {
      redirect: {
        destination: links.root,
        permanent: false,
      },
    };
  }

  return {
    props,
  };
};

export default App;
