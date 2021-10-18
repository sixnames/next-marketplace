import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import WpIconUpload from 'components/FormElements/Upload/WpIconUpload';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import OptionMainFields from 'components/FormTemplates/OptionMainFields';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { GENDER_ENUMS, ROUTE_CMS } from 'config/common';
import { COL_ICONS, COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { OptionVariantsModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { OptionInterface } from 'db/uiInterfaces';
import {
  Gender,
  OptionsGroupVariant,
  UpdateOptionInGroupInput,
  useUpdateOptionInGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import { Form, Formik } from 'formik';

interface OptionPageConsumerInterface {
  option: OptionInterface;
}

const OptionPageConsumer: React.FC<OptionPageConsumerInterface> = ({ option }) => {
  const {
    onCompleteCallback,
    onErrorCallback,
    showLoading,
    hideLoading,
    showErrorNotification,
    router,
  } = useMutationCallbacks({
    reload: true,
    withModal: true,
  });

  const [updateOptionInGroupMutation] = useUpdateOptionInGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateOptionInGroup),
    onError: onErrorCallback,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${option.name}`,
    config: [
      {
        name: 'Группы опций',
        href: `${ROUTE_CMS}/options`,
      },
      {
        name: `${option.optionsGroup?.name}`,
        href: `${ROUTE_CMS}/options/${option.optionsGroup?._id}`,
      },
      {
        name: `Опции`,
        href: `${ROUTE_CMS}/options/${option.optionsGroup?._id}/options`,
      },
    ],
  };

  const { _id, color, nameI18n, optionsGroupId, gender, variants, image, parentId } = option;
  const variantKeys = Object.keys(variants);

  const initialValues: UpdateOptionInGroupInput = {
    optionId: _id,
    color,
    optionsGroupId,
    parentId,
    nameI18n,
    gender: gender ? (`${gender}` as Gender) : null,
    variants:
      variantKeys.length > 0
        ? variants
        : GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
            acc[gender] = {};
            return acc;
          }, {}),
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{option.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{option.name}</Title>
      </Inner>
      <Inner testId={'option-details'}>
        <div className='relative'>
          <WpImageUpload
            previewUrl={image}
            testId={'image'}
            label={'Изображение'}
            removeImageHandler={() => {
              showLoading();
              const formData = new FormData();
              formData.append('optionId', `${_id}`);

              fetch('/api/option/update-option-image', {
                method: 'DELETE',
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  if (json.success) {
                    hideLoading();
                    router.reload();
                    return;
                  }
                  hideLoading();
                  showErrorNotification({ title: json.message });
                })
                .catch(() => {
                  hideLoading();
                  showErrorNotification({ title: 'error' });
                });
            }}
            uploadImageHandler={(files) => {
              if (files) {
                showLoading();
                const formData = new FormData();
                formData.append('assets', files[0]);
                formData.append('optionId', `${_id}`);

                fetch('/api/option/update-option-image', {
                  method: 'POST',
                  body: formData,
                })
                  .then((res) => {
                    return res.json();
                  })
                  .then((json) => {
                    if (json.success) {
                      hideLoading();
                      router.reload();
                      return;
                    }
                    hideLoading();
                    showErrorNotification({ title: json.message });
                  })
                  .catch(() => {
                    hideLoading();
                    showErrorNotification({ title: 'error' });
                  });
              }
            }}
          />

          <WpIconUpload
            previewIcon={option.icon?.icon}
            testId={'icon'}
            label={'Иконка'}
            removeImageHandler={() => {
              showLoading();
              const formData = new FormData();
              formData.append('optionId', `${_id}`);

              fetch('/api/option/update-option-icon', {
                method: 'DELETE',
                body: formData,
              })
                .then((res) => {
                  return res.json();
                })
                .then((json) => {
                  if (json.success) {
                    hideLoading();
                    router.reload();
                    return;
                  }
                  hideLoading();
                  showErrorNotification({ title: json.message });
                })
                .catch(() => {
                  hideLoading();
                  showErrorNotification({ title: 'error' });
                });
            }}
            uploadImageHandler={(files) => {
              if (files) {
                showLoading();
                const formData = new FormData();
                formData.append('assets', files[0]);
                formData.append('optionId', `${_id}`);

                fetch('/api/option/update-option-icon', {
                  method: 'POST',
                  body: formData,
                })
                  .then((res) => {
                    return res.json();
                  })
                  .then((json) => {
                    if (json.success) {
                      hideLoading();
                      router.reload();
                      return;
                    }
                    hideLoading();
                    showErrorNotification({ title: json.message });
                  })
                  .catch(() => {
                    hideLoading();
                    showErrorNotification({ title: 'error' });
                  });
              }
            }}
          />

          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              showLoading();
              return updateOptionInGroupMutation({
                variables: {
                  input: {
                    optionId: values.optionId,
                    optionsGroupId: values.optionsGroupId,
                    parentId: values.parentId,
                    color: values.color,
                    gender: values.gender,
                    nameI18n: values.nameI18n,
                    variants: values.variants,
                  },
                },
              });
            }}
          >
            {() => {
              return (
                <Form>
                  <OptionMainFields
                    groupVariant={`${option.optionsGroup?.variant}` as OptionsGroupVariant}
                  />

                  <FixedButtons>
                    <Button type={'submit'} testId={'option-submit'} size={'small'}>
                      Сохранить
                    </Button>
                  </FixedButtons>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionPageInterface extends PagePropsInterface, OptionPageConsumerInterface {}

const OptionPage: NextPage<OptionPageInterface> = ({ pageUrls, option }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OptionPageConsumer option={option} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OptionPageInterface>> => {
  const { props } = await getAppInitialData({ context });

  if (!props || !context.query.optionId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const optionsCollection = await db.collection<OptionInterface>(COL_OPTIONS);

  const optionAggregationResult = await optionsCollection
    .aggregate<OptionInterface>([
      {
        $match: {
          _id: new ObjectId(`${context.query.optionId}`),
        },
      },
      {
        $lookup: {
          from: COL_ICONS,
          as: 'icon',
          let: {
            documentId: '$_id',
          },
          pipeline: [
            {
              $match: {
                collectionName: COL_OPTIONS,
                $expr: {
                  $eq: ['$documentId', '$$documentId'],
                },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: COL_OPTIONS_GROUPS,
          as: 'optionsGroup',
          let: { optionsGroupId: '$optionsGroupId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$optionsGroupId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          icon: {
            $arrayElemAt: ['$icon', 0],
          },
          optionsGroup: {
            $arrayElemAt: ['$optionsGroup', 0],
          },
        },
      },
    ])
    .toArray();
  const optionResult = optionAggregationResult[0];

  if (!optionResult) {
    return {
      notFound: true,
    };
  }

  const option: OptionInterface = {
    ...optionResult,
    name: getFieldStringLocale(optionResult.nameI18n, props.sessionLocale),
    optionsGroup: optionResult.optionsGroup
      ? {
          ...optionResult.optionsGroup,
          name: getFieldStringLocale(optionResult.optionsGroup.nameI18n, props.sessionLocale),
        }
      : null,
  };

  return {
    props: {
      ...props,
      option: castDbData(option),
    },
  };
};

export default OptionPage;
