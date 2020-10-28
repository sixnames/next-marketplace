import React from 'react';
import {
  CmsProductConnectionFragment,
  CmsProductConnectionItemFragment,
  CmsProductFragment,
  useCreateProductConnectionMutation,
} from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import Button from '../../components/Buttons/Button';
import { CreateConnectionModalInterface } from '../../components/Modal/CreateConnectionModal/CreateConnectionModal';
import { CREATE_CONNECTION_MODAL } from '../../config/modals';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { PRODUCT_QUERY } from '../../graphql/products';
import classes from './ProductConnections.module.css';
import Accordion from '../../components/Accordion/Accordion';
import Table, { TableColumn } from '../../components/Table/Table';
import TableRowImage from '../../components/Table/TableRowImage';

export interface ProductConnectionsItemInterface {
  productId: string;
  connection: CmsProductConnectionFragment;
}

const ProductConnectionsItem: React.FC<ProductConnectionsItemInterface> = ({
  connection,
  productId,
}) => {
  console.log({ productId });
  const { attribute, products } = connection;

  const connectionName = attribute.nameString;

  const columns: TableColumn<CmsProductConnectionItemFragment>[] = [
    {
      accessor: 'node.itemId',
      headTitle: 'Арт.',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'node',
      headTitle: 'Фото',
      render: ({ cellData }) => {
        return (
          <TableRowImage
            url={cellData.mainImage}
            alt={cellData.nameString}
            title={cellData.nameString}
          />
        );
      },
    },
    {
      accessor: 'node.nameString',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'node.price',
      headTitle: 'Цена',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'node.active',
      headTitle: 'Активен',
      render: ({ cellData }) => (cellData ? 'Да' : 'Нет'),
    },
    {
      accessor: 'optionName',
      headTitle: 'Значение',
      render: ({ cellData }) => cellData,
    },
  ];

  return (
    <Accordion
      testId={`${connectionName}-connection`}
      title={connectionName}
      isOpen
      className={classes.listItem}
    >
      <Table<CmsProductConnectionItemFragment>
        columns={columns}
        data={products}
        tableTestId={`${connectionName}-connection-list`}
        testIdKey={'node.id'}
      />
    </Accordion>
  );
};

interface ProductConnectionsInterface {
  product: CmsProductFragment;
}

const ProductConnections: React.FC<ProductConnectionsInterface> = ({ product }) => {
  const { onCompleteCallback, onErrorCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
  });
  const [createProductConnectionMutation] = useCreateProductConnectionMutation({
    onCompleted: (data) => onCompleteCallback(data.createProductConnection),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [{ query: PRODUCT_QUERY, variables: { id: product.id } }],
  });

  return (
    <Inner wide>
      <div className={classes.list}>
        {product.connections.map((connection) => {
          return (
            <ProductConnectionsItem
              key={connection.id}
              productId={product.id}
              connection={connection}
            />
          );
        })}
      </div>

      <Button
        size={'small'}
        testId={`create-connection`}
        onClick={() =>
          showModal<CreateConnectionModalInterface>({
            type: CREATE_CONNECTION_MODAL,
            props: {
              product,
              confirm: (input) => {
                showLoading();
                createProductConnectionMutation({
                  variables: {
                    input,
                  },
                }).catch((e) => console.log(e));
              },
            },
          })
        }
      >
        Создать связь
      </Button>
    </Inner>
  );
};

export default ProductConnections;
