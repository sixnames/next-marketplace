import { Form, Formik } from 'formik';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import WpButton from '../../components/button/WpButton';
import { useSiteUserContext } from '../../components/context/siteUserContext';
import FormikInput from '../../components/FormElements/Input/FormikInput';
import ProfileLayout from '../../components/layout/ProfileLayout/ProfileLayout';
import RowWithGap from '../../components/layout/RowWithGap/RowWithGap';
import SiteLayout, { SiteLayoutProviderInterface } from '../../components/layout/SiteLayout';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal';
import { UpdateMyPasswordModalInterface } from '../../components/Modal/UpdateMyPasswordModal';
import RequestError from '../../components/RequestError';
import StringButton from '../../components/StringButton';
import WpTitle from '../../components/WpTitle';
import { getPageSessionUser } from '../../db/dao/user/getPageSessionUser';
import { UpdateMyProfileInputInterface } from '../../db/dao/user/updateMyProfile';
import {
  useUpdateMyPasswordMutation,
  useUpdateMyProfileMutation,
} from '../../hooks/mutations/useUserMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { CONFIRM_MODAL, UPDATE_MY_PASSWORD_MODAL } from '../../lib/config/modalVariants';
import { phoneToRaw } from '../../lib/phoneUtils';
import { getSiteInitialData } from '../../lib/ssrUtils';
import { updateMyProfileSchema } from '../../validation/userSchema';

const links = getProjectLinks();

const ProfileDetailsRoute: React.FC = () => {
  const router = useRouter();
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
    return <RequestError message={'???????????????????????? ???? ????????????'} />;
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
              message: '?????? ?????????????????? ?????????????? ?????????????????? ?????????????????? ??????????????????????.',
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
                          router.push(links.signIn.url).catch((e) => {
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
                <legend className='mb-4 text-lg font-medium'>???????????????????????? ????????????</legend>

                <FormikInput
                  label={'??????'}
                  name={'name'}
                  testId={'name'}
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'??????????????'}
                  name={'lastName'}
                  testId={'lastName'}
                  showInlineError
                />
                <FormikInput
                  label={'????????????????'}
                  name={'secondName'}
                  testId={'secondName'}
                  showInlineError
                />
              </fieldset>

              <fieldset className='mb-20'>
                <legend className='mb-4 text-lg font-medium'>???????????????????? ????????????</legend>

                <FormikInput
                  label={'Email'}
                  type={'email'}
                  name={'email'}
                  testId={'email'}
                  isRequired
                  showInlineError
                />
                <FormikInput
                  label={'??????????????'}
                  type={'tel'}
                  name={'phone'}
                  testId={'phone'}
                  isRequired
                  showInlineError
                />
              </fieldset>

              <RowWithGap>
                <WpButton type={'submit'} testId={'submit-my-profile'}>
                  ??????????????????
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
                                    router.push(links.signIn.url).catch((e) => {
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
                  ???????????????? ????????????
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
    <SiteLayout title={'??????????????'} {...props}>
      <ProfileLayout>
        <WpTitle size={'small'}>??????????????</WpTitle>
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
        destination: links.signIn.url,
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
