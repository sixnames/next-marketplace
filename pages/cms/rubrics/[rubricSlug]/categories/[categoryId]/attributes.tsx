import WpButton from 'components/button/WpButton';
import { useLocaleContext } from 'components/context/localeContext';
import WpCheckbox from 'components/FormElements/Checkbox/WpCheckbox';
import Inner from 'components/Inner';
import CmsCategoryLayout from 'components/layout/cms/CmsCategoryLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpAccordion from 'components/WpAccordion';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { castCategoryForUI } from 'db/cast/castCategoryForUI';
import { COL_RUBRICS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributeInterface,
  CategoryInterface,
} from 'db/uiInterfaces';
import { rubricAttributeGroupsPipeline } from 'db/utils/constantPipelines';
import { useToggleCmsCardAttributeInCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

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

  const links = getProjectLinks({
    rubricSlug: `${category.rubric?.slug}`,
    categoryId: category._id,
  });

  const columns: WpTableColumn<AttributeInterface>[] = [
    {
      accessor: 'name',
      headTitle: '????????????????',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variant',
      headTitle: '??????',
      render: ({ cellData }) =>
        getConstantTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'metric',
      headTitle: '?????????????? ??????????????????',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'cmsCardAttributeIds',
      headTitle: '???????????????????? ?? CMS ???????????????? ????????????',
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
    currentPageName: '????????????????',
    config: [
      {
        name: '????????????????????',
        href: links.cms.rubrics.url,
      },
      {
        name: `${category.rubric?.name}`,
        href: links.cms.rubrics.rubricSlug.url,
      },
      {
        name: `??????????????????`,
        href: links.cms.rubrics.rubricSlug.categories.url,
      },
      {
        name: `${category.name}`,
        href: links.cms.rubrics.rubricSlug.categories.categoryId.url,
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
                    {`${isDeleteAll ? '??????????????????' : '??????????????'} ?????? ???????????????? ?????? CMS ????????????????`}
                  </WpButton>
                }
              >
                <div className={`mt-4 overflow-x-auto`}>
                  <WpTable<AttributeInterface>
                    data={attributes}
                    columns={columns}
                    emptyMessage={'???????????? ?????????????????? ????????'}
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
  const collections = await getDbCollections();
  const categoriesCollection = collections.categoriesCollection();

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
