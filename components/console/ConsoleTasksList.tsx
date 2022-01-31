import { useRouter } from 'next/router';
import * as React from 'react';
import { getConstantOptionName, TASK_STATE_OPTIONS } from '../../config/constantSelects';
import { CONFIRM_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { useLocaleContext } from '../../context/localeContext';
import { TaskInterface } from '../../db/uiInterfaces';
import { useDeleteTask } from '../../hooks/mutations/useTaskMutations';
import { getConsoleTaskLinks } from '../../lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleTasksListInterface {
  tasks: TaskInterface[];
  basePath: string;
}

const ConsoleTasksList: React.FC<ConsoleTasksListInterface> = ({ basePath, tasks }) => {
  const router = useRouter();
  const { locale } = useLocaleContext();
  const { showModal } = useAppContext();
  const [deleteTaskMutation] = useDeleteTask();
  const links = getConsoleTaskLinks({
    basePath,
  });

  const columns: WpTableColumn<TaskInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ dataItem }) => {
        const links = getConsoleTaskLinks({
          basePath,
          taskId: dataItem._id,
        });
        return (
          <WpLink href={links.root} testId={`${dataItem.name}`}>
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
        const links = getConsoleTaskLinks({
          basePath,
          taskId: dataItem._id,
        });
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать тип задачи'}
              updateHandler={() => {
                router.push(links.root).catch(console.log);
              }}
              deleteTitle={'Удалить тип задачи'}
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
    <div className='relative' data-cy={'task-variants-list'}>
      <div className='overflow-x-auto overflow-y-hidden'>
        <WpTable<TaskInterface>
          testIdKey={'name'}
          columns={columns}
          data={tasks}
          onRowDoubleClick={(dataItem) => {
            const links = getConsoleTaskLinks({
              basePath,
              taskId: dataItem._id,
            });
            router.push(links.root).catch(console.log);
          }}
        />
      </div>
      <FixedButtons>
        <WpButton
          size='small'
          frameClassName='w-auto'
          testId={'create-task-variant-button'}
          onClick={() => {
            router.push(links.create).catch(console.log);
          }}
        >
          Создать задачу
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default ConsoleTasksList;
