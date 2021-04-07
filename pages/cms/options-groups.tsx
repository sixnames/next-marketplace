import Button from 'components/Buttons/Button';
import ColorPreview from 'components/ColorPreview/ColorPreview';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout, { FilterResultArgsInterface } from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import DataLayoutTitle from 'components/DataLayout/DataLayoutTitle';
import FilterRadioGroup from 'components/FilterElements/FilterRadio/FilterRadioGroup';
import Icon from 'components/Icon/Icon';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { OptionInGroupModalInterface } from 'components/Modal/OptionInGroupModal/OptionInGroupModal';
import { OptionsGroupModalInterface } from 'components/Modal/OptionsGroupModal/OptionsGroupModal';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import { OPTIONS_GROUP_VARIANT_COLOR, OPTIONS_GROUP_VARIANT_ICON, ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL, OPTION_IN_GROUP_MODAL, OPTIONS_GROUP_MODAL } from 'config/modals';
import {
  Gender,
  OptionInGroupFragment,
  OptionsGroupFragment,
  OptionsGroupVariant,
  useAddOptionToGroupMutation,
  useCreateOptionsGroupMutation,
  useDeleteOptionFromGroupMutation,
  useDeleteOptionsGroupMutation,
  useGetAllOptionsGroupsQuery,
  useGetOptionsGroupQuery,
  useUpdateOptionInGroupMutation,
  useUpdateOptionsGroupMutation,
} from 'generated/apolloComponents';
import { OPTIONS_GROUP_QUERY, OPTIONS_GROUPS_QUERY } from 'graphql/query/optionsQueries';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';
import classes from 'styles/OptionsGroupsContent.module.css';
import { ObjectType } from 'types/clientTypes';

interface OptionsGroupControlsInterface {
  group: OptionsGroupFragment;
}

const OptionsGroupControls: React.FC<OptionsGroupControlsInterface> = ({ group }) => {
  const router = useRouter();
  const { _id, name, variant } = group;
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [updateOptionsGroupMutation] = useUpdateOptionsGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.updateOptionsGroup),
    onError: onErrorCallback,
  });

  const [deleteOptionsGroupMutation] = useDeleteOptionsGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onCompleteCallback(data.deleteOptionsGroup);
      router.replace(`${ROUTE_CMS}/options-groups`).catch((e) => console.log(e));
    },
    onError: onErrorCallback,
  });

  const [addOptionToGroupMutation] = useAddOptionToGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUP_QUERY, variables: { _id } }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.addOptionToGroup),
    onError: onErrorCallback,
  });

  function updateOptionsGroupHandler() {
    showModal<OptionsGroupModalInterface>({
      variant: OPTIONS_GROUP_MODAL,
      props: {
        group,
        confirm: (values) => {
          showLoading();
          return updateOptionsGroupMutation({
            variables: {
              input: {
                optionsGroupId: _id,
                ...values,
              },
            },
          });
        },
      },
    });
  }

  function deleteOptionsGroupHandler() {
    showModal({
      variant: CONFIRM_MODAL,
      props: {
        testId: 'delete-options-group',
        message: `Вы уверенны, что хотите удалить группу опций ${name}?`,
        confirm: () => {
          showLoading();
          return deleteOptionsGroupMutation({ variables: { _id } });
        },
      },
    });
  }

  function addOptionToGroupHandler() {
    showModal<OptionInGroupModalInterface>({
      variant: OPTION_IN_GROUP_MODAL,
      props: {
        groupVariant: variant,
        confirm: (values) => {
          showLoading();
          return addOptionToGroupMutation({
            variables: {
              input: {
                optionsGroupId: _id,
                ...values,
                gender: values.gender as Gender,
              },
            },
          });
        },
      },
    });
  }

  return (
    <ContentItemControls
      createTitle={'Добавить опцию'}
      updateTitle={'Редактировать название'}
      deleteTitle={'Удалить группу'}
      createHandler={addOptionToGroupHandler}
      updateHandler={updateOptionsGroupHandler}
      deleteHandler={deleteOptionsGroupHandler}
      size={'small'}
      testId={'options-group'}
    />
  );
};

const OptionsGroupsFilter: React.FC = () => {
  const { data, loading, error } = useGetAllOptionsGroupsQuery({
    fetchPolicy: 'network-only',
  });
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [createOptionsGroupMutation] = useCreateOptionsGroupMutation({
    refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: (data) => onCompleteCallback(data.createOptionsGroup),
    onError: onErrorCallback,
  });

  function createOptionsGroupHandler() {
    showModal<OptionsGroupModalInterface>({
      variant: OPTIONS_GROUP_MODAL,
      props: {
        confirm: (values) => {
          showLoading();
          return createOptionsGroupMutation({ variables: { input: values } });
        },
      },
    });
  }

  if (loading) {
    return <Spinner />;
  }
  if (error || !data) {
    return <RequestError />;
  }

  const { getAllOptionsGroups } = data;

  return (
    <React.Fragment>
      <FilterRadioGroup
        radioItems={getAllOptionsGroups}
        queryKey={'optionsGroupId'}
        label={'Группы'}
      />
      <Button size={'small'} onClick={createOptionsGroupHandler} testId={'create-options-group'}>
        Добавить группу
      </Button>
    </React.Fragment>
  );
};

