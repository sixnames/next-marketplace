import * as React from 'react';
import { ROUTE_CMS } from '../../config/common';
import { ShopProductBarcodeDoublesInterface, ShopProductInterface } from '../../db/uiInterfaces';
import { alwaysArray } from '../../lib/arrayUtils';
import { getNumWord } from '../../lib/i18n';
import WpLink from '../Link/WpLink';
import TableRowImage from '../TableRowImage';
import WpTable, { WpTableColumn } from '../WpTable';
import WpTitle from '../WpTitle';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

interface BarcodeIntersectsModalConsumerInterface {
  barcodeDouble: ShopProductBarcodeDoublesInterface;
}

const BarcodeIntersectsModalConsumer: React.FC<BarcodeIntersectsModalConsumerInterface> = ({
  barcodeDouble,
}) => {
  const { barcode, products } = barcodeDouble;

  const columns: WpTableColumn<ShopProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <WpLink
            testId={`product-link-${rowIndex}`}
            href={`${ROUTE_CMS}/companies/${dataItem.companyId}/shops/shop/${dataItem.shopId}/products/product/${dataItem._id}/suppliers`}
            target={'_blank'}
          >
            {dataItem.itemId}
          </WpLink>
        );
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            src={`${dataItem.summary?.mainImage}`}
            alt={`${dataItem.summary?.snippetTitle}`}
            title={`${dataItem.summary?.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'product.snippetTitle',
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
      <WpTitle size={'small'} tag={'div'}>
        {barcode}
      </WpTitle>

      <div className={`text-xl font-medium mb-2`}>{catalogueCounterString}</div>

      <div className={`overflow-x-auto overflow-y-hidden`}>
        <WpTable<ShopProductInterface>
          onRowDoubleClick={(dataItem) => {
            window.open(
              `${ROUTE_CMS}/companies/${dataItem.companyId}/shops/shop/${dataItem.shopId}/products/product/${dataItem._id}/suppliers`,
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

export interface ShopProductBarcodeIntersectsModalInterface {
  barcodeDoubles: ShopProductBarcodeDoublesInterface[];
}

const ShopProductBarcodeIntersectsModal: React.FC<ShopProductBarcodeIntersectsModalInterface> = ({
  barcodeDoubles,
}) => {
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

export default ShopProductBarcodeIntersectsModal;
