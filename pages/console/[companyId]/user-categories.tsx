import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import Currency from 'components/Currency';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { UserCategoryModalInterface } from 'components/Modal/UserCategoryModal';
import Percent from 'components/Percent';
import Table, { TableColumn } from 'components/Table';
import Title from 'components/Title';
import { CONFIRM_MODAL, USER_CATEGORY_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { COL_USER_CATEGORIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { UserCategoryInterface } from 'db/uiInterfaces';
import { useDeleteUserCategory } from 'hooks/mutations/useUserCategoryMutations';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

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

  const columns: TableColumn<UserCategoryInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Скидка',
      accessor: 'discountPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Кешбек',
      accessor: 'cashbackPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Оплата кешбеком',
      accessor: 'payFromCashbackPercent',
      render: ({ cellData }) => <Percent value={cellData} />,
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
        <Title>Категории клиентов</Title>
        <Table<UserCategoryInterface> testIdKey={'name'} columns={columns} data={userCategories} />
        <FixedButtons>
          <Button
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
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface UserCategoriesInterface
  extends PagePropsInterface,
    Omit<UserCategoriesConsumerInterface, 'companyId'> {}

const UserCategories: NextPage<UserCategoriesInterface> = ({
  pageUrls,
  userCategories,
  currentCompany,
}) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <UserCategoriesConsumer
        userCategories={userCategories}
        companyId={`${currentCompany?._id}`}
      />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<UserCategoriesInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  const { db } = await getDatabase();
  const userCategoriesCollection = db.collection<UserCategoryInterface>(COL_USER_CATEGORIES);
  if (!props || !props.sessionUser || !props.currentCompany) {
    return {
      notFound: true,
    };
  }

  const userCategoriesAggregationResult = await userCategoriesCollection
    .aggregate<UserCategoryInterface>([
      {
        $match: {
          companyId: new ObjectId(props.currentCompany._id),
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
      currentCompany: props.currentCompany,
      userCategories: castDbData(userCategories),
    },
  };
};

export default UserCategories;
