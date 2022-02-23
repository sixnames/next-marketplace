import { ShopProductBarcodeDoublesInterface, ShopProductInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { getNumWord } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import * as React from 'react';
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
        const links = getProjectLinks({
          companyId: dataItem.companyId,
          shopId: dataItem.shopId,
          shopProductId: dataItem._id,
          rubricSlug: dataItem.rubricSlug,
        });
        return (
          <WpLink
            testId={`product-link-${rowIndex}`}
            target={'_blank'}
            href={
              links.cms.companies.companyId.shops.shop.shopId.rubrics.rubricSlug.products.product
                .shopProductId.suppliers.url
            }
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

      <div className={`mb-2 text-xl font-medium`}>{catalogueCounterString}</div>

      <div className={`overflow-x-auto overflow-y-hidden`}>
        <WpTable<ShopProductInterface>
          onRowDoubleClick={(dataItem) => {
            const links = getProjectLinks({
              companyId: dataItem.companyId,
              shopId: dataItem.shopId,
              shopProductId: dataItem._id,
              rubricSlug: dataItem.rubricSlug,
            });
            window.open(
              links.cms.companies.companyId.shops.shop.shopId.rubrics.rubricSlug.products.product
                .shopProductId.suppliers.url,
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
