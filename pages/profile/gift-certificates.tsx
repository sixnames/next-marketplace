import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import RequestError from '../../components/RequestError';
import WpTitle from '../../components/WpTitle';
import { ROUTE_SIGN_IN } from '../../config/common';
import { useSiteUserContext } from '../../context/siteUserContext';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import ProfileLayout from '../../layout/ProfileLayout/ProfileLayout';
import SiteLayout, { SiteLayoutProviderInterface } from '../../layout/SiteLayout';
import { getSiteInitialData } from '../../lib/ssrUtils';

const ProfileDetailsRoute: React.FC = () => {
  const sessionUser = useSiteUserContext();

  if (!sessionUser?.me) {
    return <RequestError message={'Пользователь не найден'} />;
  }

  return <div data-cy={'profile-gift-certificates'}>profile-gift-certificates</div>;
};

type ProfileGiftCertificatesPageInterface = SiteLayoutProviderInterface;

const ProfileDetails: NextPage<ProfileGiftCertificatesPageInterface> = (props) => {
  return (
    <SiteLayout title={'Профиль'} {...props}>
      <ProfileLayout>
        <WpTitle size={'small'}>Подарочные сертификаты</WpTitle>
        <ProfileDetailsRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileGiftCertificatesPageInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });

  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  return {
    props: {
      ...props,
      showForIndex: false,
    },
  };
}

export default ProfileDetails;
