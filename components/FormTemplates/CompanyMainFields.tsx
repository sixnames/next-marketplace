import * as React from 'react';
import { UpdateCompanyInput, UserInListFragment } from 'generated/apolloComponents';
import { useAppContext } from 'context/appContext';
import { useFormikContext } from 'formik';
import useUsersListColumns from '../../hooks/useUsersListColumns';
import { UsersSearchModalInterface } from 'components/Modal/UsersSearchModal/UsersSearchModal';
import { USERS_SEARCH_MODAL } from 'config/modals';
import ContentItemControls, {
  ContentItemControlsInterface,
} from '../../components/ContentItemControls/ContentItemControls';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import InputLine from '../../components/FormElements/Input/InputLine';
import Button from '../../components/Buttons/Button';
import Table from '../../components/Table/Table';

export interface CompanyFormMainValuesInterface extends Omit<UpdateCompanyInput, 'companyId'> {
  owner: UserInListFragment | null;
  staff: UserInListFragment[];
}

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

const CompanyMainFields: React.FC = () => {
  const { showModal, hideModal } = useAppContext();
  const { values, setFieldValue } = useFormikContext<CompanyFormMainValuesInterface>();
  const columns = useUsersListColumns();

  const { owner, staff } = values;

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
      variant: USERS_SEARCH_MODAL,
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
    <React.Fragment>
      <FormikInput
        isHorizontal
        label={'Название'}
        name={'name'}
        testId={'name'}
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

      <FormikInput name={'domain'} label={'Домен'} testId={'domain'} />

      <FakeInput value={owner?.fullName} label={'Владелец'} testId={'ownerId'} />

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
    </React.Fragment>
  );
};

export default CompanyMainFields;
