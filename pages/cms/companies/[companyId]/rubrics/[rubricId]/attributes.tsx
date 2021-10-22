import CheckBox from 'components/FormElements/Checkbox/Checkbox';
import Accordion from 'components/Accordion';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'config/modalVariants';
import { useLocaleContext } from 'context/localeContext';
import { COL_CATEGORIES, COL_RUBRICS } from 'db/collectionNames';
import { rubricAttributeGroupsPipeline } from 'db/dao/constantPipelines';
import { RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { AttributeInterface, CategoryInterface, RubricInterface } from 'db/uiInterfaces';
import {
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useUpdateAttributeInRubricMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { castRubricForUI } from 'lib/uiDataUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricAttributesConsumerInterface {
  rubric: RubricInterface;
}

const RubricAttributesConsumer: React.FC<RubricAttributesConsumerInterface> = ({ rubric }) => {
  const { locale } = useLocaleContext();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroupFromRubric),
    onError: onErrorCallback,
  });

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributesGroupToRubric),
    onError: onErrorCallback,
  });

  const [updateAttributeInRubricMutation] = useUpdateAttributeInRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInRubric),
    onError: onErrorCallback,
  });

  const columns = (category?: CategoryInterface): TableColumn<AttributeInterface>[] => [
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
      headTitle: 'Показывать в фильтре рубрики',
      render: ({ dataItem }) => {
        const checked = rubric.filterVisibleAttributeIds.includes(dataItem._id);
        return (
          <CheckBox
            value={dataItem.slug}
            name={dataItem.slug}
            checked={checked}
            onChange={() => {
              updateAttributeInRubricMutation({
                variables: {
                  input: {
                    attributeId: dataItem._id,
                    rubricId: rubric._id,
                  },
                },
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      headTitle: 'Категория',
      render: () => {
        if (category) {
          return (
            <Link
              href={`${ROUTE_CMS}/rubrics/${rubric?._id}/categories/${category._id}/attributes`}
            >
              {category.name}
            </Link>
          );
        }
        return null;
      },
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-attributes'}>
        {(rubric.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;
          return (
            <div key={`${_id}`} className='mb-12'>
              <Accordion
                title={`${name}`}
                titleRight={
                  <ContentItemControls
                    testId={`${attributesGroup.name}`}
                    justifyContent={'flex-end'}
                    deleteTitle={'Удалить группу атрибутов из рубрики'}
                    deleteHandler={() => {
                      showModal({
                        variant: CONFIRM_MODAL,
                        props: {
                          testId: 'attributes-group-delete-modal',
                          message: `Вы уверены, что хотите удалить группу атрибутов ${attributesGroup.name} из рубрики?`,
                          confirm: () => {
                            showLoading();
                            return deleteAttributesGroupFromRubricMutation({
                              variables: {
                                input: {
                                  rubricId: rubric._id,
                                  attributesGroupId: attributesGroup._id,
                                },
                              },
                            });
                          },
                        },
                      });
                    }}
                  />
                }
              >
                <div className={`overflow-x-auto mt-4`}>
                  <Table<AttributeInterface>
                    data={attributes}
                    columns={columns()}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </Accordion>
            </div>
          );
        })}

        {(rubric.categories || []).map((category) => {
          return (
            <React.Fragment key={`${category._id}`}>
              {(category.attributesGroups || []).map((attributesGroup) => {
                const { name, attributes, _id } = attributesGroup;
                return (
                  <div key={`${_id}`} className='mb-12'>
                    <Accordion
                      title={`${name}`}
                      titleRight={
                        <ContentItemControls
                          testId={`${attributesGroup.name}`}
                          justifyContent={'flex-end'}
                          isDeleteDisabled
                          deleteTitle={'Удалить группу атрибутов из рубрики'}
                          deleteHandler={() => null}
                        />
                      }
                    >
                      <div className={`overflow-x-auto mt-4`}>
                        <Table<AttributeInterface>
                          data={attributes}
                          columns={columns(category)}
                          emptyMessage={'Список атрибутов пуст'}
                          testIdKey={'nameString'}
                        />
                      </div>
                    </Accordion>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}

        <FixedButtons>
          <Button
            size={'small'}
            testId={'add-attributes-group'}
            onClick={() => {
              showModal<AddAttributesGroupToRubricModalInterface>({
                variant: ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
                props: {
                  testId: 'add-attributes-group-to-rubric-modal',
                  rubricId: `${rubric._id}`,
                  excludedIds: (rubric.attributesGroups || []).map(
                    (attributesGroup) => `${attributesGroup._id}`,
                  ),
                  confirm: (values) => {
                    showLoading();
                    return addAttributesGroupToRubricMutation({
                      variables: {
                        input: values,
                      },
                    });
                  },
                },
              });
            }}
          >
            Добавить группу атрибутов
          </Button>
        </FixedButtons>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricAttributesPageInterface
  extends PagePropsInterface,
    RubricAttributesConsumerInterface {}

const RubricAttributesPage: NextPage<RubricAttributesPageInterface> = ({ pageUrls, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricAttributesConsumer rubric={rubric} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricAttributesPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.rubricId}`),
        },
      },
      {
        $project: {
          priorities: false,
          views: false,
        },
      },
      // get attributes
      ...rubricAttributeGroupsPipeline,

      // get categories
      {
        $lookup: {
          from: COL_CATEGORIES,
          as: 'categories',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$rubricId', '$$rubricId'],
                },
              },
            },

            // get attributes groups
            ...rubricAttributeGroupsPipeline,
          ],
        },
      },
    ])
    .toArray();
  const initialRubric = initialRubrics[0];

  if (!initialRubric) {
    return {
      notFound: true,
    };
  }

  const rawRubric = castRubricForUI({
    rubric: initialRubric,
    locale: props.sessionLocale,
  });

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
    },
  };
};

export default RubricAttributesPage;
