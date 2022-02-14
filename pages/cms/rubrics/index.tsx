import { useAppContext } from 'context/appContext';
import { useDeleteRubric } from 'hooks/mutations/useRubricMutations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { RubricMainFieldsInterface } from 'components/FormTemplates/RubricMainFields';
import Inner from 'components/Inner';
import { CreateRubricModalInterface } from 'components/Modal/CreateRubricModal';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { DEFAULT_COMPANY_SLUG } from 'config/common';
import { CONFIRM_MODAL, CREATE_RUBRIC_MODAL } from 'config/modalVariants';
import {
  COL_PRODUCT_FACETS,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricInterface, RubricVariantInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleRubricLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface RubricsRouteInterface extends RubricMainFieldsInterface {
  rubrics: RubricInterface[];
}

const RubricsRoute: React.FC<RubricsRouteInterface> = ({ rubrics, rubricVariants }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteRubricMutation] = useDeleteRubric();

  const columns: WpTableColumn<RubricInterface>[] = [
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
              const links = getConsoleRubricLinks({
                rubricSlug: dataItem.slug,
              });
              router.push(links.product.parentLink).catch(console.log);
            }}
            deleteTitle={'Удалить рубрику'}
            deleteHandler={() => {
              showModal({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-rubric-modal',
                  message: 'Рубрика будет удалена',
                  confirm: () => {
                    return deleteRubricMutation({
                      _id: `${dataItem._id}`,
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
        <WpTitle>Рубрикатор</WpTitle>

        <div className='overflow-x-auto'>
          <WpTable<RubricInterface>
            columns={columns}
            data={rubrics}
            testIdKey={'name'}
            emptyMessage={'Список пуст'}
            onRowDoubleClick={(rubric) => {
              const links = getConsoleRubricLinks({
                rubricSlug: rubric.slug,
              });
              router.push(links.product.parentLink).catch(console.log);
            }}
          />
        </div>

        <FixedButtons>
          <WpButton
            testId={'create-rubric'}
            size={'small'}
            className={'mt-6 sm:mt-0'}
            onClick={() => {
              showModal<CreateRubricModalInterface>({
                variant: CREATE_RUBRIC_MODAL,
                props: {
                  rubricVariants,
                },
              });
            }}
          >
            Создать рубрику
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface RubricsInterface extends GetAppInitialDataPropsInterface, RubricsRouteInterface {}

const Rubrics: NextPage<RubricsInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricsRoute {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricsInterface>> => {
  const { db } = await getDatabase();
  const rubricVariantsCollection = db.collection<RubricVariantInterface>(COL_RUBRIC_VARIANTS);
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
          from: COL_PRODUCT_FACETS,
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

  const initialRubricVariants = await rubricVariantsCollection.find({}).toArray();
  const castedRubricVariants = initialRubricVariants.map((document) => {
    return {
      ...document,
      name: getFieldStringLocale(document.nameI18n, sessionLocale),
    };
  });
  const sortedRubricVariants = sortObjectsByField(castedRubricVariants);

  return {
    props: {
      ...props,
      rubrics: castDbData(rawRubrics),
      rubricVariants: castDbData(sortedRubricVariants),
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default Rubrics;
