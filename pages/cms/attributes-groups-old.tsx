import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import { AddAttributeToGroupModalInterface } from 'components/Modal/AttributeInGroupModal/AttributeInGroupModal';
import Table, { TableColumn } from 'components/Table/Table';
import { getConstantTranslation } from 'config/constantTranslations';
import { ATTRIBUTE_IN_GROUP_MODAL, CONFIRM_MODAL } from 'config/modals';
import { useLocaleContext } from 'context/localeContext';
import {
  AddAttributeToGroupInput,
  AttributesGroup,
  UpdateAttributeInGroupInput,
  useAddAttributeToGroupMutation,
  useDeleteAttributeFromGroupMutation,
  useUpdateAttributeInGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { PagePropsInterface } from 'pages/_app';
import { ParsedUrlQuery } from 'querystring';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

interface AttributesGroupControlsInterface {
  group?: Pick<AttributesGroup, '_id' | 'nameI18n' | 'name'>;
}

const AttributesGroupControls: React.FC<AttributesGroupControlsInterface> = ({ group }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [addAttributeToGroupMutation] = useAddAttributeToGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.addAttributeToGroup),
    onError: onErrorCallback,
  });

  if (!group) {
    return null;
  }

  function addAttributeToGroupHandler() {
    if (group) {
      const attributesGroupId = group._id;

      showModal<AddAttributeToGroupModalInterface>({
        variant: ATTRIBUTE_IN_GROUP_MODAL,
        props: {
          attributesGroupId,
          confirm: (input: Omit<AddAttributeToGroupInput, 'attributesGroupId'>) => {
            showLoading();
            return addAttributeToGroupMutation({
              variables: {
                input: {
                  attributesGroupId,
                  ...input,
                },
              },
            });
          },
        },
      });
    }
  }

  return (
    <ContentItemControls
      createTitle={'Добавить атрибут'}
      createHandler={addAttributeToGroupHandler}
      size={'small'}
      testId={'attributes-group'}
    />
  );
};

interface AttributesGroupsContentInterface {
  query?: ParsedUrlQuery;
}

const AttributesGroupsContent: React.FC<AttributesGroupsContentInterface> = ({ query = {} }) => {
  const { locale } = useLocaleContext();
  const { attributesGroupId } = query;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteAttributeFromGroupMutation] = useDeleteAttributeFromGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteAttributeFromGroup),
    onError: onErrorCallback,
  });

  const [updateAttributeInGroupMutation] = useUpdateAttributeInGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributeInGroup),
    onError: onErrorCallback,
  });

  if (!attributesGroupId) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  const columns: TableColumn<any>[] = [
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
      accessor: 'optionsGroup',
      headTitle: 'Опции',
      render: ({ cellData }) => cellData?.name || null,
    },
    {
      accessor: 'metric',
      headTitle: 'Ед. измерения',
      render: ({ cellData }) => cellData?.name || null,
    },

    {
      accessor: 'positioningInTitle',
      headTitle: 'Поз-ие в заголове',
      render: ({ cellData }) => {
        if (!cellData) {
          return null;
        }
        return getConstantTranslation(
          `selectsOptions.attributePositioning.${cellData[locale]}.${locale}`,
        );
      },
    },
    {
      render: ({ dataItem }) => {
        const { name } = dataItem;
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать атрибут'}
            updateHandler={() => {
              showModal<AddAttributeToGroupModalInterface>({
                variant: ATTRIBUTE_IN_GROUP_MODAL,
                props: {
                  attribute: dataItem,
                  attributesGroupId: `${attributesGroupId}`,
                  confirm: (
                    input: Omit<UpdateAttributeInGroupInput, 'attributesGroupId' | 'attributeId'>,
                  ) => {
                    showLoading();
                    updateAttributeInGroupMutation({
                      variables: {
                        input: {
                          attributesGroupId,
                          attributeId: dataItem._id,
                          ...input,
                          metricId: input.metricId || null,
                        },
                      },
                    }).catch((e) => console.log(e));
                  },
                },
              });
            }}
            deleteTitle={'Удалить атрибут'}
            deleteHandler={() => {
              showModal({
                variant: CONFIRM_MODAL,
                props: {
                  message: `Вы уверенны, что хотите удалить атрибут ${name}?`,
                  confirm: () => {
                    showLoading();
                    return deleteAttributeFromGroupMutation({
                      variables: { input: { attributesGroupId, attributeId: dataItem._id } },
                    });
                  },
                },
              });
            }}
            testId={`${name}-attribute`}
          />
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <DataLayoutTitle
        titleRight={<AttributesGroupControls />}
        testId={'group-title'}
      ></DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table<any>
          data={[]}
          columns={columns}
          emptyMessage={'В группе нет атрибутов'}
          testIdKey={'name'}
        />
      </DataLayoutContentFrame>
    </React.Fragment>
  );
};

const AttributesGroupsRoute: React.FC = () => {
  return (
    <DataLayout
      isFilterVisible
      title={'Группы атрибутов'}
      filterResult={({ query }) => <AttributesGroupsContent query={query} />}
    />
  );
};

const AttributesGroupsOld: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <AttributesGroupsRoute />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default AttributesGroupsOld;
