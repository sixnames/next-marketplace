import Link from 'components/Link/Link';
import LinkEmail from 'components/Link/LinkEmail';
import LinkPhone from 'components/Link/LinkPhone';
import Pager from 'components/Pager';
import { DEFAULT_PAGE, REQUEST_METHOD_POST, ROUTE_CMS } from 'config/common';
import { UsersPaginationPayloadModel } from 'db/dbModels';
import { UserInterface } from 'db/uiInterfaces';
import * as React from 'react';
import Spinner from 'components/Spinner';
import RequestError from 'components/RequestError';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import FormikIndividualSearch from 'components/FormElements/Search/FormikIndividualSearch';
import Table, { TableColumn } from 'components/Table';

export interface UsersSearchModalInterface {
  testId?: string;
  controlsColumn?: TableColumn<UserInterface>;
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
    return <Spinner isNested />;
  }

  if (!data.success || !data.payload) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  const { docs } = data.payload;

  const columns: TableColumn<UserInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/users/user/${dataItem._id}`}>{cellData}</Link>
      ),
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

      <Table<UserInterface> columns={columns} data={docs} testIdKey={'itemId'} />
      <Pager page={data.payload.page} setPage={setPage} totalPages={data.payload.totalPages} />
    </ModalFrame>
  );
};

export default UsersSearchModal;
