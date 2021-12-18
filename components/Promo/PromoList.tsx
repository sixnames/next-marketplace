import WpButton from 'components/button/WpButton';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import FormattedDateTime from 'components/FormattedDateTime';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreatePromoModalInterface } from 'components/Modal/CreatePromoModal';
import Percent from 'components/Percent';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { CONFIRM_MODAL, CREATE_PROMO_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { CompanyInterface, PromoInterface } from 'db/uiInterfaces';
import { useDeletePromo } from 'hooks/mutations/usePromoMutations';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface PromoListInterface {
  promoList: PromoInterface[];
  pageCompany: CompanyInterface;
  basePath: string;
}

const PromoList: React.FC<PromoListInterface> = ({ promoList, basePath, pageCompany }) => {
  const router = useRouter();
  const { showModal } = useAppContext();
  const [deletePromo] = useDeletePromo();

  const columns: WpTableColumn<PromoInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'discountPercent',
      headTitle: 'Скидка',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      accessor: 'cashbackPercent',
      headTitle: 'Кэшбэк',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      accessor: 'startAt',
      headTitle: 'Дата начала',
      render: ({ cellData }) => <FormattedDateTime value={cellData} />,
    },
    {
      accessor: 'endAt',
      headTitle: 'Дата окончания',
      render: ({ cellData }) => <FormattedDateTime value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              updateTitle={'Редактировать акцию'}
              updateHandler={() => {
                router.push(`${basePath}/details/${dataItem._id}`).catch(console.log);
              }}
              deleteTitle={'Удалить акцию'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-promo-modal',
                    message: `Вы уверенны, что хотите удалить акцию ${dataItem.name}?`,
                    confirm: () => {
                      deletePromo({
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
    <div className='relative' data-cy={'promo-list'}>
      <div className='overflow-y-hidden overflow-x-auto'>
        <WpTable<PromoInterface>
          testIdKey={'name'}
          columns={columns}
          data={promoList}
          onRowDoubleClick={(dataItem) => {
            router.push(`${basePath}/details/${dataItem._id}`).catch(console.log);
          }}
        />
      </div>
      <FixedButtons>
        <WpButton
          testId={'create-promo'}
          onClick={() => {
            showModal<CreatePromoModalInterface>({
              variant: CREATE_PROMO_MODAL,
              props: {
                pageCompany,
              },
            });
          }}
        >
          Создать акцию
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default PromoList;
