import { useRouter } from 'next/router';
import * as React from 'react';
import { CREATE_PROMO_CODE_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { PromoCodeModel } from '../../db/dbModels';
import { CompanyInterface, PromoInterface } from '../../db/uiInterfaces';
import { getCmsCompanyLinks } from '../../lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import WpLink from '../Link/WpLink';
import { CreatePromoCodeModalInterface } from '../Modal/CreatePromoCodeModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsolePromoCodeListInterface {
  pageCompany: CompanyInterface;
  promoCodes: PromoCodeModel[];
  promo: PromoInterface;
  basePath?: string;
}

const ConsolePromoCodeList: React.FC<ConsolePromoCodeListInterface> = ({
  pageCompany,
  promo,
  promoCodes,
  basePath,
}) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const columns: WpTableColumn<PromoCodeModel>[] = [
    {
      headTitle: 'Код',
      render: ({ dataItem }) => {
        const links = getCmsCompanyLinks({
          basePath,
          companyId: pageCompany._id,
          promoId: promo._id,
          promoCodeId: dataItem._id,
        });
        return (
          <WpLink href={links.promo.code.root} testId={dataItem.code}>
            {dataItem.code}
          </WpLink>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.code}
              updateTitle={'Редактировать промо-код'}
              updateHandler={() => {
                const links = getCmsCompanyLinks({
                  companyId: pageCompany._id,
                  promoId: promo._id,
                  promoCodeId: dataItem._id,
                });
                router.push(links.promo.code.root).catch(console.log);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Inner>
      <div className='relative'>
        <div className='overflow-y-hidden overflow-x-auto'>
          <WpTable<PromoCodeModel>
            columns={columns}
            data={promoCodes}
            onRowDoubleClick={(dataItem) => {
              const links = getCmsCompanyLinks({
                companyId: pageCompany._id,
                promoId: promo._id,
                promoCodeId: dataItem._id,
              });
              router.push(links.promo.code.root).catch(console.log);
            }}
          />
        </div>

        <FixedButtons>
          <WpButton
            size={'small'}
            onClick={() => {
              showModal<CreatePromoCodeModalInterface>({
                variant: CREATE_PROMO_CODE_MODAL,
                props: {
                  promoId: `${promo._id}`,
                },
              });
            }}
          >
            Добавить промо-код
          </WpButton>
        </FixedButtons>
      </div>
    </Inner>
  );
};

export default ConsolePromoCodeList;
