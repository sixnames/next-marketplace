import { Form, Formik } from 'formik';
import * as React from 'react';
import { TASK_STATE_OPTIONS } from '../../config/constantSelects';
import { UpdateTaskInputInterface } from '../../db/dao/tasks/updateTask';
import { TaskInterface } from '../../db/uiInterfaces';
import { useUpdateTask } from '../../hooks/mutations/useTaskMutations';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import TaskMainFields, { TaskMainFieldsInterface } from '../FormTemplates/TaskMainFields';
import Inner from '../Inner';

export interface UpdateTaskFormInterface extends TaskMainFieldsInterface {
  task: TaskInterface;
}

const UpdateTaskForm: React.FC<UpdateTaskFormInterface> = ({ taskVariants, task }) => {
  const initialValues: UpdateTaskInputInterface = {
    _id: `${task._id}`,
    variantId: `${task.variantId}`,
    executor: task.executor,
    product: task.product,
    companySlug: task.companySlug,
    nameI18n: task.nameI18n,
    stateEnum: task.stateEnum,
  };
  const [updateTaskMutation] = useUpdateTask();

  return (
    <Inner testId={'update-task-page'}>
      <Formik<UpdateTaskInputInterface>
        initialValues={initialValues}
        onSubmit={(values) => {
          updateTaskMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                useIdField
                name={'stateEnum'}
                testId={'task-state'}
                label={'Статус'}
                options={TASK_STATE_OPTIONS}
              />
              <TaskMainFields taskVariants={taskVariants} />
              <FixedButtons>
                <WpButton type={'submit'} size={'small'} testId={'task-submit'}>
                  Сохранить
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default UpdateTaskForm;
