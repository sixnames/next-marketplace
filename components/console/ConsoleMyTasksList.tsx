import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { TASK_STATE_IN_PROGRESS } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { useUserContext } from 'context/userContext';
import { useUpdateTask } from 'hooks/mutations/useTaskMutations';
import { getProjectLinks } from 'lib/getProjectLinks';
import * as React from 'react';
import {
  getConstantOptionName,
  TASK_STATE_OPTIONS,
  TASK_VARIANT_SLUG_PRODUCT_ASSETS,
  TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES,
  TASK_VARIANT_SLUG_PRODUCT_BRANDS,
  TASK_VARIANT_SLUG_PRODUCT_CATEGORIES,
  TASK_VARIANT_SLUG_PRODUCT_DETAILS,
  TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT,
  TASK_VARIANT_SLUG_PRODUCT_VARIANTS,
} from 'config/constantSelects';
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
            taskId: dataItem._id,
            productId: dataItem.product._id,
            rubricSlug: dataItem.product.rubricSlug,
          });
          const taskProductLinkBasePath = links.cms.myTasks.details.taskId.product.productId;
          let link: string | null = null;

          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_ASSETS) {
            link = taskProductLinkBasePath.assets.url;
          }
          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_ATTRIBUTES) {
            link = taskProductLinkBasePath.attributes.url;
          }
          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_BRANDS) {
            link = taskProductLinkBasePath.brands.url;
          }
          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_CATEGORIES) {
            link = taskProductLinkBasePath.categories.url;
          }
          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_SEO_CONTENT) {
            link = taskProductLinkBasePath.editor.url;
          }
          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_DETAILS) {
            link = taskProductLinkBasePath.url;
          }
          if (dataItem.variantSlug === TASK_VARIANT_SLUG_PRODUCT_VARIANTS) {
            link = taskProductLinkBasePath.variants.url;
          }

          return link ? (
            <WpLink target={'_blank'} testId={`${dataItem.itemId}-product-link`} href={link}>
              {dataItem.product.snippetTitle}
            </WpLink>
          ) : (
            dataItem.product.snippetTitle
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
