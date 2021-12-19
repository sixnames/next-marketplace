import * as React from 'react';
import { useFormikContext } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import InputLine from '../../components/FormElements/Input/InputLine';
import { ROUTE_CMS } from '../../config/common';
import { USERS_SEARCH_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { UserInterface } from '../../db/uiInterfaces';
import { UpdateCompanyInput } from '../../generated/apolloComponents';
import ContentItemControls, { ContentItemControlsInterface } from '../button/ContentItemControls';
import WpButton from '../button/WpButton';
import LinkEmail from '../Link/LinkEmail';
import LinkPhone from '../Link/LinkPhone';
import WpLink from '../Link/WpLink';
import { UsersSearchModalInterface } from '../Modal/UsersSearchModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface CompanyFormMainValuesInterface extends Omit<UpdateCompanyInput, 'companyId'> {
  owner: UserInterface | null;
  staff: UserInterface[];
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
  createHandler?: (user: UserInterface) => void;
  updateHandler?: (user: UserInterface) => void;
  deleteHandler?: (user: UserInterface) => void;
  isCreateDisabled?: (user: UserInterface) => boolean;
  isUpdateDisabled?: (user: UserInterface) => boolean;
  isDeleteDisabled?: (user: UserInterface) => boolean;
}

interface CompanyMainFieldsInterface {
  inConsole?: boolean;
  addStaffUserHandler?: (user: UserInterface) => void;
  setOwnerHandler?: (user: UserInterface) => void;
}

const CompanyMainFields: React.FC<CompanyMainFieldsInterface> = ({
  inConsole,
  setOwnerHandler,
  addStaffUserHandler,
}) => {
  const { showModal, hideModal } = useAppContext();
  const { values, setFieldValue } = useFormikContext<CompanyFormMainValuesInterface>();

  const { owner, staff } = values;

  const columns: WpTableColumn<UserInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => {
        if (inConsole) {
          return cellData;
        }
        return <WpLink href={`${ROUTE_CMS}/users/user/${dataItem._id}`}>{cellData}</WpLink>;
      },
    },
    {
      accessor: 'fullName',
      headTitle: 'Имя',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'formattedPhone',
      headTitle: 'Телефон',
      render: ({ cellData }) => <LinkPhone value={cellData} />,
    },
    {
      accessor: 'email',
      headTitle: 'Email',
      render: ({ cellData }) => <LinkEmail value={cellData} />,
    },
    {
      accessor: 'role',
      headTitle: 'Роль',
      render: ({ cellData }) => cellData.name,
    },
  ];

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
      <FormikInput label={'Название'} name={'name'} testId={'name'} showInlineError isRequired />

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

      <FormikInput name={'domain'} label={'Домен'} testId={'domain'} showInlineError />

      <FakeInput value={owner?.fullName} label={'Владелец'} testId={'ownerId'} />

      {inConsole ? null : (
        <InputLine labelTag={'div'}>
          <WpButton
            theme={'secondary'}
            size={'small'}
            testId={'add-owner'}
            onClick={() =>
              showUsersSearchModal({
                createTitle: 'Назначить владельцем компании',
                createHandler: (user) => {
                  if (setOwnerHandler) {
                    setOwnerHandler(user);
                  } else {
                    setFieldValue('owner', user);
                    hideModal();
                  }
                },
              })
            }
          >
            {owner ? 'Изменить владельца' : 'Выбрать владельца'}
          </WpButton>
        </InputLine>
      )}

      <InputLine label={'Персонал компании'} labelTag={'div'}>
        <WpTable<UserInterface>
          columns={columns}
          data={staff}
          testIdKey={'itemId'}
          emptyMessage={'Список пуст'}
        />
      </InputLine>

      {inConsole ? null : (
        <InputLine labelTag={'div'}>
          <WpButton
            theme={'secondary'}
            size={'small'}
            testId={'add-staff'}
            onClick={() =>
              showUsersSearchModal({
                createTitle: 'Добавить в список сотрудников компании',
                createHandler: (user) => {
                  if (addStaffUserHandler) {
                    addStaffUserHandler(user);
                  } else {
                    setFieldValue(`staff[${staff.length}]`, user);
                    hideModal();
                  }
                },
              })
            }
          >
            {'Добавить сотрудника'}
          </WpButton>
        </InputLine>
      )}
    </React.Fragment>
  );
};

export default CompanyMainFields;
