import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import { useAppContext } from 'components/context/appContext';
import { useLocaleContext } from 'components/context/localeContext';
import WpCheckbox from 'components/FormElements/Checkbox/WpCheckbox';
import Inner from 'components/Inner';
import CmsRubricLayout from 'components/layout/cms/CmsRubricLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal';
import WpAccordion from 'components/WpAccordion';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { castRubricForUI } from 'db/cast/castRubricForUI';
import { getDbCollections } from 'db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  AttributeInterface,
  AttributesGroupInterface,
  RubricInterface,
} from 'db/uiInterfaces';
import { rubricAttributeGroupsPipeline } from 'db/utils/constantPipelines';
import {
  useAddAttributesGroupToRubric,
  useDeleteAttributesGroupFromRubric,
  useToggleAttributeInRubricFilter,
  useToggleCmsCardAttributeInRubric,
} from 'hooks/mutations/useRubricMutations';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

interface RubricAttributesConsumerInterface {
  rubric: RubricInterface;
  attributeGroups: AttributesGroupInterface[];
}

const RubricAttributesConsumer: React.FC<RubricAttributesConsumerInterface> = ({
  rubric,
  attributeGroups,
}) => {
  const { locale } = useLocaleContext();
  const { showModal } = useAppContext();

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubric();
  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubric();
  const [toggleCmsCardAttributeInRubricMutation] = useToggleCmsCardAttributeInRubric();
  const [toggleAttributeInRubricFilterMutation] = useToggleAttributeInRubricFilter();

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
      headTitle: '???????????????????? ?? ?????????????? ??????????????',
      render: ({ dataItem }) => {
        const checked = rubric.filterVisibleAttributeIds.includes(dataItem._id);
        return (
          <WpCheckbox
            value={dataItem.slug}
            name={dataItem.slug}
            checked={checked}
            onChange={() => {
              toggleAttributeInRubricFilterMutation({
                attributeIds: [`${dataItem._id}`],
                attributesGroupId: `${dataItem.attributesGroupId}`,
                rubricId: `${rubric._id}`,
              }).catch(console.log);
            }}
          />
        );
      },
    },
    {
      accessor: 'cmsCardAttributeIds',
      headTitle: '???????????????????? ?? CMS ???????????????? ????????????',
      render: ({ cellData, dataItem }) => {
        const checked = rubric.cmsCardAttributeIds.includes(dataItem._id);

        return (
          <WpCheckbox
            value={cellData}
            name={dataItem.slug}
            checked={checked}
            testId={`${dataItem.name}`}
            onChange={() => {
              toggleCmsCardAttributeInRubricMutation({
                attributeIds: [`${dataItem._id}`],
                attributesGroupId: `${dataItem.attributesGroupId}`,
                rubricId: `${rubric._id}`,
              }).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  const links = getProjectLinks({
    rubricSlug: rubric.slug,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: '????????????????',
    config: [
      {
        name: '????????????????????',
        href: links.cms.rubrics.url,
      },
      {
        name: `${rubric.name}`,
        href: links.cms.rubrics.rubricSlug.url,
      },
    ],
  };

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-attributes'}>
        {(rubric.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;
          const allAttributeIds = (attributes || []).map(({ _id }) => `${_id}`);
          const selectedCmsViewInGroup = (rubric.cmsCardAttributeIds || []).filter((_id) => {
            return allAttributeIds.some((attributeId) => `${attributeId}` === `${_id}`);
          });
          const isDeleteAll = selectedCmsViewInGroup.length > 0;
          return (
            <div key={`${_id}`} className='mb-12'>
              <WpAccordion
                isOpen
                title={`${name}`}
                titleRight={
                  <div className='flex gap-4'>
                    <WpButton
                      size='small'
                      theme='secondary'
                      onClick={() => {
                        toggleCmsCardAttributeInRubricMutation({
                          attributeIds: isDeleteAll ? [] : allAttributeIds,
                          attributesGroupId: `${attributesGroup._id}`,
                          rubricId: `${rubric._id}`,
                        }).catch(console.log);
                      }}
                    >
                      {`${isDeleteAll ? '??????????????????' : '??????????????'} ?????? ???????????????? ?????? CMS ????????????????`}
                    </WpButton>

                    <ContentItemControls
                      testId={`${attributesGroup.name}`}
                      justifyContent={'flex-end'}
                      deleteTitle={'?????????????? ???????????? ?????????????????? ???? ??????????????'}
                      deleteHandler={() => {
                        showModal({
                          variant: CONFIRM_MODAL,
                          props: {
                            testId: 'attributes-group-delete-modal',
                            message: `???? ??????????????, ?????? ???????????? ?????????????? ???????????? ?????????????????? ${attributesGroup.name} ???? ???????????????`,
                            confirm: () => {
                              deleteAttributesGroupFromRubricMutation({
                                rubricId: `${rubric._id}`,
                                attributesGroupId: `${attributesGroup._id}`,
                              }).catch(console.log);
                            },
                          },
                        });
                      }}
                    />
                  </div>
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
                    addAttributesGroupToRubricMutation(values).catch(console.log);
                  },
                },
              });
            }}
          >
            ???????????????? ???????????? ??????????????????
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
  const collections = await getDbCollections();
  const rubricsCollection = collections.rubricsCollection();
  const attributeGroupsCollection = collections.attributesGroupsCollection();

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
