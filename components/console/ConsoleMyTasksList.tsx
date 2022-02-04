import { useRouter } from 'next/router';
import * as React from 'react';
import { getConstantOptionName, TASK_STATE_OPTIONS } from 'config/constantSelects';
import { useLocaleContext } from 'context/localeContext';
import { TaskInterface } from 'db/uiInterfaces';
import { getConsoleTaskLinks } from 'lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import WpLink from '../Link/WpLink';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleMyTasksListInterface {
  tasks: TaskInterface[];
  basePath: string;
}

const ConsoleMyTasksList: React.FC<ConsoleMyTasksListInterface> = ({ basePath, tasks }) => {
  const router = useRouter();
  const { locale } = useLocaleContext();

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
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className='relative' data-cy={'tasks-list'}>
      <div className='overflow-x-auto overflow-y-hidden'>
        <WpTable<TaskInterface> testIdKey={'name'} columns={columns} data={tasks} />
      </div>
    </div>
  );
};

export default ConsoleMyTasksList;
