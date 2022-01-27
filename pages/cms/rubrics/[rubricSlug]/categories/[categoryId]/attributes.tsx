import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import WpButton from '../../../../../../components/button/WpButton';
import WpCheckbox from '../../../../../../components/FormElements/Checkbox/WpCheckbox';
import Inner from '../../../../../../components/Inner';
import WpAccordion from '../../../../../../components/WpAccordion';
import WpTable, { WpTableColumn } from '../../../../../../components/WpTable';
import { getConstantTranslation } from '../../../../../../config/constantTranslations';
import { useLocaleContext } from '../../../../../../context/localeContext';
import { COL_CATEGORIES, COL_RUBRICS } from '../../../../../../db/collectionNames';
import { castCategoryForUI } from '../../../../../../db/dao/category/castCategoryForUI';
import { rubricAttributeGroupsPipeline } from '../../../../../../db/dao/constantPipelines';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributeInterface,
  CategoryInterface,
} from '../../../../../../db/uiInterfaces';
import { useToggleCmsCardAttributeInCategoryMutation } from '../../../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../../../hooks/useMutationCallbacks';
import CmsCategoryLayout from '../../../../../../layout/cms/CmsCategoryLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { getConsoleRubricLinks } from '../../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

interface CategoryAttributesConsumerInterface {
  category: CategoryInterface;
}

const CategoryAttributesConsumer: React.FC<CategoryAttributesConsumerInterface> = ({
  category,
}) => {
  const { locale } = useLocaleContext();
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [toggleCmsCardAttributeInCategoryMutation] = useToggleCmsCardAttributeInCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleCmsCardAttributeInCategory),
    onError: onErrorCallback,
  });

  const links = getConsoleRubricLinks({
    rubricSlug: `${category.rubric?.slug}`,
    categoryId: category._id,
  });

  const columns: WpTableColumn<AttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'metric',
      headTitle: 'Единица измерения',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'cmsCardAttributeIds',
      headTitle: 'Показывать в CMS карточке товара',
      render: ({ cellData, dataItem }) => {
        const checked = category.cmsCardAttributeIds.includes(dataItem._id);

        return (
          <WpCheckbox
            value={cellData}
            name={dataItem.slug}
            checked={checked}
            testId={`${dataItem.name}`}
            onChange={() => {
              showLoading();
              toggleCmsCardAttributeInCategoryMutation({
                variables: {
                  input: {
                    attributeIds: [dataItem._id],
                    attributesGroupId: dataItem.attributesGroupId,
                    categoryId: category._id,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Рубрикатор',
        href: links.parentLink,
      },
      {
        name: `${category.rubric?.name}`,
        href: links.parentLink,
      },
      {
        name: `Категории`,
        href: links.category.parentLink,
      },
      {
        name: `${category.name}`,
        href: links.category.root,
      },
    ],
  };

  return (
    <CmsCategoryLayout category={category} breadcrumbs={breadcrumbs}>
      <Inner testId={'category-attributes'}>
        {(category.rubric?.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;
          const allAttributeIds = (attributes || []).map(({ _id }) => _id);
          const selectedCmsViewInGroup = (category.cmsCardAttributeIds || []).filter((_id) => {
            return allAttributeIds.some((attributeId) => attributeId === _id);
          });
          const isDeleteAll = selectedCmsViewInGroup.length > 0;
          return (
            <div key={`${_id}`} className='mb-12'>
              <WpAccordion
                title={`${name}`}
                isOpen
                titleRight={
                  <WpButton
                    size='small'
                    theme='secondary'
                    onClick={() => {
                      showLoading();
                      toggleCmsCardAttributeInCategoryMutation({
                        variables: {
                          input: {
                            attributeIds: isDeleteAll ? [] : allAttributeIds,
                            attributesGroupId: attributesGroup._id,
                            categoryId: category._id,
                          },
                        },
                      }).catch(console.log);
                    }}
                  >
                    {`${isDeleteAll ? 'Отключить' : 'Выбрать'} все атрибуты для CMS карточки`}
                  </WpButton>
                }
              >
                <div className={`mt-4 overflow-x-auto`}>
                  <WpTable<AttributeInterface>
                    data={attributes}
                    columns={columns}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </WpAccordion>
            </div>
          );
        })}
      </Inner>
    </CmsCategoryLayout>
  );
};

interface CategoryAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    CategoryAttributesConsumerInterface {}

const CategoryAttributesPage: NextPage<CategoryAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CategoryAttributesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryAttributesPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }

  const categoriesAggregation = await categoriesCollection
    .aggregate<CategoryInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.categoryId}`),
        },
      },

      // get category rubric
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: {
            rubricId: '$rubricId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$rubricId'],
                },
              },
            },
            // get attributes groups
            ...rubricAttributeGroupsPipeline,
          ],
        },
      },
      {
        $addFields: {
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },
    ])
    .toArray();
  const initialCategory = categoriesAggregation[0];
  if (!initialCategory || !initialCategory.rubric) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const category = castCategoryForUI({
    category: initialCategory,
    locale,
  });

  return {
    props: {
      ...props,
      category: castDbData(category),
    },
  };
};

export default CategoryAttributesPage;