interface OptionsGroupsContentInterface {
  query?: ObjectType;
}

const OptionsGroupsContent: React.FC<OptionsGroupsContentInterface> = ({ query = {} }) => {
  const { optionsGroupId } = query;
  const { data, loading, error } = useGetOptionsGroupQuery({
    skip: !optionsGroupId,
    variables: { _id: `${optionsGroupId}` },
    fetchPolicy: 'network-only',
  });

  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });

  const [deleteOptionFromGroupMutation] = useDeleteOptionFromGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteOptionFromGroup),
    onError: onErrorCallback,
  });

  const [updateOptionInGroupMutation] = useUpdateOptionInGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateOptionInGroup),
    onError: onErrorCallback,
  });

  function deleteOptionFromGroupHandler(_id: string, name: string) {
    showModal<ConfirmModalInterface>({
      variant: CONFIRM_MODAL,
      props: {
        message: `Вы уверенны, что хотите удалить опцию ${name}?`,
        confirm: () => {
          showLoading();
          return deleteOptionFromGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [{ query: OPTIONS_GROUPS_QUERY }],
            variables: { input: { optionsGroupId: `${optionsGroupId}`, optionId: _id } },
          });
        },
      },
    });
  }

  function updateOptionInGroupHandler(option: OptionInGroupFragment) {
    showModal<OptionInGroupModalInterface>({
      variant: OPTION_IN_GROUP_MODAL,
      props: {
        option,
        groupVariant: `${data?.getOptionsGroup?.variant}` as OptionsGroupVariant,
        confirm: (values) => {
          showLoading();
          return updateOptionInGroupMutation({
            awaitRefetchQueries: true,
            refetchQueries: [
              { query: OPTIONS_GROUP_QUERY, variables: { _id: `${optionsGroupId}` } },
            ],
            variables: {
              input: { ...values, optionId: option._id, optionsGroupId: `${optionsGroupId}` },
            },
          });
        },
      },
    });
  }

  if (!optionsGroupId) {
    return <DataLayoutTitle>Выберите группу</DataLayoutTitle>;
  }

  if (loading) {
    return <Spinner isNested />;
  }
  if (error || !data || !data.getOptionsGroup) {
    return <RequestError />;
  }

  const { getOptionsGroup } = data;
  const { name, options, variant } = getOptionsGroup;

  const columns: TableColumn<OptionInGroupFragment>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'color',
      headTitle: 'Цвет',
      isHidden: variant !== OPTIONS_GROUP_VARIANT_COLOR,
      render: ({ cellData, dataItem }) => {
        return <ColorPreview color={cellData} testId={dataItem.name} />;
      },
    },
    {
      accessor: 'icon',
      headTitle: 'Иконка',
      isHidden: variant !== OPTIONS_GROUP_VARIANT_ICON,
      render: ({ cellData, dataItem }) => (
        <div data-cy={`${dataItem.name}-icon`}>
          <Icon className={classes.icon} name={cellData} />
        </div>
      ),
    },
    {
      accessor: '_id',
      render: ({ cellData, dataItem }) => {
        const { name } = dataItem;

        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать опцию'}
            updateHandler={() => updateOptionInGroupHandler(dataItem)}
            deleteTitle={'Удалить опцию'}
            deleteHandler={() => deleteOptionFromGroupHandler(cellData, name)}
            testId={`${name}-option`}
          />
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <DataLayoutTitle
        titleRight={<OptionsGroupControls group={getOptionsGroup} />}
        testId={'group-title'}
      >
        {name}
      </DataLayoutTitle>
      <DataLayoutContentFrame>
        <Table<OptionInGroupFragment>
          data={options}
          columns={columns}
          emptyMessage={'В группе нет опций'}
          testIdKey={'name'}
        />
      </DataLayoutContentFrame>
    </React.Fragment>
  );
};

const OptionsGroupsRoute = () => (
  <DataLayout
    isFilterVisible
    title={'Группы опций'}
    filterContent={<OptionsGroupsFilter />}
    filterResult={({ query }: FilterResultArgsInterface) => <OptionsGroupsContent query={query} />}
  />
);

const OptionsGroups: NextPage<PagePropsInterface> = ({ pageUrls }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OptionsGroupsRoute />
    </CmsLayout>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  return getAppInitialData({ context, isCms: true });
};

export default OptionsGroups;
