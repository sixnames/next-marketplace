import { useFormikContext } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import { CreateTaskVariantInputInterface } from '../../db/dao/tasks/createTaskVariant';
import { TaskVariantPriceModel } from '../../db/dbModels';
import {
  getConstantOptionName,
  TASK_PRICE_ACTIONS,
  TASK_PRICE_SLUGS,
  TASK_PRICE_TARGETS,
  TASK_VARIANT_SLUGS,
} from '../../lib/config/constantSelects';
import { CONFIRM_MODAL, TASK_VARIANT_PRICE_MODAL } from '../../lib/config/modalVariants';
import ContentItemControls from '../button/ContentItemControls';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import { useLocaleContext } from '../context/localeContext';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { TaskVariantPriceModalInterface } from '../Modal/TaskVariantPriceModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface TaskVariantMainFieldsInterface {
  onPriceDeleteHandler: (priceIndex: number) => void;
  onPriceCreateHandler: (price: TaskVariantPriceModel) => void;
  onPriceUpdateHandler: (price: TaskVariantPriceModel, priceIndex: number) => void;
}

const TaskVariantMainFields: React.FC<TaskVariantMainFieldsInterface> = ({
  onPriceDeleteHandler,
  onPriceCreateHandler,
  onPriceUpdateHandler,
}) => {
  const { showModal } = useAppContext();
  const { locale } = useLocaleContext();
  const { values } = useFormikContext<CreateTaskVariantInputInterface>();
  const prices = get(values, 'prices');

  const columns: WpTableColumn<TaskVariantPriceModel>[] = [
    {
      accessor: 'price',
      headTitle: 'Цена',
      render: ({ cellData }) => {
        return cellData;
      },
    },
    {
      accessor: 'action',
      headTitle: 'Действие',
      render: ({ cellData }) => {
        return getConstantOptionName({
          locale,
          options: TASK_PRICE_ACTIONS,
          value: cellData,
        });
      },
    },
    {
      accessor: 'slug',
      headTitle: 'Slug',
      render: ({ cellData }) => {
        return getConstantOptionName({
          locale,
          options: TASK_PRICE_SLUGS,
          value: cellData,
        });
      },
    },
    {
      accessor: 'target',
      headTitle: 'Цель',
      render: ({ cellData }) => {
        return getConstantOptionName({
          locale,
          options: TASK_PRICE_TARGETS,
          value: cellData,
        });
      },
    },
    {
      render: ({ dataItem, rowIndex }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`task-variant-price-${rowIndex}`}
              updateTitle={'Редактировать цену'}
              updateHandler={() => {
                showModal<TaskVariantPriceModalInterface>({
                  variant: TASK_VARIANT_PRICE_MODAL,
                  props: {
                    taskVariantPrice: dataItem,
                    onSubmit: (taskVariantPrice) => {
                      onPriceUpdateHandler(taskVariantPrice, rowIndex);
                    },
                  },
                });
              }}
              deleteTitle={'Удалить цену'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотиту удалить цену?`,
                    confirm: () => {
                      onPriceDeleteHandler(rowIndex);
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
    <React.Fragment>
      <FormikTranslationsInput
        name={'nameI18n'}
        testId={'nameI18n'}
        label={'Название'}
        isRequired
        showInlineError
      />

      <FormikSelect
        name={'slug'}
        testId={'task-variant-slug'}
        label={'Slug'}
        options={TASK_VARIANT_SLUGS}
      />

      <WpTable columns={columns} data={prices} />

      <div className={'mb-12 mt-8'}>
        <WpButton
          size={'small'}
          theme={'secondary'}
          testId={'add-task-variant-price-button'}
          onClick={() => {
            showModal<TaskVariantPriceModalInterface>({
              variant: TASK_VARIANT_PRICE_MODAL,
              props: {
                onSubmit: (taskVariantPrice) => {
                  onPriceCreateHandler(taskVariantPrice);
                },
              },
            });
          }}
        >
          Добаваить цену
        </WpButton>
      </div>
    </React.Fragment>
  );
};

export default TaskVariantMainFields;
