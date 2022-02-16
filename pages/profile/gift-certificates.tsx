import { getProjectLinks } from 'lib/links/getProjectLinks';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { useSiteUserContext } from '../../components/context/siteUserContext';
import Currency from '../../components/Currency';
import ProfileLayout from '../../components/layout/ProfileLayout/ProfileLayout';
import SiteLayout, { SiteLayoutProviderInterface } from '../../components/layout/SiteLayout';
import RequestError from '../../components/RequestError';
import WpTable, { WpTableColumn } from '../../components/WpTable';
import WpTitle from '../../components/WpTitle';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import { getDbCollections } from '../../db/mongodb';
import { GiftCertificateInterface } from '../../db/uiInterfaces';
import { getFieldStringLocale, getNumWord } from '../../lib/i18n';
import { castDbData, getSiteInitialData } from '../../lib/ssrUtils';

const links = getProjectLinks();

interface ProfileGiftCertificatesPageConsumerInterface {
  giftCertificates: GiftCertificateInterface[];
}

const ProfileGiftCertificatesPageConsumer: React.FC<
  ProfileGiftCertificatesPageConsumerInterface
> = ({ giftCertificates }) => {
  const sessionUser = useSiteUserContext();

  const counterString = React.useMemo(() => {
    if (giftCertificates.length < 1) {
      return '';
    }

    const counterPostfix = getNumWord(giftCertificates.length, [
      'сертификат',
      'сертификата',
      'сертификатов',
    ]);
    const counterPrefix = getNumWord(giftCertificates.length, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${giftCertificates.length} ${counterPostfix}`;
  }, [giftCertificates.length]);

  const columns: WpTableColumn<GiftCertificateInterface>[] = [
    {
      accessor: 'code',
      headTitle: 'Код',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'initialValue',
      headTitle: 'Сумма',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      accessor: 'value',
      headTitle: 'Остаток',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
  ];

  if (!sessionUser?.me) {
    return <RequestError message={'Пользователь не найден'} />;
  }

  return (
    <ProfileLayout>
      <WpTitle size={'small'}>Подарочные сертификаты</WpTitle>
      <div data-cy={'profile-gift-certificates'}>
        {giftCertificates.length > 0 ? (
          <div className={`mb-2 text-xl font-medium`}>{counterString}</div>
        ) : null}
        <WpTable<GiftCertificateInterface>
          columns={columns}
          data={giftCertificates}
          testIdKey={'_id'}
        />
      </div>
    </ProfileLayout>
  );
};

interface ProfileGiftCertificatesPageInterface
  extends SiteLayoutProviderInterface,
    ProfileGiftCertificatesPageConsumerInterface {}

const ProfileGiftCertificatesPage: NextPage<ProfileGiftCertificatesPageInterface> = ({
  giftCertificates,
  ...props
}) => {
  return (
    <SiteLayout title={'Профиль'} {...props}>
      <ProfileGiftCertificatesPageConsumer giftCertificates={giftCertificates} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileGiftCertificatesPageInterface>> {
  const collections = await getDbCollections();
  const giftCertificatesCollection = collections.giftCertificatesCollection();
  const { props } = await getSiteInitialData({
    context,
  });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });

  if (!sessionUser || !sessionUser.me) {
    return {
      redirect: {
        permanent: false,
        destination: links.signIn.url,
      },
    };
  }

  const initialGiftCertificates = await giftCertificatesCollection
    .find({
      userId: new ObjectId(sessionUser.me._id),
    })
    .toArray();

  const giftCertificates = initialGiftCertificates.map((certificate) => {
    return {
      ...certificate,
      name: getFieldStringLocale(certificate.nameI18n, props.sessionLocale),
    };
  });

  return {
    props: {
      ...props,
      giftCertificates: castDbData(giftCertificates),
      showForIndex: false,
    },
  };
}

export default ProfileGiftCertificatesPage;
