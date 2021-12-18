import WpButton from 'components/button/WpButton';
import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import Currency from 'components/Currency';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { GiftCertificateModalInterface } from 'components/Modal/GiftCertificateModal';
import Pager from 'components/Pager';
import Spinner from 'components/Spinner';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { CONFIRM_MODAL, GIFT_CERTIFICATE_MODAL } from 'config/modalVariants';
import { useAppContext } from 'context/appContext';
import {
  CompanyInterface,
  GetConsoleGiftCertificatesPayloadInterface,
  GiftCertificateInterface,
  UserInterface,
} from 'db/uiInterfaces';
import {
  useCreateGiftCertificateMutation,
  useDeleteGiftCertificateMutation,
  useUpdateGiftCertificateMutation,
} from 'hooks/mutations/useGiftCertificateMutations';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { getNumWord } from 'lib/i18n';
import * as React from 'react';

export interface ConsoleGiftCertificatesListInterface
  extends GetConsoleGiftCertificatesPayloadInterface {
  pageCompany: CompanyInterface;
  userRouteBasePath: string;
}

const ConsoleGiftCertificatesList: React.FC<ConsoleGiftCertificatesListInterface> = ({
  pageCompany,
  page,
  totalPages,
  totalDocs,
  docs,
  userRouteBasePath,
}) => {
  const isPageLoading = usePageLoadingState();
  const { showModal } = useAppContext();

  const [createGiftCertificateMutation] = useCreateGiftCertificateMutation();
  const [updateGiftCertificateMutation] = useUpdateGiftCertificateMutation();
  const [deleteGiftCertificateMutation] = useDeleteGiftCertificateMutation();

  const counterString = React.useMemo(() => {
    if (totalDocs < 1) {
      return '';
    }

    const counterPostfix = getNumWord(totalDocs, ['сертификат', 'сертификата', 'сертификатов']);
    const counterPrefix = getNumWord(totalDocs, ['Найден', 'Найдено', 'Найдено']);
    return `${counterPrefix} ${totalDocs} ${counterPostfix}`;
  }, [totalDocs]);

  const columns: WpTableColumn<GiftCertificateInterface>[] = [
    {
      accessor: 'code',
      headTitle: 'Код',
      render: ({ cellData }) => <div>{cellData}</div>,
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'initialValue',
      headTitle: 'Сумма',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      accessor: 'value',
      headTitle: 'Остаток',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      accessor: 'user',
      headTitle: 'Клиент',
      render: ({ cellData }) => {
        const user = cellData as UserInterface;
        if (!user) {
          return <div>Не назначен</div>;
        }
        return (
          <div
            onClick={() => {
              window.open(`${userRouteBasePath}/${user._id}`);
            }}
            className='cursor-pointer hover:text-theme'
          >
            <div>{user.fullName}</div>
            <div>{user.email}</div>
            <div>{user.formattedPhone?.readable}</div>
          </div>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={dataItem.code}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              showModal<GiftCertificateModalInterface>({
                variant: GIFT_CERTIFICATE_MODAL,
                props: {
                  giftCertificate: dataItem,
                  pageCompany,
                  confirm: (values) => {
                    updateGiftCertificateMutation({
                      ...values,
                      _id: `${dataItem._id}`,
                    }).catch(console.log);
                  },
                },
              });
            }}
            deleteTitle={'Удалить магазин'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-modal',
                  message: `Вы уверенны, что хотите удалить подарочный сертификат ${dataItem.code}?`,
                  confirm: () => {
                    deleteGiftCertificateMutation({
                      _id: `${dataItem._id}`,
                    }).catch(console.log);
                  },
                },
              });
            }}
          />
        );
      },
    },
  ];

  return (
    <div data-cy={'company-shops-list'} className='relative'>
      <div className={`text-xl font-medium mb-2`}>{counterString}</div>

      <div className={`relative overflow-x-auto overflow-y-hidden`}>
        <WpTable<GiftCertificateInterface>
          columns={columns}
          data={docs}
          testIdKey={'_id'}
          onRowDoubleClick={(dataItem) => {
            showModal<GiftCertificateModalInterface>({
              variant: GIFT_CERTIFICATE_MODAL,
              props: {
                giftCertificate: dataItem,
                pageCompany,
                confirm: (values) => {
                  updateGiftCertificateMutation({
                    ...values,
                    _id: `${dataItem._id}`,
                  }).catch(console.log);
                },
              },
            });
          }}
        />

        {isPageLoading ? <Spinner isNestedAbsolute isTransparent /> : null}
      </div>

      <Pager page={page} totalPages={totalPages} />

      <FixedButtons>
        <WpButton
          testId={'create-gift-certificate'}
          size={'small'}
          onClick={() => {
            showModal<GiftCertificateModalInterface>({
              variant: GIFT_CERTIFICATE_MODAL,
              props: {
                pageCompany,
                confirm: (values) => {
                  createGiftCertificateMutation(values).catch(console.log);
                },
              },
            });
          }}
        >
          Создать подарочный сертификат
        </WpButton>
      </FixedButtons>
    </div>
  );
};

export default ConsoleGiftCertificatesList;
