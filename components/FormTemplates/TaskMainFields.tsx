import { useFormikContext } from 'formik';
import * as React from 'react';
import { PRODUCT_SEARCH_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { CreateTaskInputInterface } from '../../db/dao/tasks/createTask';
import { TaskVariantInterface } from '../../db/uiInterfaces';
import { useUserSearchModal } from '../../hooks/useUserSearchModal';
import WpButton from '../button/WpButton';
import FakeInput from '../FormElements/Input/FakeInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import InputLine from '../FormElements/Input/InputLine';
import FormikSelect from '../FormElements/Select/FormikSelect';
import { get } from 'lodash';
import { ProductSearchModalInterface } from '../Modal/ProductSearchModal';

export interface TaskMainFieldsInterface {
  taskVariants: TaskVariantInterface[];
}

const TaskMainFields: React.FC<TaskMainFieldsInterface> = ({ taskVariants }) => {
  const showUsersSearchModal = useUserSearchModal();
  const { hideModal, showModal } = useAppContext();
  const { setFieldValue, values } = useFormikContext<CreateTaskInputInterface>();
  const executor = get(values, 'executor');
  const product = get(values, 'product');

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
        useIdField
        name={'variantId'}
        testId={'task-variant-id'}
        label={'Тип задачи'}
        options={taskVariants}
      />

      {/*executor*/}
      <FakeInput value={executor?.fullName} label={'Исполнитель'} testId={'executor'} />
      <InputLine labelTag={'div'}>
        <WpButton
          theme={'secondary'}
          size={'small'}
          testId={'add-executor'}
          onClick={() =>
            showUsersSearchModal({
              createTitle: 'Назначить исполнителем',
              createHandler: (user) => {
                hideModal();
                setFieldValue('executor', user);
              },
            })
          }
        >
          {executor ? 'Изменить исполнителя' : 'Выбрать исполнителя'}
        </WpButton>
      </InputLine>

      {/*product*/}
      <FakeInput value={product?.snippetTitle} label={'Товар'} testId={'product'} />
      <InputLine labelTag={'div'}>
        <WpButton
          theme={'secondary'}
          size={'small'}
          testId={'add-product'}
          onClick={() => {
            showModal<ProductSearchModalInterface>({
              variant: PRODUCT_SEARCH_MODAL,
              props: {
                createTitle: 'Добавить товар в задачу',
                testId: 'set-task-product-modal',
                createHandler: (addProduct) => {
                  hideModal();
                  setFieldValue('product', addProduct);
                },
              },
            });
          }}
        >
          {executor ? 'Изменить товар' : 'Выбрать товар'}
        </WpButton>
      </InputLine>
    </React.Fragment>
  );
};

export default TaskMainFields;
