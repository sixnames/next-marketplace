import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Currency from '../../components/Currency';
import RequestError from '../../components/RequestError';
import WpTable, { WpTableColumn } from '../../components/WpTable';
import WpTitle from '../../components/WpTitle';
import { ROUTE_SIGN_IN } from '../../config/common';
import { useSiteUserContext } from '../../context/siteUserContext';
import { COL_GIFT_CERTIFICATES } from '../../db/collectionNames';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import { getDatabase } from '../../db/mongodb';
import { GiftCertificateInterface } from '../../db/uiInterfaces';
import ProfileLayout from '../../layout/ProfileLayout/ProfileLayout';
import SiteLayout, { SiteLayoutProviderInterface } from '../../layout/SiteLayout';
import { getFieldStringLocale, getNumWord } from '../../lib/i18n';
import { castDbData, getSiteInitialData } from '../../lib/ssrUtils';

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
  const { db } = await getDatabase();
  const giftCertificatesCollection = db.collection<GiftCertificateInterface>(COL_GIFT_CERTIFICATES);
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
        destination: ROUTE_SIGN_IN,
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
