import * as React from 'react';
import { DEFAULT_PAGE, REQUEST_METHOD_POST } from '../../config/common';
import { UsersPaginationPayloadModel } from '../../db/dbModels';
import { UserInterface } from '../../db/uiInterfaces';
import { ContentItemControlsInterface } from '../button/ContentItemControls';
import FormikIndividualSearch from '../FormElements/Search/FormikIndividualSearch';
import LinkEmail from '../Link/LinkEmail';
import LinkPhone from '../Link/LinkPhone';
import Pager from '../Pager';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import WpTable, { WpTableColumn } from '../WpTable';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface UsersSearchModalControlsInterface
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

export interface UsersSearchModalInterface {
  testId?: string;
  controlsColumn?: WpTableColumn<UserInterface>;
}

const UsersSearchModal: React.FC<UsersSearchModalInterface> = ({
  testId = 'users-search-modal',
  controlsColumn = {},
}) => {
  // const { setPage, page } = useDataLayoutMethods();
  const [page, setPage] = React.useState<number>(DEFAULT_PAGE);
  const [search, setSearch] = React.useState<string | null>(null);
  const [data, setData] = React.useState<UsersPaginationPayloadModel | null>(null);

  React.useEffect(() => {
    const body = {
      search,
      page,
    };
    fetch(`/api/user/paginated`, {
      method: REQUEST_METHOD_POST,
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch(console.log);
  }, [search, page]);

  if (!data) {
    return <Spinner isNested isTransparent />;
  }

  if (!data.success || !data.payload) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { docs } = data.payload;

  const columns: WpTableColumn<UserInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData }) => cellData,
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
    ...(controlsColumn ? [controlsColumn] : []),
  ];

  return (
    <ModalFrame testId={testId} size={'wide'}>
      <ModalTitle>Выберите пользователя</ModalTitle>

      <FormikIndividualSearch
        onSubmit={setSearch}
        testId={'user'}
        onReset={() => setSearch(null)}
      />

      <WpTable<UserInterface> columns={columns} data={docs} testIdKey={'itemId'} />
      <Pager page={data.payload.page} setPage={setPage} totalPages={data.payload.totalPages} />
    </ModalFrame>
  );
};

export default UsersSearchModal;
