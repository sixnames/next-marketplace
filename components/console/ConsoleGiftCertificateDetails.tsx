import { Form, Formik } from 'formik';
import * as React from 'react';
import { USERS_SEARCH_MODAL } from '../../config/modalVariants';
import { useAppContext } from '../../context/appContext';
import { UpdateGiftCertificateInputInterface } from '../../db/dao/giftCertificate/updateGiftCertificate';
import { CompanyInterface, GiftCertificateInterface } from '../../db/uiInterfaces';
import { useUpdateGiftCertificateMutation } from '../../hooks/mutations/useGiftCertificateMutations';
import ContentItemControls from '../button/ContentItemControls';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import GiftCertificateMainFields from '../FormTemplates/GiftCertificateMainFields';
import {
  UsersSearchModalControlsInterface,
  UsersSearchModalInterface,
} from '../Modal/UsersSearchModal';

export interface ConsoleGiftCertificateDetailsInterface {
  pageCompany: CompanyInterface;
  giftCertificate: GiftCertificateInterface;
  basePath?: string;
  showUsersSearch?: boolean;
  userRouteBasePath: string;
}

const ConsoleGiftCertificateDetails: React.FC<ConsoleGiftCertificateDetailsInterface> = ({
  giftCertificate,
  showUsersSearch,
  userRouteBasePath,
}) => {
  const { showModal } = useAppContext();
  const [updateGiftCertificateMutation] = useUpdateGiftCertificateMutation();
  function showUsersSearchModal({
    createTitle,
    updateTitle,
    deleteTitle,
    createHandler,
    updateHandler,
    deleteHandler,
    disabled,
    isDeleteDisabled,
    isCreateDisabled,
    isUpdateDisabled,
  }: UsersSearchModalControlsInterface) {
    showModal<UsersSearchModalInterface>({
      variant: USERS_SEARCH_MODAL,
      props: {
        controlsColumn: {
          render: ({ dataItem }) => {
            return (
              <ContentItemControls
                justifyContent={'flex-end'}
                testId={dataItem.itemId}
                createTitle={createTitle}
                updateTitle={updateTitle}
                deleteTitle={deleteTitle}
                createHandler={createHandler ? () => createHandler(dataItem) : undefined}
                updateHandler={updateHandler ? () => updateHandler(dataItem) : undefined}
                deleteHandler={deleteHandler ? () => deleteHandler(dataItem) : undefined}
                disabled={disabled}
                isDeleteDisabled={isDeleteDisabled ? isDeleteDisabled(dataItem) : undefined}
                isCreateDisabled={isCreateDisabled ? isCreateDisabled(dataItem) : undefined}
                isUpdateDisabled={isUpdateDisabled ? isUpdateDisabled(dataItem) : undefined}
              />
            );
          },
        },
      },
    });
  }

  const initialValues: UpdateGiftCertificateInputInterface = {
    _id: `${giftCertificate._id}`,
    userId: `${giftCertificate.userId}`,
    code: giftCertificate.code,
    initialValue: giftCertificate.initialValue,
    descriptionI18n: giftCertificate.descriptionI18n,
    nameI18n: giftCertificate.nameI18n,
    companyId: `${giftCertificate.companyId}`,
    companySlug: giftCertificate.companySlug,
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        updateGiftCertificateMutation(values).catch(console.log);
      }}
    >
      {({ values }) => {
        return (
          <Form>
            <div className='relative'>
              <GiftCertificateMainFields />

              {giftCertificate.user ? (
                <div
                  className='cursor-pointer hover:text-theme mb-6'
                  onClick={() => {
                    window.open(`${userRouteBasePath}/${giftCertificate.user?._id}`, '_blank');
                  }}
                >
                  <div>{giftCertificate.user?.fullName}</div>
                  <div>{giftCertificate.user?.email}</div>
                  <div>{giftCertificate.user?.formattedPhone?.readable}</div>
                </div>
              ) : null}

              {showUsersSearch ? (
                <div className='mb-8'>
                  <WpButton
                    theme={'secondary'}
                    size={'small'}
                    testId={'add-user'}
                    onClick={() =>
                      showUsersSearchModal({
                        createTitle: 'Привязать',
                        createHandler: (user) => {
                          updateGiftCertificateMutation({
                            ...values,
                            userId: `${user._id}`,
                          }).catch(console.log);
                        },
                      })
                    }
                  >
                    {giftCertificate.user ? 'Изменить пользователя' : 'Выбрать пользователя'}
                  </WpButton>
                </div>
              ) : null}

              <FixedButtons>
                <WpButton
                  frameClassName='w-auto'
                  size={'small'}
                  type={'submit'}
                  testId={'submit-promo'}
                >
                  Сохранить
                </WpButton>
              </FixedButtons>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ConsoleGiftCertificateDetails;
