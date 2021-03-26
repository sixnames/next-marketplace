import Button from 'components/Buttons/Button';
import StringButton from 'components/Buttons/StringButton';
import FormikInput from 'components/FormElements/Input/FormikInput';
import { UpdateMyPasswordModalInterface } from 'components/Modal/UpdateMyPasswordModal/UpdateMyPasswordModal';
import RequestError from 'components/RequestError/RequestError';
import Title from 'components/Title/Title';
import { ROUTE_SIGN_IN } from 'config/common';
import { UPDATE_MY_PASSWORD_MODAL } from 'config/modals';
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
import { phoneToRaw } from 'lib/phoneUtils';
import { getSession } from 'next-auth/client';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { getSiteInitialData } from 'lib/ssrUtils';
import classes from 'styles/ProfileDetailsRoute.module.css';
import { updateMyProfileSchema } from 'validation/userSchema';

const ProfileDetailsRoute: React.FC = () => {
  const { me, updateMyContext } = useUserContext();
  const {
    onErrorCallback,
    onCompleteCallback,
    showModal,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({
    withModal: true,
  });
  const [updateMyProfileMutation] = useUpdateMyProfileMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      onCompleteCallback(data.updateMyProfile);
      if (data.updateMyProfile.payload) {
        updateMyContext(data.updateMyProfile.payload);
      } else {
        showErrorNotification();
      }
    },
  });
  const validationSchema = useValidationSchema({
    schema: updateMyProfileSchema,
  });
  const [updateMyPasswordMutation] = useUpdateMyPasswordMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateMyPassword),
  });

  function updateMyPasswordHandler() {
    showModal<UpdateMyPasswordModalInterface>({
      variant: UPDATE_MY_PASSWORD_MODAL,
      props: {
        confirm: async (input) => {
          showLoading();
          await updateMyPasswordMutation({
            variables: {
              input,
            },
          });
        },
      },
    });
  }

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
          onSubmit={async (values) => {
            await updateMyProfileMutation({
              variables: {
                input: {
                  ...values,
                  phone: phoneToRaw(values.phone),
                },
              },
            });
          }}
        >
          {() => {
            return (
              <Form>
                <fieldset className={classes.group}>
                  <Title tag={'legend'} size={'small'}>
                    Персональные данные
                  </Title>

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
                  <Title tag={'legend'} size={'small'}>
                    Контактные данные
                  </Title>

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
                  <StringButton testId={'update-my-password'} onClick={updateMyPasswordHandler}>
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

interface ProfileDetailsInterface extends PagePropsInterface, SiteLayoutInterface {}

const ProfileDetails: NextPage<ProfileDetailsInterface> = ({ navRubrics, canonicalUrl }) => {
  return (
    <SiteLayout title={'Профиль'} navRubrics={navRubrics} canonicalUrl={canonicalUrl}>
      <ProfileLayout>
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

  const session = await getSession(context);
  if (!session?.user) {
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
