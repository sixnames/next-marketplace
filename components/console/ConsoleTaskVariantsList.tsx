import { TaskVariantInterface } from 'db/uiInterfaces';
import { useDeleteTaskVariant } from 'hooks/mutations/useTaskMutations';
import { useBasePath } from 'hooks/useBasePath';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleTaskVariantsListInterface {
  taskVariants: TaskVariantInterface[];
}

const ConsoleTaskVariantsList: React.FC<ConsoleTaskVariantsListInterface> = ({ taskVariants }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deleteTaskVariantMutation] = useDeleteTaskVariant();
  const basePath = useBasePath('task-variants');

  const columns: WpTableColumn<TaskVariantInterface>[] = [
    {
      headTitle: 'Название',
      render: ({ dataItem }) => {
        return (
          <WpLink href={`${basePath}/${dataItem._id}`} testId={`${dataItem.name}`}>
            {dataItem.name}
          </WpLink>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать тип задачи'}
              updateHandler={() => {
                router.push(`${basePath}/${dataItem._id}`).catch(console.log);
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
            router.push(`${basePath}/${dataItem._id}`).catch(console.log);
          }}
        />
      </div>
      <FixedButtons>
        <WpButton
          size='small'
          frameClassName='w-auto'
          testId={'create-task-variant-button'}
          onClick={() => {
            router.push(`${basePath}/create`).catch(console.log);
          }}
        >
          Создать тип задачи
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default ConsoleTaskVariantsList;
