import Accordion from 'components/Accordion/Accordion';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import Checkbox from 'components/FormElements/Checkbox/Checkbox';
import InnerWide from 'components/Inner/InnerWide';
import { AddAttributesGroupToRubricModalInterface } from 'components/Modal/AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import { ATTRIBUTE_VARIANT_NUMBER, ATTRIBUTE_VARIANT_STRING } from 'config/common';
import { getFieldTranslation } from 'config/constantTranslations';
import { ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL, CONFIRM_MODAL } from 'config/modals';
import { useLocaleContext } from 'context/localeContext';
import {
  AddAttributesGroupToRubricInput,
  GetRubricQuery,
  RubricAttributeFragment,
  useAddAttributesGroupToRubricMutation,
  useDeleteAttributesGroupFromRubricMutation,
  useGetRubricAttributesQuery,
  useGetRubricBySlugQuery,
  useToggleAttributeInRubricCatalogueMutation,
  useToggleAttributeInRubricNavMutation,
} from 'generated/apolloComponents';
import { RUBRIC_ATTRIBUTES_QUERY } from 'graphql/complex/rubricsQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppLayout from 'layout/AppLayout/AppLayout';
import { getAppInitialData } from 'lib/ssrUtils';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import classes from 'routes/Rubrics/RubricAttributes.module.css';

interface DeleteAttributesGroupInterface {
  _id: string;
  name: string;
}

interface RubricDetailsInterface {
  rubric: GetRubricQuery['getRubric'];
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

  const [toggleAttributeInRubricCatalogueMutation] = useToggleAttributeInRubricCatalogueMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleAttributeInRubricCatalogue),
    onError: onErrorCallback,
    ...refetchConfig,
  });

  const [toggleAttributeInRubricNavMutation] = useToggleAttributeInRubricNavMutation({
    onCompleted: (data) => onCompleteCallback(data.toggleAttributeInRubricNav),
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

  const columns: TableColumn<RubricAttributeFragment>[] = [
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
            checked={dataItem.showInCatalogueFilter}
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
        Атрибуты
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <InnerWide>
          {attributesGroups.map((attributesGroup) => {
            const { name, attributes, _id } = attributesGroup;
            return (
              <div key={_id} className={classes.attributesGroup}>
                <Accordion
                  isOpen
                  title={name}
                  titleRight={
                    <ContentItemControls
                      justifyContent={'flex-end'}
                      deleteTitle={'Удалить группу атрибутов из рубрики'}
                      deleteHandler={() => deleteAttributesGroupHandler(attributesGroup)}
                      testId={attributesGroup.name}
                    />
                  }
                >
                  <Table<RubricAttributeFragment>
                    data={attributes}
                    columns={columns}
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

const RubricAttributesPage: NextPage = () => {
  const { query } = useRouter();
  const { data, loading, error } = useGetRubricBySlugQuery({
    variables: {
      slug: `${query.rubricSlug}`,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getRubricBySlug) {
    return <RequestError />;
  }

  return (
    <AppLayout>
      <DataLayout
        title={data.getRubricBySlug.name}
        filterResult={() => {
          return (
            <DataLayoutContentFrame>
              <RubricAttributes rubric={data.getRubricBySlug} />
            </DataLayoutContentFrame>
          );
        }}
      />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default RubricAttributesPage;
