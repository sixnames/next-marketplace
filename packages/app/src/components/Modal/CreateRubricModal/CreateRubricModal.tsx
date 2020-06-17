import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import FormikInput from '../../FormElements/Input/FormikInput';
import { Form, Formik } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import Button from '../../Buttons/Button';
import {
  CreateRubricInput,
  useGetAllRubricVariantsQuery,
} from '../../../generated/apolloComponents';
import Spinner from '../../Spinner/Spinner';
import RequestError from '../../RequestError/RequestError';
import { useAppContext } from '../../../context/appContext';
import { createRubricInputSchema } from '@rg/validation';
import { RUBRIC_LEVEL_TWO } from '@rg/config';

interface CreateRubricModalInterface {
  confirm: (values: CreateRubricInput) => void;
  rubrics: any[];
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm, rubrics }) => {
  const { hideModal } = useAppContext();
  const { data, loading, error } = useGetAllRubricVariantsQuery();

  if (loading) return <Spinner />;
  if (error || !data || !data.getAllRubricVariants) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Добавление рубрики</ModalTitle>

      <Formik
        validationSchema={createRubricInputSchema}
        initialValues={{
          name: '',
          catalogueName: '',
          type: null,
          parent: null,
          subParent: null,
        }}
        onSubmit={(values) => {
          const { subParent, ...restValues } = values;
          const result = { ...restValues };

          if (subParent) {
            result.parent = subParent;
          }

          confirm({
            ...result,
            name: [{ key: 'ru', value: result.name }],
            catalogueName: [{ key: 'ru', value: result.catalogueName }],
          });
        }}
      >
        {({ values }) => {
          const { parent } = values;
          const currentParent = rubrics.find(({ id }) => id === parent);

          return (
            <Form>
              <FormikInput
                isRequired
                showInlineError
                label={'Название'}
                name={'name'}
                testId={'rubric-name'}
              />

              <FormikInput
                isRequired
                showInlineError
                label={'Название каталога'}
                name={'catalogueName'}
                testId={'catalogue-name'}
              />

              {!parent && (
                <FormikSelect
                  isRequired
                  showInlineError
                  firstOption={'Не выбран'}
                  label={'Тип рубрики'}
                  name={'type'}
                  testId={'rubric-type'}
                  options={data?.getAllRubricVariants || []}
                />
              )}

              <FormikSelect
                firstOption={'Не выбрано'}
                label={'Родительская рубрика'}
                name={'parent'}
                testId={'parent'}
                options={rubrics}
              />

              {currentParent && currentParent.level !== RUBRIC_LEVEL_TWO && (
                <FormikSelect
                  firstOption={'Не выбрано'}
                  label={'Подрубрика'}
                  name={'subParent'}
                  options={currentParent.children}
                  testId={'subParent'}
                />
              )}

              <ModalButtons>
                <Button type={'submit'} testId={'rubric-submit'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateRubricModal;
