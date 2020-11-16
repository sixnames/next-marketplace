import React from 'react';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createCompanySchema } from '@yagu/validation';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { CreateCompanyInput, UserInListFragment } from '../../generated/apolloComponents';
import { Form, Formik } from 'formik';
import FormikDropZone from '../../components/FormElements/Upload/FormikDropZone';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import ModalButtons from '../../components/Modal/ModalButtons';
import Button from '../../components/Buttons/Button';
import Inner from '../../components/Inner/Inner';
import { UsersSearchModalInterface } from '../../components/Modal/UsersSearchModal/UsersSearchModal';
import { USERS_SEARCH_MODAL } from '../../config/modals';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../../components/ContentItemControls/ContentItemControls';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import InputLine from '../../components/FormElements/Input/InputLine';
// import classes from './CreateCompanyContent.module.css';

interface UsersSearchModalControlsInterface
  extends Omit<
    ContentItemControlsInterface,
    | 'isCreateDisabled'
    | 'isUpdateDisabled'
    | 'isDeleteDisabled'
    | 'createHandler'
    | 'updateHandler'
    | 'deleteHandler'
  > {
  createHandler?: (user: UserInListFragment) => void;
  updateHandler?: (user: UserInListFragment) => void;
  deleteHandler?: (user: UserInListFragment) => void;
  isCreateDisabled?: (user: UserInListFragment) => boolean;
  isUpdateDisabled?: (user: UserInListFragment) => boolean;
  isDeleteDisabled?: (user: UserInListFragment) => boolean;
}

interface CompanyFormInitialValuesInterface extends Omit<CreateCompanyInput, 'owner' | 'staff'> {
  owner: UserInListFragment | null;
  staff: UserInListFragment[];
}

const CreateCompanyContent: React.FC = () => {
  const validationSchema = useValidationSchema({
    schema: createCompanySchema,
  });

  const { showLoading, showModal, hideModal } = useMutationCallbacks({
    withModal: true,
  });

  const initialValues: CompanyFormInitialValuesInterface = {
    nameString: '',
    contacts: {
      emails: [''],
      phones: [''],
    },
    logo: [],
    owner: null,
    staff: [],
  };

  function showUsersSearchModal({
    createTitle,
    updateTitle,
    deleteTitle,
    createHandler,
    updateHandler,
    deleteHandler,
    disabled,
    isDeleteDisabled,
    isCreateDisabled,
    isUpdateDisabled,
  }: UsersSearchModalControlsInterface) {
    showModal<UsersSearchModalInterface>({
      type: USERS_SEARCH_MODAL,
      props: {
        controlsColumn: {
          render: ({ dataItem }) => {
            return (
              <ContentItemControls
                justifyContent={'flex-end'}
                testId={dataItem.itemId}
                createTitle={createTitle}
                updateTitle={updateTitle}
                deleteTitle={deleteTitle}
                createHandler={createHandler ? () => createHandler(dataItem) : undefined}
                updateHandler={updateHandler ? () => updateHandler(dataItem) : undefined}
                deleteHandler={deleteHandler ? () => deleteHandler(dataItem) : undefined}
                disabled={disabled}
                isDeleteDisabled={isDeleteDisabled ? isDeleteDisabled(dataItem) : undefined}
                isCreateDisabled={isCreateDisabled ? isCreateDisabled(dataItem) : undefined}
                isUpdateDisabled={isUpdateDisabled ? isUpdateDisabled(dataItem) : undefined}
              />
            );
          },
        },
      },
    });
  }

  const logoInputFilesLimit = 1;

  return (
    <DataLayoutContentFrame testId={'create-company-content'}>
      <Inner>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            console.log(values);
          }}
        >
          {({ values, setFieldValue }) => {
            const { owner } = values;

            return (
              <Form>
                <FormikDropZone
                  label={'Логотип'}
                  name={'logo'}
                  testId={'company-logo'}
                  limit={logoInputFilesLimit}
                  isRequired
                  showInlineError
                />

                <FormikInput
                  label={'Название'}
                  name={'nameString'}
                  testId={'nameString'}
                  showInlineError
                  isRequired
                />

                <FormikMultiLineInput
                  label={'Email'}
                  name={'contacts.emails'}
                  type={'email'}
                  testId={'email'}
                  isRequired
                  showInlineError
                />

                <FormikMultiLineInput
                  label={'Телефон'}
                  name={'contacts.phones'}
                  type={'tel'}
                  testId={'phone'}
                  isRequired
                  showInlineError
                />

                <FakeInput value={owner?.fullName} label={'Владелец'} testId={'owner'} />

                <InputLine name={''} labelTag={'div'}>
                  <Button
                    theme={'secondary'}
                    size={'small'}
                    testId={'add-owner'}
                    onClick={() =>
                      showUsersSearchModal({
                        createTitle: 'Назначить владельцем компании',
                        createHandler: (user) => {
                          setFieldValue('owner', user);
                          hideModal();
                        },
                      })
                    }
                  >
                    {owner ? 'Изменить владельца' : 'Выбрать владельца'}
                  </Button>
                </InputLine>

                <ModalButtons>
                  <Button type={'submit'} testId={'new-company-submit'}>
                    Создать
                  </Button>
                </ModalButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </DataLayoutContentFrame>
  );
};

export default CreateCompanyContent;
