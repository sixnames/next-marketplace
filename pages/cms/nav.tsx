import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import { NavItemModalInterface } from 'components/Modal/NavItemModal';
import Table, { TableColumn } from 'components/Table/Table';
import Title from 'components/Title/Title';
import { SORT_ASC, SORT_DESC } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { NAV_ITEM_MODAL } from 'config/modals';
import { COL_NAV_ITEMS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { NavGroupInterface, NavItemInterface } from 'db/uiInterfaces';
import { CreateNavItemInput, useCreateNavItemMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

const pageTitle = 'Навигация';

interface NavItemsPageConsumerInterface {
  navItemGroups: NavGroupInterface[];
}

const NavItemsPageConsumer: React.FC<NavItemsPageConsumerInterface> = ({ navItemGroups }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    reload: true,
  });

  const [createNavItemMutation] = useCreateNavItemMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.createNavItem),
  });

  const columns: TableColumn<NavItemInterface>[] = [
    {
      headTitle: 'Иконка',
      accessor: 'icon',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return <Icon className='w-6 h-6' name={cellData} />;
      },
    },
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'slug',
      accessor: 'slug',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Путь',
      accessor: 'path',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Порядковый номер',
      accessor: 'index',
      render: ({ cellData }) => cellData,
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner lowBottom>
        <Title>{pageTitle}</Title>
      </Inner>

      <Inner testId={'nav-items-page'}>
        {navItemGroups.map((navGroup) => {
          return (
            <div key={navGroup._id} className='relative mb-8'>
              <div className='mb-4 font-medium text-lg'>{navGroup.name}</div>
              <div className='overflow-x-auto overflow-y-hidden'>
                <Table<NavItemInterface> columns={columns} data={navGroup.children || []} />
              </div>
              <FixedButtons>
                <Button
                  onClick={() => {
                    showModal<NavItemModalInterface<CreateNavItemInput>>({
                      variant: NAV_ITEM_MODAL,
                      props: {
                        testId: 'create-nav-item-modal',
                        navGroup: navGroup._id,
                        confirm: (input) => {
                          showLoading();
                          createNavItemMutation({
                            variables: {
                              input,
                            },
                          }).catch(console.log);
                        },
                      },
                    });
                  }}
                  size={'small'}
                >
                  Добавить страницу
                </Button>
              </FixedButtons>
            </div>
          );
        })}
      </Inner>
    </AppContentWrapper>
  );
};

interface NavItemsPagePageInterface extends PagePropsInterface, NavItemsPageConsumerInterface {}

const NavItemsPage: NextPage<NavItemsPagePageInterface> = ({ pageUrls, navItemGroups }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <NavItemsPageConsumer navItemGroups={navItemGroups} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<NavItemsPagePageInterface>> => {
  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const db = await getDatabase();
  const navItemsCollection = db.collection<NavGroupInterface>(COL_NAV_ITEMS);

  // get grouped nav items ast
  const navItemGroupsAggregationResult = await navItemsCollection
    .aggregate([
      {
        $sort: {
          index: SORT_ASC,
        },
      },
      {
        $group: {
          _id: '$navGroup',
          children: {
            $push: {
              _id: '$_id',
              nameI18n: '$nameI18n',
              slug: '$slug',
              path: '$path',
              index: '$index',
              parentId: '$parentId',
              icon: '$icon',
            },
          },
        },
      },
      {
        $sort: {
          _id: SORT_DESC,
        },
      },
    ])
    .toArray();

  const navItemGroups = navItemGroupsAggregationResult.map((navItemsGroup) => {
    return {
      ...navItemsGroup,
      name: getConstantTranslation(`navGroups.${navItemsGroup._id}.${props.sessionLocale}`),
      children: (navItemsGroup.children || []).map((navItem) => {
        return {
          ...navItem,
          name: getFieldStringLocale(navItem.nameI18n, props.sessionLocale),
        };
      }),
    };
  });

  return {
    props: {
      ...props,
      navItemGroups: castDbData(navItemGroups),
    },
  };
};

export default NavItemsPage;
