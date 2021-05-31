import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
import { CreateRubricModalInterface } from 'components/Modal/CreateRubricModal/CreateRubricModal';
import Table, { TableColumn } from 'components/Table/Table';
import Title from 'components/Title/Title';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, CREATE_RUBRIC_MODAL } from 'config/modals';
import {
  COL_PRODUCTS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface } from 'db/uiInterfaces';
import { useCreateRubricMutation, useDeleteRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppLayout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface RubricsRouteInterface {
  rubrics: RubricInterface[];
}

const RubricsRoute: React.FC<RubricsRouteInterface> = ({ rubrics }) => {
  const router = useRouter();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteRubricMutation] = useDeleteRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteRubric),
    onError: onErrorCallback,
  });

  const [createRubricMutation] = useCreateRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.createRubric),
    onError: onErrorCallback,
  });

  const columns: TableColumn<RubricInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: 'Всего товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-productsCount`}>{cellData}</div>;
      },
    },
    {
      accessor: 'activeProductsCount',
      headTitle: 'Активных товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-activeProductsCount`}>{cellData}</div>;
      },
    },
    {
      accessor: 'variant.name',
      headTitle: 'Тип',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router
                .push(`${ROUTE_CMS}/rubrics/${dataItem._id}/products/${dataItem._id}`)
                .catch((e) => console.log(e));
            }}
            deleteTitle={'Удалить рубрику'}
            deleteHandler={() => {
              showModal({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-rubric-modal',
                  message: 'Рубрика будет удалена',
                  confirm: () => {
                    showLoading();
                    return deleteRubricMutation({
                      variables: {
                        _id: dataItem._id,
                      },
                    });
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper>
      <Head>
        <title>{`Рубрикатор`}</title>
      </Head>
      <Inner>
        <Title>Рубрикатор</Title>

        <div className='overflow-x-auto'>
          <Table<RubricInterface>
            columns={columns}
            data={rubrics}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
            onRowDoubleClick={(rubric) => {
              router
                .push(`${ROUTE_CMS}/rubrics/${rubric._id}/products/${rubric._id}`)
                .catch((e) => console.log(e));
            }}
          />
        </div>

        <FixedButtons>
          <Button
            testId={'create-rubric'}
            size={'small'}
            className={'mt-6 sm:mt-0'}
            onClick={() => {
              showModal<CreateRubricModalInterface>({
                variant: CREATE_RUBRIC_MODAL,
                props: {
                  confirm: (values) => {
                    showLoading();
                    return createRubricMutation({ variables: { input: values } });
                  },
                },
              });
            }}
          >
            Создать рубрику
          </Button>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface RubricsInterface extends PagePropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ pageUrls, rubrics }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricsRoute rubrics={rubrics} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricsInterface>> => {
  const db = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $project: {
          attributes: false,
          catalogueTitle: false,
          descriptionI18n: false,
          shortDescriptionI18n: false,
          priorities: false,
          views: false,
          attributesGroupsIds: false,
        },
      },
      {
        $lookup: {
          from: COL_RUBRIC_VARIANTS,
          as: 'variants',
          localField: 'variantId',
          foreignField: '_id',
        },
      },
      {
        $addFields: {
          variant: { $arrayElemAt: ['$variants', 0] },
        },
      },
      {
        $lookup: {
          from: COL_SHOP_PRODUCTS,
          as: 'shopProducts',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
            {
              $group: {
                _id: '$productId',
              },
            },
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalShopProductsObject: { $arrayElemAt: ['$shopProducts', 0] },
        },
      },
      {
        $addFields: {
          activeProductsCount: '$totalShopProductsObject.totalDocs',
        },
      },
      {
        $project: {
          variants: false,
          shopProducts: false,
          totalShopProductsObject: false,
        },
      },
      {
        $lookup: {
          from: COL_PRODUCTS,
          as: 'products',
          let: { rubricId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$rubricId'],
                },
              },
            },
            {
              $project: {
                _id: true,
              },
            },
            {
              $count: 'totalDocs',
            },
          ],
        },
      },
      {
        $addFields: {
          totalProductsObject: { $arrayElemAt: ['$products', 0] },
        },
      },
      {
        $addFields: {
          productsCount: '$totalProductsObject.totalDocs',
        },
      },
      {
        $project: {
          products: false,
          totalProductsObject: false,
        },
      },
    ])
    .toArray();

  const { sessionLocale } = props;
  const rawRubrics = initialRubrics.map(({ nameI18n, ...rubric }) => {
    return {
      ...rubric,
      name: getFieldStringLocale(nameI18n, sessionLocale),
      variant: rubric.variant
        ? {
            ...rubric.variant,
            name: getFieldStringLocale(rubric.variant.nameI18n, sessionLocale),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      rubrics: castDbData(rawRubrics),
    },
  };
};

export default Rubrics;
