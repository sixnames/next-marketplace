import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal';
import * as React from 'react';
import {
  AddAttributesGroupToRubricInput,
  GetRubricQuery,
  RubricAttributeFragment,
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useGetRubricAttributesQuery,
  useUpdateAttributesGroupInRubricMutation,
} from 'generated/apolloComponents';
import DataLayoutTitle from '../../components/DataLayout/DataLayoutTitle';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import Table, { TableColumn } from '../../components/Table/Table';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'config/modals';
import Checkbox from '../../components/FormElements/Checkbox/Checkbox';
import Accordion from '../../components/Accordion/Accordion';
import InnerWide from '../../components/Inner/InnerWide';
import classes from './RubricAttributes.module.css';
import { RUBRIC_ATTRIBUTES_QUERY } from 'graphql/complex/rubricsQueries';
import { ATTRIBUTE_VARIANT_NUMBER, ATTRIBUTE_VARIANT_STRING } from 'config/common';
import { getFieldTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';

interface DeleteAttributesGroupInterface {
  _id: string;
  name: string;
}

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
}

interface AttributesColumnsInterface {
  attributesGroupId: string;
  showInCatalogueFilter: string[];
}

export type AddAttributesGroupToRubricValues = Omit<AddAttributesGroupToRubricInput, 'rubricId'>;

const RubricAttributes: React.FC<RubricDetailsInterface> = ({ rubric }) => {
  const { locale } = useLocaleContext();
  const { showModal, onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const { data, error, loading } = useGetRubricAttributesQuery({
    fetchPolicy: 'network-only',
    variables: {
      rubricId: rubric._id,
    },
  });

  const refetchConfig = {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: RUBRIC_ATTRIBUTES_QUERY,
        variables: {
          rubricId: rubric._id,
        },
      },
    ],
  };

  const [deleteAttributesGroupFromRubricMutation] = useDeleteAttributesGroupFromRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributesGroupFromRubric),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const [addAttributesGroupToRubricMutation] = useAddAttributesGroupToRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributesGroupToRubric),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const [updateAttributesGroupInRubricMutation] = useUpdateAttributesGroupInRubricMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributesGroupInRubric),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  if (!data && !loading && !error) {
    return <DataLayoutTitle>Выберите рубрику</DataLayoutTitle>;
  }

  if (loading) {
    return <Spinner isNested />;
  }
  if (error || !data || !data.getRubric) {
    return <RequestError />;
  }

  const {
    getRubric: { attributesGroups = [] },
  } = data;

  function deleteAttributesGroupHandler(attributesGroup: DeleteAttributesGroupInterface) {
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
        rubricId: rubric._id,
        excludedIds: attributesGroups?.map((group) => (group ? group._id : '')) || [],
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

  const columns = ({
    attributesGroupId,
    showInCatalogueFilter,
  }: AttributesColumnsInterface): TableColumn<RubricAttributeFragment>[] => [
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
      accessor: 'optionsGroup',
      headTitle: 'Опции',
      render: ({ cellData }) => cellData?.name || null,
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
            testId={`${dataItem.name}`}
            disabled={isDisabled}
            checked={showInCatalogueFilter.includes(cellData)}
            value={cellData}
            name={'showInCatalogueFilter'}
            onChange={() => {
              showLoading();
              updateAttributesGroupInRubricMutation({
                variables: {
                  input: {
                    attributeId: cellData,
                    rubricId: rubric._id,
                    attributesGroupId: attributesGroupId,
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
    <div data-cy={'rubric-attributes'}>
      <DataLayoutTitle
        testId={'rubric-title'}
        titleRight={
          <ContentItemControls
            createTitle={'Добавить группу атрибутов в рубрику'}
            testId={rubric.name}
            createHandler={addAttributesGroupToRubricHandler}
          />
        }
      >
        {rubric.name}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <InnerWide>
          {attributesGroups.map(({ attributesGroup, _id, showInCatalogueFilter, isOwner }) => {
            const { name, attributes } = attributesGroup;
            return (
              <div key={_id} className={classes.attributesGroup}>
                <Accordion
                  isOpen
                  title={name}
                  titleRight={
                    <ContentItemControls
                      disabled={!isOwner}
                      justifyContent={'flex-end'}
                      deleteTitle={'Удалить группу атрибутов из рубрики'}
                      deleteHandler={() => deleteAttributesGroupHandler(attributesGroup)}
                      testId={attributesGroup.name}
                    />
                  }
                >
                  <Table<RubricAttributeFragment>
                    data={attributes}
                    columns={columns({
                      attributesGroupId: attributesGroup._id,
                      showInCatalogueFilter,
                    })}
                    emptyMessage={'Список атрибутов пуст'}
                    testIdKey={'nameString'}
                  />
                </Accordion>
              </div>
            );
          })}
        </InnerWide>
      </DataLayoutContentFrame>
    </div>
  );
};

export default RubricAttributes;
