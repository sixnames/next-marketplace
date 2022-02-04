import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { TASK_STATE_IN_PROGRESS } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useUserContext } from 'context/userContext';
import { useUpdateTask } from 'hooks/mutations/useTaskMutations';
import { getProjectLinks } from 'lib/getProjectLinks';
import * as React from 'react';
import { getConstantOptionName, TASK_STATE_OPTIONS } from 'config/constantSelects';
import { useLocaleContext } from 'context/localeContext';
import { TaskInterface } from 'db/uiInterfaces';
import ContentItemControls from '../button/ContentItemControls';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleMyTasksListInterface {
  tasks: TaskInterface[];
  basePath: string;
}

const ConsoleMyTasksList: React.FC<ConsoleMyTasksListInterface> = ({ tasks }) => {
  const { showModal } = useAppContext();
  const { locale } = useLocaleContext();
  const { sessionUser } = useUserContext();
  const [updateTaskMutation] = useUpdateTask();

  const columns: WpTableColumn<TaskInterface>[] = [
    {
      headTitle: 'ID',
      accessor: 'itemId',
      render: ({ dataItem }) => {
        return <div data-cy={`${dataItem.itemId}`}>{dataItem.itemId}</div>;
      },
    },
    {
      headTitle: 'Название',
      accessor: 'name',
      render: ({ dataItem }) => {
        return <div>{dataItem.name}</div>;
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
      headTitle: 'Товар',
      render: ({ dataItem }) => {
        if (dataItem.executor && dataItem.product) {
          const links = getProjectLinks({
            productId: dataItem.product._id,
            rubricSlug: dataItem.product.rubricSlug,
          });
          return (
            <WpLink
              target={'_blank'}
              testId={`${dataItem.itemId}-product-link`}
              href={links.cms.rubrics.rubricSlug.products.product.productId.url}
            >
              {dataItem.product.snippetTitle}
            </WpLink>
          );
        }
        return dataItem.product?.snippetTitle;
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
        return dataItem.executor ? (
          <div data-cy={`${dataItem.itemId}-executor`}>{dataItem.executor?.shortName}</div>
        ) : (
          'Не назначен'
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.itemId}`}
              createTitle={'Выполнить задачу'}
              createHandler={
                dataItem.executor || !sessionUser
                  ? undefined
                  : () => {
                      showModal<ConfirmModalInterface>({
                        variant: CONFIRM_MODAL,
                        props: {
                          testId: 'accept-task-modal',
                          message: `Вы уверенны, что хотите выполнить задачу ${dataItem.itemId}?`,
                          confirm: () => {
                            updateTaskMutation({
                              _id: `${dataItem._id}`,
                              stateEnum: TASK_STATE_IN_PROGRESS,
                              nameI18n: dataItem.nameI18n,
                              companySlug: dataItem.companySlug,
                              product: dataItem.product,
                              variantId: `${dataItem.variantId}`,
                              executor: sessionUser,
                            }).catch(console.log);
                          },
                        },
                      });
                    }
              }
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
