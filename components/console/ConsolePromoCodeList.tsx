import { PromoCodeModel } from 'db/dbModels';
import { CompanyInterface, PromoInterface } from 'db/uiInterfaces';
import { useDeletePromoCode } from 'hooks/mutations/usePromoMutations';
import { useBasePath } from 'hooks/useBasePath';
import { CONFIRM_MODAL, CREATE_PROMO_CODE_MODAL } from 'lib/config/modalVariants';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import Inner from '../Inner';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { CreatePromoCodeModalInterface } from '../Modal/CreatePromoCodeModal';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsolePromoCodeListInterface {
  pageCompany: CompanyInterface;
  promoCodes: PromoCodeModel[];
  promo: PromoInterface;
}

const ConsolePromoCodeList: React.FC<ConsolePromoCodeListInterface> = ({ promo, promoCodes }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deletePromoCodeMutation] = useDeletePromoCode();
  const basePath = useBasePath('code');

  const columns: WpTableColumn<PromoCodeModel>[] = [
    {
      headTitle: 'Код',
      render: ({ dataItem }) => {
        return (
          <WpLink href={`${basePath}/${dataItem._id}`} testId={dataItem.code}>
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
                router.push(`${basePath}/${dataItem._id}`).catch(console.log);
              }}
              deleteTitle={'Удалить промо-код'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-promo-code-modal',
                    message: `Вы уверенны, что хотите удалить промо-код ${dataItem.code}`,
                    confirm: () => {
                      deletePromoCodeMutation({
                        _id: `${dataItem._id}`,
                      }).catch(console.log);
                    },
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Inner testId={'promo-code-list-page'}>
      <div className='relative'>
        <div className='overflow-x-auto overflow-y-hidden'>
          <WpTable<PromoCodeModel>
            columns={columns}
            data={promoCodes}
            onRowDoubleClick={(dataItem) => {
              router.push(`${basePath}/${dataItem._id}`).catch(console.log);
            }}
          />
        </div>

        <FixedButtons>
          <WpButton
            testId={'create-promo-code'}
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
