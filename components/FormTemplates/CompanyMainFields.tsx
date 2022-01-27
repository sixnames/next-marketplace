import * as React from 'react';
import { useFormikContext } from 'formik';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import InputLine from '../../components/FormElements/Input/InputLine';
import { CONFIRM_MODAL, USERS_SEARCH_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { UserInterface } from '../../db/uiInterfaces';
import { UpdateCompanyInput } from '../../generated/apolloComponents';
import { getCmsLinks } from '../../lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import WpButton from '../button/WpButton';
import LinkEmail from '../Link/LinkEmail';
import LinkPhone from '../Link/LinkPhone';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import {
  UsersSearchModalControlsInterface,
  UsersSearchModalInterface,
} from '../Modal/UsersSearchModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface CompanyFormMainValuesInterface extends Omit<UpdateCompanyInput, 'companyId'> {
  owner: UserInterface | null;
  staff: UserInterface[];
}

interface CompanyMainFieldsInterface {
  inConsole?: boolean;
  hidePersonnelInputs?: boolean;
  addStaffUserHandler?: (user: UserInterface) => void;
  setOwnerHandler?: (user: UserInterface) => void;
  deleteStaffUserHandler?: (userId: string) => void;
}

const CompanyMainFields: React.FC<CompanyMainFieldsInterface> = ({
  inConsole,
  setOwnerHandler,
  addStaffUserHandler,
  hidePersonnelInputs,
  deleteStaffUserHandler,
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
        const links = getCmsLinks({
          userId: dataItem._id,
        });
        return <WpLink href={links.user.root}>{cellData}</WpLink>;
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
    {
      render: ({ dataItem }) => {
        if (!deleteStaffUserHandler) {
          return null;
        }
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              deleteTitle={'Удалить сотрудника'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-company-staff-modal',
                    message: `Вы уверенны, что хотите удалить сотрудника ${dataItem.fullName}?`,
                    confirm: () => {
                      deleteStaffUserHandler(`${dataItem._id}`);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
      isHidden: !deleteStaffUserHandler,
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

      {hidePersonnelInputs ? null : (
        <FakeInput value={owner?.fullName} label={'Владелец'} testId={'ownerId'} />
      )}

      {hidePersonnelInputs || inConsole ? null : (
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

      {hidePersonnelInputs ? null : (
        <InputLine label={'Персонал компании'} labelTag={'div'}>
          <WpTable<UserInterface>
            columns={columns}
            data={staff}
            testIdKey={'itemId'}
            emptyMessage={'Список пуст'}
          />
        </InputLine>
      )}

      {hidePersonnelInputs || inConsole ? null : (
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
