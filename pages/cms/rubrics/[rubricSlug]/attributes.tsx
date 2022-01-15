import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import ContentItemControls from '../../../../components/button/ContentItemControls';
import FixedButtons from '../../../../components/button/FixedButtons';
import WpButton from '../../../../components/button/WpButton';
import WpCheckbox from '../../../../components/FormElements/Checkbox/WpCheckbox';
import Inner from '../../../../components/Inner';
import { AddAttributesGroupToRubricModalInterface } from '../../../../components/Modal/AddAttributesGroupToRubricModal';
import WpAccordion from '../../../../components/WpAccordion';
import WpTable, { WpTableColumn } from '../../../../components/WpTable';
import { getConstantTranslation } from '../../../../config/constantTranslations';
import {
  ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
  CONFIRM_MODAL,
} from '../../../../config/modalVariants';
import { useLocaleContext } from '../../../../context/localeContext';
import { COL_ATTRIBUTES_GROUPS, COL_RUBRICS } from '../../../../db/collectionNames';
import { rubricAttributeGroupsPipeline } from '../../../../db/dao/constantPipelines';
import { castRubricForUI } from '../../../../db/dao/rubrics/castRubricForUI';
import { RubricModel } from '../../../../db/dbModels';
import { getDatabase } from '../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributeInterface,
  AttributesGroupInterface,
  RubricInterface,
} from '../../../../db/uiInterfaces';
import {
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useToggleCmsCardAttributeInRubricMutation,
  useUpdateAttributeInRubricMutation,
} from '../../../../generated/apolloComponents';
import useMutationCallbacks from '../../../../hooks/useMutationCallbacks';
import CmsRubricLayout from '../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { sortObjectsByField } from '../../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../../lib/i18n';
import { getConsoleRubricLinks } from '../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';

interface RubricAttributesConsumerInterface {
  rubric: RubricInterface;
  attributeGroups: AttributesGroupInterface[];
}

const RubricAttributesConsumer: React.FC<RubricAttributesConsumerInterface> = ({
  rubric,
  attributeGroups,
}) => {
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

  const [toggleCmsCardAttributeInRubricMutation] = useToggleCmsCardAttributeInRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleCmsCardAttributeInRubric),
    onError: onErrorCallback,
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
      headTitle: 'Показывать в фильтре рубрики',
      render: ({ dataItem }) => {
        const checked = rubric.filterVisibleAttributeIds.includes(dataItem._id);
        return (
          <WpCheckbox
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
      accessor: 'cmsCardAttributeIds',
      headTitle: 'Показывать в CMS карточке товара',
      render: ({ cellData, dataItem }) => {
        const checked = rubric.cmsCardAttributeIds.includes(dataItem._id);

        return (
          <WpCheckbox
            value={cellData}
            name={dataItem.slug}
            checked={checked}
            onChange={() => {
              showLoading();
              toggleCmsCardAttributeInRubricMutation({
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
  ];

  const { parentLink, root } = getConsoleRubricLinks({
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Атрибуты',
    config: [
      {
        name: 'Рубрикатор',
        href: parentLink,
      },
      {
        name: `${rubric.name}`,
        href: root,
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
              <WpAccordion
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

        <FixedButtons>
          <WpButton
            size={'small'}
            testId={'add-attributes-group'}
            onClick={() => {
              showModal<AddAttributesGroupToRubricModalInterface>({
                variant: ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
                props: {
                  testId: 'add-attributes-group-to-rubric-modal',
                  rubricId: `${rubric._id}`,
                  attributeGroups,
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
          </WpButton>
        </FixedButtons>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricAttributesPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricAttributesConsumerInterface {}

const RubricAttributesPage: NextPage<RubricAttributesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricAttributesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricAttributesPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const attributeGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);

  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const initialRubrics = await rubricsCollection
    .aggregate<RubricInterface>([
      {
        $match: {
          slug: `${query.rubricSlug}`,
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

  const rawAttributeGroups = await attributeGroupsCollection
    .find({
      _id: {
        $nin: rawRubric.attributesGroupIds,
      },
    })
    .toArray();
  const castedAttributeGroups = rawAttributeGroups.map((attributeGroup) => {
    return {
      ...attributeGroup,
      name: getFieldStringLocale(attributeGroup.nameI18n, props.sessionLocale),
    };
  });
  const sortedAttributeGroups = sortObjectsByField(castedAttributeGroups);

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
      attributeGroups: castDbData(sortedAttributeGroups),
    },
  };
};

export default RubricAttributesPage;
