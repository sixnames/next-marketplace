import Link from 'components/Link/Link';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { BarcodeDoublesInterface, ProductInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { getNumWord } from 'lib/i18n';
import * as React from 'react';

interface BarcodeIntersectsModalConsumerInterface {
  barcodeDouble: BarcodeDoublesInterface;
}

const BarcodeIntersectsModalConsumer: React.FC<BarcodeIntersectsModalConsumerInterface> = ({
  barcodeDouble,
}) => {
  const { barcode, products } = barcodeDouble;

  const columns: TableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <Link
            testId={`product-link-${rowIndex}`}
            href={`${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`}
            target={'_blank'}
          >
            {dataItem.itemId}
          </Link>
        );
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            src={`${dataItem.mainImage}`}
            alt={`${dataItem.snippetTitle}`}
            title={`${dataItem.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => {
        const barcode = alwaysArray(cellData);
        return (
          <div>
            {barcode.map((barcodeItem, index) => {
              const isLastItem = barcode.length === index + 1;
              return (
                <span key={index}>
                  {barcodeItem}
                  {isLastItem ? '' : ', '}
                </span>
              );
            })}
          </div>
        );
      },
    },
  ];

  const catalogueCounterString = React.useMemo(() => {
    const counter = products.length;

    if (counter < 1) {
      return `Найдено ${counter} наименований`;
    }
    const catalogueCounterPostfix = getNumWord(counter, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${counter} ${catalogueCounterPostfix}`;
  }, [products]);

  return (
    <div className='mb-16'>
      <Title size={'small'} tag={'div'}>
        {barcode}
      </Title>

      <div className={`text-xl font-medium mb-2`}>{catalogueCounterString}</div>

      <div className={`overflow-x-auto overflow-y-hidden`}>
        <Table<ProductInterface>
          onRowDoubleClick={(dataItem) => {
            window.open(
              `${ROUTE_CMS}/rubrics/${dataItem.rubricId}/products/product/${dataItem._id}`,
              '_blank',
            );
          }}
          columns={columns}
          data={products}
          testIdKey={'_id'}
        />
      </div>
    </div>
  );
};

export interface BarcodeIntersectsModalInterface {
  barcodeDoubles: BarcodeDoublesInterface[];
}

const BarcodeIntersectsModal: React.FC<BarcodeIntersectsModalInterface> = ({ barcodeDoubles }) => {
  return (
    <ModalFrame size={'midWide'}>
      <ModalTitle>Пересечения по штрих-коду</ModalTitle>
      {barcodeDoubles.map((barcodeDouble) => {
        return (
          <BarcodeIntersectsModalConsumer
            key={barcodeDouble.barcode}
            barcodeDouble={barcodeDouble}
          />
        );
      })}
    </ModalFrame>
  );
};

export default BarcodeIntersectsModal;
