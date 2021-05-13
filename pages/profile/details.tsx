import Button from 'components/Buttons/Button';
import StringButton from 'components/Buttons/StringButton';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { UpdateMyPasswordModalInterface } from 'components/Modal/UpdateMyPasswordModal/UpdateMyPasswordModal';
import RequestError from 'components/RequestError/RequestError';
import Title from 'components/Title/Title';
import { ROUTE_SIGN_IN } from 'config/common';
import { CONFIRM_MODAL, UPDATE_MY_PASSWORD_MODAL } from 'config/modals';
import { useUserContext } from 'context/userContext';
import { Form, Formik } from 'formik';
import {
  UpdateMyProfileInput,
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import ProfileLayout from 'layout/ProfileLayout/ProfileLayout';
import RowWithGap from 'layout/RowWithGap/RowWithGap';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { phoneToRaw } from 'lib/phoneUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { getSiteInitialData } from 'lib/ssrUtils';
import classes from 'styles/ProfileDetailsRoute.module.css';
import { updateMyProfileSchema } from 'validation/userSchema';
import { signOut } from 'next-auth/client';

const ProfileDetailsRoute: React.FC = () => {
  const router = useRouter();
  const { me } = useUserContext();
  const {
    onErrorCallback,
    showModal,
    showLoading,
    showErrorNotification,
    hideLoading,
    hideModal,
  } = useMutationCallbacks({
    withModal: true,
  });
  const [updateMyProfileMutation] = useUpdateMyProfileMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data.updateMyProfile.success) {
        signOut({
          redirect: false,
        })
          .then(() => {
            router.push(ROUTE_SIGN_IN).catch((e) => {
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
    },
  });
  const validationSchema = useValidationSchema({
    schema: updateMyProfileSchema,
  });
  const [updateMyPasswordMutation] = useUpdateMyPasswordMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      if (data.updateMyPassword.success) {
        signOut({
          redirect: false,
        })
          .then(() => {
            router.push(ROUTE_SIGN_IN).catch((e) => {
              console.log(e);
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  });

  if (!me) {
    return <RequestError message={'Пользователь не найден'} />;
  }

  const { email, phone, name, lastName, secondName } = me;

  return (
    <div className={classes.profile} data-cy={'profile-details'}>
      <div className={classes.form}>
        <Formik<UpdateMyProfileInput>
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
                    variables: {
                      input: {
                        ...values,
                        phone: phoneToRaw(values.phone),
                      },
                    },
                  }).catch((e) => {
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
                <fieldset className={classes.group}>
                  <Title tag={'legend'}>Персональные данные</Title>

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

                <fieldset className={classes.group}>
                  <Title tag={'legend'}>Контактные данные</Title>

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
                  <Button type={'submit'} testId={'submit-my-profile'}>
                    Сохранить
                  </Button>
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
                            updateMyPasswordMutation({
                              variables: {
                                input,
                              },
                            }).catch((e) => {
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

      <div className={classes.card}>User card with avatar</div>
    </div>
  );
};

type ProfileDetailsInterface = SiteLayoutProviderInterface;

const ProfileDetails: NextPage<ProfileDetailsInterface> = (props) => {
  return (
    <SiteLayoutProvider title={'Профиль'} {...props}>
      <ProfileLayout>
        <ProfileDetailsRoute />
      </ProfileLayout>
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProfileDetailsInterface>> {
  const { props } = await getSiteInitialData({
    context,
  });
  if (!props.sessionUser) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_SIGN_IN,
      },
    };
  }

  return {
    props,
  };
}

export default ProfileDetails;
