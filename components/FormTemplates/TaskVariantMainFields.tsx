import { useFormikContext } from 'formik';
import * as React from 'react';
import { TASK_VARIANT_SLUGS } from '../../config/constantSelects';
import { CreateTaskVariantInputInterface } from '../../db/dao/tasks/createTaskVariant';
import { TaskVariantPriceModel } from '../../db/dbModels';
import WpButton from '../button/WpButton';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import { get } from 'lodash';
import WpTable from '../WpTable';

export interface TaskVariantMainFieldsInterface {
  onPriceDeleteHandler: (priceIndex: number) => void;
  onPriceCreateHandler: (price: TaskVariantPriceModel) => void;
}

const TaskVariantMainFields: React.FC<TaskVariantMainFieldsInterface> = () => {
  const { values } = useFormikContext<CreateTaskVariantInputInterface>();
  const prices = get(values, 'prices');

  return (
    <React.Fragment>
      <FormikTranslationsInput
        name={'nameI18n'}
        testId={'nameI18n'}
        label={'Название'}
        isRequired
        showInlineError
      />

      <FormikSelect name={'slug'} testId={'slug'} label={'Slug'} options={TASK_VARIANT_SLUGS} />

      <WpTable columns={[]} data={prices} />

      <div className={'mb-12'}>
        <WpButton size={'small'} theme={'secondary'}>
          Добваить цену
        </WpButton>
      </div>
    </React.Fragment>
  );
};

export default TaskVariantMainFields;
