import { UserInterface } from 'db/uiInterfaces';
import { useFormikContext } from 'formik';
import { UpdateCompanyInput } from 'generated/apolloComponents';
import { useUserSearchModal } from 'hooks/useUserSearchModal';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import * as React from 'react';
import FakeInput from '../../components/FormElements/Input/FakeInput';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import FormikMultiLineInput from '../../components/FormElements/Input/FormikMultiLineInput';
import InputLine from '../../components/FormElements/Input/InputLine';
import ContentItemControls from '../button/ContentItemControls';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import LinkEmail from '../Link/LinkEmail';
import LinkPhone from '../Link/LinkPhone';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
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
  const showUsersSearchModal = useUserSearchModal();
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
        const links = getProjectLinks({
          userId: dataItem._id,
        });
        return <WpLink href={links.cms.users.user.userId.url}>{cellData}</WpLink>;
      },
    },
    {
      accessor: 'fullName',
      headTitle: '??????',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'formattedPhone',
      headTitle: '??????????????',
      render: ({ cellData }) => <LinkPhone value={cellData} />,
    },
    {
      accessor: 'email',
      headTitle: 'Email',
      render: ({ cellData }) => <LinkEmail value={cellData} />,
    },
    {
      accessor: 'role',
      headTitle: '????????',
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
              deleteTitle={'?????????????? ????????????????????'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-company-staff-modal',
                    message: `???? ????????????????, ?????? ???????????? ?????????????? ???????????????????? ${dataItem.fullName}?`,
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

  return (
    <React.Fragment>
      <FormikInput label={'????????????????'} name={'name'} testId={'name'} showInlineError isRequired />

      <FormikMultiLineInput
        label={'Email'}
        name={'contacts.emails'}
        type={'email'}
        testId={'email'}
        isRequired
        showInlineError
      />

      <FormikMultiLineInput
        label={'??????????????'}
        name={'contacts.phones'}
        type={'tel'}
        testId={'phone'}
        isRequired
        showInlineError
      />

      <FormikInput name={'domain'} label={'??????????'} testId={'domain'} showInlineError />

      {hidePersonnelInputs ? null : (
        <FakeInput value={owner?.fullName} label={'????????????????'} testId={'ownerId'} />
      )}

      {hidePersonnelInputs || inConsole ? null : (
        <InputLine labelTag={'div'}>
          <WpButton
            theme={'secondary'}
            size={'small'}
            testId={'add-owner'}
            onClick={() =>
              showUsersSearchModal({
                createTitle: '?????????????????? ???????????????????? ????????????????',
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
            {owner ? '???????????????? ??????????????????' : '?????????????? ??????????????????'}
          </WpButton>
        </InputLine>
      )}

      {hidePersonnelInputs ? null : (
        <InputLine label={'???????????????? ????????????????'} labelTag={'div'}>
          <WpTable<UserInterface>
            columns={columns}
            data={staff}
            testIdKey={'itemId'}
            emptyMessage={'???????????? ????????'}
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
                createTitle: '???????????????? ?? ???????????? ?????????????????????? ????????????????',
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
            {'???????????????? ????????????????????'}
          </WpButton>
        </InputLine>
      )}
    </React.Fragment>
  );
};

export default CompanyMainFields;
