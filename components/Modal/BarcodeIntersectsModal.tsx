import * as React from 'react';
import { BarcodeDoublesInterface, ProductSummaryInterface } from '../../db/uiInterfaces';
import { alwaysArray } from '../../lib/arrayUtils';
import { getNumWord } from '../../lib/i18n';
import { getCmsLinks } from '../../lib/linkUtils';
import WpLink from '../Link/WpLink';
import TableRowImage from '../TableRowImage';
import WpTable, { WpTableColumn } from '../WpTable';
import WpTitle from '../WpTitle';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

interface BarcodeIntersectsModalConsumerInterface {
  barcodeDouble: BarcodeDoublesInterface;
}

const BarcodeIntersectsModalConsumer: React.FC<BarcodeIntersectsModalConsumerInterface> = ({
  barcodeDouble,
}) => {
  const { barcode, products } = barcodeDouble;

  const columns: WpTableColumn<ProductSummaryInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        const links = getCmsLinks({
          rubricSlug: dataItem.rubricSlug,
          productId: dataItem._id,
        });
        return (
          <WpLink
            testId={`product-link-${rowIndex}`}
            href={links.rubrics.product.root}
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
      <WpTitle size={'small'} tag={'div'}>
        {barcode}
      </WpTitle>

      <div className={`mb-2 text-xl font-medium`}>{catalogueCounterString}</div>

      <div className={`overflow-x-auto overflow-y-hidden`}>
        <WpTable<ProductSummaryInterface>
          onRowDoubleClick={(dataItem) => {
            const links = getCmsLinks({
              rubricSlug: dataItem.rubricSlug,
              productId: dataItem._id,
            });
            window.open(links.rubrics.product.root, '_blank');
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
