import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import Currency from 'components/Currency';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { UserCategoryModalInterface } from 'components/Modal/UserCategoryModal';
import Percent from 'components/Percent';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import { UserCategoryInterface } from 'db/uiInterfaces';
import { useDeleteUserCategory } from 'hooks/mutations/useUserCategoryMutations';
import { CONFIRM_MODAL, USER_CATEGORY_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface UserCategoriesConsumerInterface {
  userCategories: UserCategoryInterface[];
  companyId: string;
}

const UserCategoriesConsumer: NextPage<UserCategoriesConsumerInterface> = ({
  userCategories,
  companyId,
}) => {
  const { showModal } = useAppContext();
  const [deleteUserCategory] = useDeleteUserCategory();

  const columns: WpTableColumn<UserCategoryInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Скидка',
      accessor: 'discountPercent',
      render: ({ cellData }) => <Percent showNegativeValue value={cellData} />,
    },
    {
      headTitle: 'Кэшбэк',
      accessor: 'cashbackPercent',
      render: ({ cellData }) => <Percent showNegativeValue value={cellData} />,
    },
    {
      headTitle: 'Оплата кэшбэком',
      accessor: 'payFromCashbackPercent',
      render: ({ cellData }) => <Percent showNegativeValue value={cellData} />,
    },
    {
      headTitle: 'Порог вхождения',
      accessor: 'entryMinCharge',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать категорию клиента'}
              updateHandler={() => {
                showModal<UserCategoryModalInterface>({
                  variant: USER_CATEGORY_MODAL,
                  props: {
                    companyId,
                    userCategory: dataItem,
                  },
                });
              }}
              deleteTitle={'Удалить категорию клиента'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-user-category-modal',
                    message: `Вы уверенны, что хотите удалить категорию клиента ${dataItem.name}?`,
                    confirm: () => {
                      deleteUserCategory({
                        _id: `${dataItem._id}`,
                        companyId,
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
      <Inner testId={'user-categories-list'}>
        <WpTitle>Категории клиентов</WpTitle>
        <WpTable<UserCategoryInterface>
          testIdKey={'name'}
          columns={columns}
          data={userCategories}
        />
        <FixedButtons>
          <WpButton
            testId={'create-user-category'}
            size={'small'}
            onClick={() => {
              showModal<UserCategoryModalInterface>({
                variant: USER_CATEGORY_MODAL,
                props: {
                  companyId,
                },
              });
            }}
          >
            Создать категорию клиента
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface UserCategoriesInterface
  extends GetConsoleInitialDataPropsInterface,
    UserCategoriesConsumerInterface {}

const UserCategories: NextPage<UserCategoriesInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <UserCategoriesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserCategoriesInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  const collections = await getDbCollections();
  const userCategoriesCollection = collections.userCategoriesCollection();
  if (!props) {
    return {
      notFound: true,
    };
  }

  const userCategoriesAggregationResult = await userCategoriesCollection
    .aggregate<UserCategoryInterface>([
      {
        $match: {
          companyId: new ObjectId(props.layoutProps.pageCompany._id),
        },
      },
    ])
    .toArray();

  const locale = props.sessionLocale;
  const userCategories = userCategoriesAggregationResult.map((userCategory) => {
    return {
      ...userCategory,
      name: getFieldStringLocale(userCategory.nameI18n, locale),
    };
  });

  return {
    props: {
      ...props,
      userCategories: castDbData(userCategories),
      companyId: `${props.layoutProps.pageCompany._id}`,
    },
  };
};

export default UserCategories;
