import { Form, Formik } from 'formik';
import * as React from 'react';
import { CreateTaskInputInterface } from '../../db/dao/tasks/createTask';
import { useCreateTask } from '../../hooks/mutations/useTaskMutations';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import TaskMainFields, { TaskMainFieldsInterface } from '../FormTemplates/TaskMainFields';
import Inner from '../Inner';
import WpTitle from '../WpTitle';

export interface CreateTaskFormInterface extends TaskMainFieldsInterface {
  companySlug: string;
  basePath: string;
}

const CreateTaskForm: React.FC<CreateTaskFormInterface> = ({
  companySlug,
  basePath,

  taskVariants,
}) => {
  const initialValues: CreateTaskInputInterface = {
    nameI18n: {},
    variantId: taskVariants[0] ? `${taskVariants[0]._id}` : '',
    companySlug,
  };
  const [createTaskMutation] = useCreateTask(basePath);

  return (
    <Inner testId={'create-task-variant-page'}>
      <WpTitle>Создание задачи</WpTitle>

      <Formik<CreateTaskInputInterface>
        initialValues={initialValues}
        onSubmit={(values) => {
          createTaskMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <TaskMainFields taskVariants={taskVariants} />
              <FixedButtons>
                <WpButton type={'submit'} size={'small'} testId={'task-submit'}>
                  Создать
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CreateTaskForm;
