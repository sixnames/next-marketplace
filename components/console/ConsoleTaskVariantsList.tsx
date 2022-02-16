import { useRouter } from 'next/router';
import * as React from 'react';
import { TaskVariantInterface } from '../../db/uiInterfaces';
import { useDeleteTaskVariant } from '../../hooks/mutations/useTaskMutations';
import { CONFIRM_MODAL } from '../../lib/config/modalVariants';
import { getConsoleTaskVariantLinks } from '../../lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleTaskVariantsListInterface {
  taskVariants: TaskVariantInterface[];
  basePath: string;
}

const ConsoleTaskVariantsList: React.FC<ConsoleTaskVariantsListInterface> = ({
  basePath,
  taskVariants,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteTaskVariantMutation] = useDeleteTaskVariant();
  const links = getConsoleTaskVariantLinks({
    basePath,
  });

  const columns: WpTableColumn<TaskVariantInterface>[] = [
    {
      headTitle: 'Название',
      render: ({ dataItem }) => {
        const links = getConsoleTaskVariantLinks({
          basePath,
          taskVariantId: dataItem._id,
        });
        return (
          <WpLink href={links.root} testId={`${dataItem.name}`}>
            {dataItem.name}
          </WpLink>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        const links = getConsoleTaskVariantLinks({
          basePath,
          taskVariantId: dataItem._id,
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
                    message: `Вы уверенны, что хотите удалить тип задачи ${dataItem.name}?`,
                    confirm: () => {
                      deleteTaskVariantMutation({
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
        <WpTable<TaskVariantInterface>
          testIdKey={'name'}
          columns={columns}
          data={taskVariants}
          onRowDoubleClick={(dataItem) => {
            const links = getConsoleTaskVariantLinks({
              basePath,
              taskVariantId: dataItem._id,
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
          Создать тип задачи
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default ConsoleTaskVariantsList;
