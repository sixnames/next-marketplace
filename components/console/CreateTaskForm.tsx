import { CreateTaskInputInterface } from 'db/dao/tasks/createTask';
import { Form, Formik } from 'formik';
import { useCreateTask } from 'hooks/mutations/useTaskMutations';
import { DEFAULT_COMPANY_SLUG } from 'lib/config/common';
import * as React from 'react';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import TaskMainFields, { TaskMainFieldsInterface } from '../FormTemplates/TaskMainFields';
import Inner from '../Inner';
import WpTitle from '../WpTitle';

export interface CreateTaskFormInterface extends TaskMainFieldsInterface {
  companySlug?: string;
}

const CreateTaskForm: React.FC<CreateTaskFormInterface> = ({ companySlug, taskVariants }) => {
  const initialValues: CreateTaskInputInterface = {
    nameI18n: {},
    variantId: taskVariants[0] ? `${taskVariants[0]._id}` : '',
    companySlug: companySlug || DEFAULT_COMPANY_SLUG,
  };
  const [createTaskMutation] = useCreateTask();

  return (
    <Inner testId={'create-task-page'}>
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
