import React from 'react';
import { ObjectSchema } from 'yup';
import { UpdateCompanyInput, UserInListFragment } from '../../generated/apolloComponents';
import { useAppContext } from '../../context/appContext';
import { Form, Formik, useFormikContext } from 'formik';
import useUsersListColumns from '../../hooks/useUsersListColumns';
import { UsersSearchModalInterface } from '../../components/Modal/UsersSearchModal/UsersSearchModal';
import { USERS_SEARCH_MODAL } from '../../config/modals';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../../components/ContentItemControls/ContentItemControls';
import FormikDropZone from '../../components/FormElements/Upload/FormikDropZone';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import InputLine from '../../components/FormElements/Input/InputLine';
import Button from '../../components/Buttons/Button';
import Table from '../../components/Table/Table';
import ModalButtons from '../../components/Modal/ModalButtons';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';

type CompanyFormPayloadInterface = Omit<UpdateCompanyInput, 'id'>;

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

interface CompanyFormInitialValuesInterface
  extends Omit<UpdateCompanyInput, 'owner' | 'staff' | 'id'> {
  owner: UserInListFragment | null;
  staff: UserInListFragment[];
}

interface CompanyFormConsumerInterface {
  submitButtonText?: string;
}

interface CompanyFormInterface extends CompanyFormConsumerInterface {
  validationSchema: ObjectSchema;
  initialValues: CompanyFormInitialValuesInterface;
  onSubmitHandler: (values: CompanyFormPayloadInterface) => void;
}

const CompanyFormConsumer: React.FC<CompanyFormConsumerInterface> = ({
  submitButtonText = 'Создать',
}) => {
  const { showModal, hideModal } = useAppContext();
  const { values, setFieldValue } = useFormikContext<CompanyFormInitialValuesInterface>();
  const columns = useUsersListColumns();

  const { owner, staff } = values;
  const logoInputFilesLimit = 1;

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

      <InputLine labelTag={'div'}>
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

      <InputLine label={'Персонал компании'} labelTag={'div'}>
        <Table<UserInListFragment>
          columns={columns}
          data={staff}
          testIdKey={'itemId'}
          emptyMessage={'Список пуст'}
        />
      </InputLine>

      <InputLine labelTag={'div'}>
        <Button
          theme={'secondary'}
          size={'small'}
          testId={'add-staff'}
          onClick={() =>
            showUsersSearchModal({
              createTitle: 'Добавить в список сотрудников компании',
              createHandler: (user) => {
                setFieldValue(`staff[${staff.length}]`, user);
                hideModal();
              },
            })
          }
        >
          {'Добавить сотрудника'}
        </Button>
      </InputLine>

      <ModalButtons>
        <Button type={'submit'} testId={'company-submit'}>
          {submitButtonText}
        </Button>
      </ModalButtons>
    </Form>
  );
};

const CompanyForm: React.FC<CompanyFormInterface> = ({
  initialValues,
  validationSchema,
  onSubmitHandler,
  submitButtonText,
}) => {
  const { showErrorNotification } = useMutationCallbacks();

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={(values) => {
        if (!values.owner) {
          showErrorNotification({
            title: 'Добавьте владельца компании',
          });
          return;
        }

        onSubmitHandler({
          ...values,
          owner: values.owner.id,
          staff: values.staff.map(({ id }) => id),
        });
      }}
    >
      {() => {
        return <CompanyFormConsumer submitButtonText={submitButtonText} />;
      }}
    </Formik>
  );
};

export default CompanyForm;
