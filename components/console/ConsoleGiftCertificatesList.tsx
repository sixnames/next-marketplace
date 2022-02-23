import {
  CompanyInterface,
  GetConsoleGiftCertificatesPayloadInterface,
  GiftCertificateInterface,
  UserInterface,
} from 'db/uiInterfaces';
import { useDeleteGiftCertificateMutation } from 'hooks/mutations/useGiftCertificateMutations';
import { useBasePath } from 'hooks/useBasePath';
import { CONFIRM_MODAL, GIFT_CERTIFICATE_MODAL } from 'lib/config/modalVariants';
import { getNumWord } from 'lib/i18n';
import { getConsoleCompanyLinks } from 'lib/links/getProjectLinks';
import { useRouter } from 'next/router';
import * as React from 'react';
import usePageLoadingState from '../../hooks/usePageLoadingState';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import { useAppContext } from '../context/appContext';
import Currency from '../Currency';
import WpLink from '../Link/WpLink';
import { ConfirmModalInterface } from '../Modal/ConfirmModal';
import { GiftCertificateModalInterface } from '../Modal/GiftCertificateModal';
import Pager from '../Pager';
import Spinner from '../Spinner';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleGiftCertificatesListInterface
  extends GetConsoleGiftCertificatesPayloadInterface {
  pageCompany: CompanyInterface;
}

const ConsoleGiftCertificatesList: React.FC<ConsoleGiftCertificatesListInterface> = ({
  pageCompany,
  page,
  totalPages,
  totalDocs,
  docs,
}) => {
  const router = useRouter();
  const isPageLoading = usePageLoadingState();
  const { showModal } = useAppContext();
  const basePath = useBasePath('companyId');

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
      render: ({ cellData, dataItem }) => {
        const links = getConsoleCompanyLinks({
          companyId: dataItem.companyId,
          giftCertificateId: dataItem._id,
          basePath,
        });
        return (
          <WpLink href={links.giftCertificates.certificate.giftCertificateId.url}>
            {cellData}
          </WpLink>
        );
      },
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
          <div>
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
            updateTitle={'Редактировать подарочный сертификат'}
            updateHandler={() => {
              const links = getConsoleCompanyLinks({
                companyId: dataItem.companyId,
                giftCertificateId: dataItem._id,
                basePath,
              });
              router
                .push(links.giftCertificates.certificate.giftCertificateId.url)
                .catch(console.log);
            }}
            deleteTitle={'Удалить подарочный сертификат'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-gift-certificate-modal',
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
      <div className={`mb-2 text-xl font-medium`}>{counterString}</div>

      <div className={`relative overflow-x-auto overflow-y-hidden`}>
        <WpTable<GiftCertificateInterface>
          columns={columns}
          data={docs}
          testIdKey={'_id'}
          onRowDoubleClick={(dataItem) => {
            const links = getConsoleCompanyLinks({
              companyId: dataItem.companyId,
              giftCertificateId: dataItem._id,
              basePath,
            });
            router
              .push(links.giftCertificates.certificate.giftCertificateId.url)
              .catch(console.log);
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
