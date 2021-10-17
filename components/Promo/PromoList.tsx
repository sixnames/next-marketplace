import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import FixedButtons from 'components/FixedButtons';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Percent from 'components/Percent';
import Table, { TableColumn } from 'components/Table';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import { CompanyInterface, PromoInterface } from 'db/uiInterfaces';
import { useDeletePromo } from 'hooks/mutations/usePromoMutations';
import * as React from 'react';

export interface PromoListInterface {
  promoList: PromoInterface[];
  currentCompany: CompanyInterface;
}

const PromoList: React.FC<PromoListInterface> = ({ promoList }) => {
  const { showModal } = useAppContext();
  const [deletePromo] = useDeletePromo();

  const columns: TableColumn<PromoInterface>[] = [
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
      headTitle: 'Кешбек',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.name}`}
              deleteTitle={'Удалить акцию'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
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
    <Inner testId={'promo-list'}>
      <div className='relative'>
        <div className='overflow-y-hidden overflow-x-auto'>
          <Table columns={columns} data={promoList} />
        </div>
        <FixedButtons>
          <Button testId={'create-promo'}>Создать акцию</Button>
        </FixedButtons>
      </div>
    </Inner>
  );
};

export default PromoList;
