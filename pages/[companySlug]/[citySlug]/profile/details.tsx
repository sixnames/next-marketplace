import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { signOut } from 'next-auth/client';
import WpButton from '../../../../components/button/WpButton';
import FormikInput from '../../../../components/FormElements/Input/FormikInput';
import { ConfirmModalInterface } from '../../../../components/Modal/ConfirmModal';
import { UpdateMyPasswordModalInterface } from '../../../../components/Modal/UpdateMyPasswordModal';
import RequestError from '../../../../components/RequestError';
import StringButton from '../../../../components/StringButton';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_SIGN_IN } from '../../../../config/common';
import { CONFIRM_MODAL, UPDATE_MY_PASSWORD_MODAL } from '../../../../config/modalVariants';
import { useSiteContext } from '../../../../context/siteContext';
import { useSiteUserContext } from '../../../../context/siteUserContext';
import { getPageSessionUser } from '../../../../db/dao/user/getPageSessionUser';
import { UpdateMyProfileInputInterface } from '../../../../db/dao/user/updateMyProfile';
import {
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,
} from '../../../../hooks/mutations/useUserMutations';
import useMutationCallbacks from '../../../../hooks/useMutationCallbacks';
import useValidationSchema from '../../../../hooks/useValidationSchema';
import ProfileLayout from '../../../../layout/ProfileLayout/ProfileLayout';
import RowWithGap from '../../../../layout/RowWithGap/RowWithGap';
import { phoneToRaw } from '../../../../lib/phoneUtils';
import { getSiteInitialData } from '../../../../lib/ssrUtils';
import { updateMyProfileSchema } from '../../../../validation/userSchema';
import SiteLayout, { SiteLayoutProviderInterface } from '../../../../layout/SiteLayout';

const ProfileDetailsRoute: React.FC = () => {
  const router = useRouter();
  const { urlPrefix } = useSiteContext();
  const sessionUser = useSiteUserContext();
  const { showModal, showLoading, showErrorNotification, hideLoading, hideModal } =
    useMutationCallbacks({
      withModal: true,
    });
  const [updateMyProfileMutation] = useUpdateMyProfileMutation();
  const validationSchema = useValidationSchema({
    schema: updateMyProfileSchema,
  });
  const [updateMyPasswordMutation] = useUpdateMyPasswordMutation();

  if (!sessionUser?.me) {
    return <RequestError message={'Пользователь не найден'} />;
  }

  const { email, phone, name, lastName, secondName } = sessionUser.me;

  return (
    <div data-cy={'profile-details'}>
      <Formik<UpdateMyProfileInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          name,
          lastName,
          secondName,
          email,
          phone,
        }}
        onSubmit={(values) => {
          showModal<ConfirmModalInterface>({
            variant: CONFIRM_MODAL,
            props: {
              testId: 'update-profile-modal',
              message: 'При изменении профиля требуется повторная авторизация.',
              confirm: () => {
                showLoading();
                updateMyProfileMutation({
                  ...values,
                  phone: phoneToRaw(values.phone),
                })
                  .then((payload) => {
                    if (payload && payload.success) {
                      signOut({
                        redirect: false,
                      })
                        .then(() => {
                          router.push(`${urlPrefix}${ROUTE_SIGN_IN}`).catch((e) => {
                            console.log(e);
                          });
                        })
                        .catch((e) => {
                          console.log(e);
                        });
                    } else {
                      hideLoading();
                      hideModal();
                      showErrorNotification();
                    }
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              },
            },
          });
        }}
      >
        {() => {
          return (
            <Form>
              <fieldset className='mb-20'>
                <legend className='text-lg font-medium mb-4'>Персональные данные</legend>

                <FormikInput
                  label={'Имя'}
                  name={'name'}
                  testId={'name'}
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'Фамилия'}
                  name={'lastName'}
                  testId={'lastName'}
                  showInlineError
                />
                <FormikInput
                  label={'Отчество'}
                  name={'secondName'}
                  testId={'secondName'}
                  showInlineError
                />
              </fieldset>

              <fieldset className='mb-20'>
                <legend className='text-lg font-medium mb-4'>Контактные данные</legend>

                <FormikInput
                  label={'Email'}
                  type={'email'}
                  name={'email'}
                  testId={'email'}
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'Телефон'}
                  type={'tel'}
                  name={'phone'}
                  testId={'phone'}
                  isRequired
                  showInlineError
                />
              </fieldset>

              <RowWithGap>
                <WpButton type={'submit'} testId={'submit-my-profile'}>
                  Сохранить
                </WpButton>
              </RowWithGap>

              <RowWithGap>
                <StringButton
                  testId={'update-my-password'}
                  onClick={() => {
                    showModal<UpdateMyPasswordModalInterface>({
                      variant: UPDATE_MY_PASSWORD_MODAL,
                      props: {
                        confirm: async (input) => {
                          showLoading();
                          updateMyPasswordMutation(input)
                            .then((payload) => {
                              if (payload && payload.success) {
                                signOut({
                                  redirect: false,
                                })
                                  .then(() => {
                                    router.push(`${urlPrefix}${ROUTE_SIGN_IN}`).catch((e) => {
                                      console.log(e);
                                    });
                                  })
                                  .catch((e) => {
                                    console.log(e);
                                  });
                              }
                            })
                            .catch((e) => {
                              console.log(e);
                            });
                        },
                      },
                    });
                  }}
                >
                  Изменить пароль
                </StringButton>
              </RowWithGap>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

type ProfileDetailsInterface = SiteLayoutProviderInterface;

const ProfileDetails: NextPage<ProfileDetailsInterface> = (props) => {
  return (
    <SiteLayout title={'Профиль'} {...props}>
      <ProfileLayout>
        <WpTitle size={'small'}>Профиль</WpTitle>
        <ProfileDetailsRoute />
      </ProfileLayout>
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileDetailsInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });

  // Session user
  const sessionUser = await getPageSessionUser({
    context,
    locale: props.sessionLocale,
  });

  if (!sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: `${props.urlPrefix}${ROUTE_SIGN_IN}`,
      },
    };
  }

  return {
    props: {
      ...props,
      showForIndex: false,
    },
  };
}

export default ProfileDetails;
