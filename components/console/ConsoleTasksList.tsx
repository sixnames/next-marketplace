import { useAppContext } from 'components/context/appContext';
import { useLocaleContext } from 'components/context/localeContext';
import { TaskInterface } from 'db/uiInterfaces';
import { useDeleteTask } from 'hooks/mutations/useTaskMutations';
import { useBasePath } from 'hooks/useBasePath';
import { getConstantOptionName, TASK_STATE_OPTIONS } from 'lib/config/constantSelects';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleTasksListInterface {
  tasks: TaskInterface[];
}

const ConsoleTasksList: React.FC<ConsoleTasksListInterface> = ({ tasks }) => {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const { showModal } = useAppContext();
  const [deleteTaskMutation] = useDeleteTask();
  const basePath = useBasePath('tasks');

  const columns: WpTableColumn<TaskInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ dataItem }) => {
        return (
          <WpLink href={`${basePath}/details/${dataItem._id}`} testId={`${dataItem.name}`}>
            {dataItem.name}
          </WpLink>
        );
      },
    },
    {
      accessor: 'stateEnum',
      headTitle: 'Статус',
      render: ({ cellData }) => {
        return getConstantOptionName({
          value: cellData,
          options: TASK_STATE_OPTIONS,
          locale,
        });
      },
    },
    {
      headTitle: 'Добавлена пользователем',
      render: ({ dataItem }) => {
        return dataItem.creator?.shortName;
      },
    },
    {
      headTitle: 'Испольнитель',
      render: ({ dataItem }) => {
        return dataItem.executor?.shortName || 'Не назначен';
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать задачу'}
              updateHandler={() => {
                router.push(`${basePath}/details/${dataItem._id}`).catch(console.log);
              }}
              deleteTitle={'Удалить задачу'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить задачу ${dataItem.name}?`,
                    confirm: () => {
                      deleteTaskMutation({
                        _id: `${dataItem._id}`,
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className='relative' data-cy={'tasks-list'}>
      <div className='overflow-x-auto overflow-y-hidden'>
        <WpTable<TaskInterface>
          testIdKey={'name'}
          columns={columns}
          data={tasks}
          onRowDoubleClick={(dataItem) => {
            router.push(`${basePath}/details/${dataItem._id}`).catch(console.log);
          }}
        />
      </div>
      <FixedButtons>
        <WpButton
          size='small'
          frameClassName='w-auto'
          testId={'create-task-button'}
          onClick={() => {
            router.push(`${basePath}/create`).catch(console.log);
          }}
        >
          Создать задачу
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default ConsoleTasksList;
