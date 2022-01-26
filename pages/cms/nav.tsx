import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from '../../components/button/ContentItemControls';
import FixedButtons from '../../components/button/FixedButtons';
import WpButton from '../../components/button/WpButton';
import Inner from '../../components/Inner';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal';
import { NavItemModalInterface } from '../../components/Modal/NavItemModal';
import WpIcon from '../../components/WpIcon';
import WpTable, { WpTableColumn } from '../../components/WpTable';
import WpTitle from '../../components/WpTitle';
import { SORT_ASC, SORT_DESC } from '../../config/common';
import { getConstantTranslation } from '../../config/constantTranslations';
import { CONFIRM_MODAL, NAV_ITEM_MODAL } from '../../config/modalVariants';
import { COL_NAV_ITEMS } from '../../db/collectionNames';
import { getDatabase } from '../../db/mongodb';
import { NavGroupInterface, NavItemInterface } from '../../db/uiInterfaces';
import {
  CreateNavItemInput,
  UpdateNavItemInput,
  useCreateNavItemMutation,
  useDeleteNavItemMutation,
  useUpdateNavItemMutation,
} from '../../generated/apolloComponents';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import AppContentWrapper from '../../layout/AppContentWrapper';
import ConsoleLayout from '../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from '../../lib/ssrUtils';

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

  const [updateNavItemMutation] = useUpdateNavItemMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateNavItem),
  });

  const [deleteNavItemMutation] = useDeleteNavItemMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteNavItem),
  });

  const columns: WpTableColumn<NavItemInterface>[] = [
    {
      headTitle: 'Иконка',
      accessor: 'icon',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return <WpIcon className='h-6 w-6' name={cellData} />;
      },
    },
    {
      headTitle: 'Название',
      render: ({ dataItem }) => {
        return <div data-cy={`${dataItem.navGroup}-${dataItem.name}`}>{dataItem.name}</div>;
      },
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
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.navGroup}-${dataItem.name}`}
              deleteTitle={'Удфлить страницу'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-nav-item-modal',
                    message: `Вы уверенны, что хотите удалить страницу ${dataItem.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteNavItemMutation({
                        variables: {
                          _id: dataItem._id,
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
              updateTitle={'Обновить страницу'}
              updateHandler={() => {
                showModal<NavItemModalInterface<UpdateNavItemInput>>({
                  variant: NAV_ITEM_MODAL,
                  props: {
                    testId: 'update-nav-item-modal',
                    navGroup: dataItem.navGroup,
                    navItem: dataItem,
                    confirm: (values) => {
                      showLoading();
                      updateNavItemMutation({
                        variables: {
                          input: {
                            ...values,
                            _id: dataItem._id,
                          },
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{pageTitle}</WpTitle>
      </Inner>

      <Inner testId={'nav-items-page'}>
        {navItemGroups.map((navGroup) => {
          return (
            <div key={navGroup._id} className='relative mb-8'>
              <div className='mb-4 text-lg font-medium'>{navGroup.name}</div>
              <div className='overflow-x-auto overflow-y-hidden'>
                <WpTable<NavItemInterface> columns={columns} data={navGroup.children || []} />
              </div>
              <FixedButtons>
                <WpButton
                  testId={`${navGroup._id}-create-nav-item`}
                  size={'small'}
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
                >
                  Добавить страницу
                </WpButton>
              </FixedButtons>
            </div>
          );
        })}
      </Inner>
    </AppContentWrapper>
  );
};

interface NavItemsPagePageInterface
  extends GetAppInitialDataPropsInterface,
    NavItemsPageConsumerInterface {}

const NavItemsPage: NextPage<NavItemsPagePageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <NavItemsPageConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<NavItemsPagePageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const navItemsCollection = db.collection<NavGroupInterface>(COL_NAV_ITEMS);

  // get grouped nav items ast
  const navItemGroupsAggregationResult = await navItemsCollection
    .aggregate<NavItemInterface>([
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
              navGroup: '$navGroup',
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
