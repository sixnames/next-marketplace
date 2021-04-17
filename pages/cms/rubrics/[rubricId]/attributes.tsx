import Accordion from 'components/Accordion/Accordion';
import Button from 'components/Buttons/Button';
import FixedButtons from 'components/Buttons/FixedButtons';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import Inner from 'components/Inner/Inner';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal';
import Table, { TableColumn } from 'components/Table/Table';
import { ATTRIBUTE_VARIANT_NUMBER, ATTRIBUTE_VARIANT_STRING } from 'config/common';
import { getFieldTranslation } from 'config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'config/modals';
import { useLocaleContext } from 'context/localeContext';
import { COL_ATTRIBUTES_GROUPS, COL_RUBRICS } from 'db/collectionNames';
import { AttributesGroupModel, RubricAttributeModel, RubricModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useToggleAttributeInRubricCatalogueMutation,
  useToggleAttributeInRubricNavMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import CmsRubricLayout from 'layout/CmsLayout/CmsRubricLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricAttributesConsumerInterface {
  rubric: RubricModel;
}

const RubricAttributesConsumer: React.FC<RubricAttributesConsumerInterface> = ({ rubric }) => {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubricMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.deleteAttributesGroupFromRubric);
      if (data.deleteAttributesGroupFromRubric.success) {
        router.reload();
      }
    },
    onError: onErrorCallback,
  });

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubricMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.addAttributesGroupToRubric);
      if (data.addAttributesGroupToRubric.success) {
        router.reload();
      }
    },
    onError: onErrorCallback,
  });

  const [toggleAttributeInRubricCatalogueMutation] = useToggleAttributeInRubricCatalogueMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.toggleAttributeInRubricCatalogue);
      if (data.toggleAttributeInRubricCatalogue.success) {
        router.reload();
      }
    },
    onError: onErrorCallback,
  });

  const [toggleAttributeInRubricNavMutation] = useToggleAttributeInRubricNavMutation({
    onCompleted: (data) => {
      onCompleteCallback(data.toggleAttributeInRubricNav);
      if (data.toggleAttributeInRubricNav.success) {
        router.reload();
      }
    },
    onError: onErrorCallback,
  });

  function deleteAttributesGroupHandler(attributesGroup: AttributesGroupModel) {
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
  }

  function addAttributesGroupToRubricHandler() {
    showModal<AddAttributesGroupToRubricModalInterface>({
      variant: ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
      props: {
        testId: 'add-attributes-group-to-rubric-modal',
        rubricId: `${rubric._id}`,
        excludedIds: rubric.attributesGroupsIds.map((_id) => `${_id}`),
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
  }

  const columns: TableColumn<RubricAttributeModel>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'variant',
      headTitle: 'Тип',
      render: ({ cellData }) =>
        getFieldTranslation(`selectsOptions.attributeVariants.${cellData}.${locale}`),
    },
    {
      accessor: 'metric',
      headTitle: 'Единица измерения',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: '_id',
      headTitle: 'Показывать в фильтре',
      render: ({ cellData, dataItem }) => {
        const isDisabled =
          dataItem.variant === ATTRIBUTE_VARIANT_NUMBER ||
          dataItem.variant === ATTRIBUTE_VARIANT_STRING;
        return (
          <Checkbox
            testId={`${dataItem.name}-filter`}
            disabled={isDisabled}
            checked={dataItem.showInCatalogueFilter}
            value={cellData}
            name={'showInCatalogueFilter'}
            onChange={() => {
              showLoading();
              toggleAttributeInRubricCatalogueMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: rubric._id,
                  },
                },
              }).catch((e) => console.log(e));
            }}
          />
        );
      },
    },
    {
      accessor: '_id',
      headTitle: 'Показывать в навигации',
      render: ({ cellData, dataItem }) => {
        const isDisabled =
          dataItem.variant === ATTRIBUTE_VARIANT_NUMBER ||
          dataItem.variant === ATTRIBUTE_VARIANT_STRING;
        return (
          <Checkbox
            testId={`${dataItem.name}-nav`}
            disabled={isDisabled}
            checked={dataItem.showInCatalogueNav}
            value={cellData}
            name={'showInCatalogueNav'}
            onChange={() => {
              showLoading();
              toggleAttributeInRubricNavMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: rubric._id,
                  },
                },
              }).catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  return (
    <CmsRubricLayout rubric={rubric}>
      <Inner testId={'rubric-attributes'}>
        {(rubric.attributesGroups || []).map((attributesGroup) => {
          const { name, attributes, _id } = attributesGroup;
          return (
            <div key={`${_id}`} className='mb-12'>
              <Accordion
                isOpen
                title={`${name}`}
                titleRight={
                  <ContentItemControls
                    justifyContent={'flex-end'}
                    deleteTitle={'Удалить группу атрибутов из рубрики'}
                    deleteHandler={() => deleteAttributesGroupHandler(attributesGroup)}
                    testId={`${attributesGroup.name}`}
                  />
                }
              >
                <div className={`overflow-x-auto`}>
                  <Table<RubricAttributeModel>
                    data={attributes}
                    columns={columns}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </div>
              </Accordion>
            </div>
          );
        })}

        <FixedButtons>
          <Button onClick={addAttributesGroupToRubricHandler}>Добавить группу атрибутов</Button>
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
  const db = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);

  const { props } = await getAppInitialData({ context, isCms: true });
  if (!props || !query.rubricId) {
    return {
      notFound: true,
    };
  }

  const initialRubrics = await rubricsCollection
    .aggregate([
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
      {
        $lookup: {
          from: COL_ATTRIBUTES_GROUPS,
          as: 'attributesGroups',
          foreignField: '_id',
          localField: 'attributesGroupsIds',
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

  const { sessionLocale } = props;
  const rawRubric = {
    ...initialRubric,
    name: getFieldStringLocale(initialRubric.nameI18n, sessionLocale),
    attributes: [],
    attributesGroups: (initialRubric.attributesGroups || []).map((attributesGroup) => {
      const groupAttributes = initialRubric.attributes.filter(({ _id }) => {
        return attributesGroup.attributesIds.some((attributeId) => attributeId.equals(_id));
      });

      return {
        ...attributesGroup,
        name: getFieldStringLocale(attributesGroup.nameI18n, sessionLocale),
        attributes: groupAttributes.map((attribute) => {
          return {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, sessionLocale),
          };
        }),
      };
    }),
  };

  return {
    props: {
      ...props,
      rubric: castDbData(rawRubric),
    },
  };
};

export default RubricAttributesPage;
