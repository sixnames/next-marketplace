import Button from 'components/Button';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import Inner from 'components/Inner';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import { COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { OptionsGroupInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  OptionsGroupVariant,
  useOptionsGroupVariantsQuery,
  useUpdateOptionsGroupMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import AppSubNav from 'layout/AppSubNav';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';
import Head from 'next/head';
import * as React from 'react';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import { optionsGroupModalSchema } from 'validation/optionsGroupSchema';

interface OptionsGroupConsumerInterface {
  optionsGroup: OptionsGroupInterface;
}

const OptionsGroupConsumer: React.FC<OptionsGroupConsumerInterface> = ({ optionsGroup }) => {
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const { data, loading, error } = useOptionsGroupVariantsQuery();
  const validationSchema = useValidationSchema({
    schema: optionsGroupModalSchema,
  });

  const [updateOptionsGroupMutation] = useUpdateOptionsGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateOptionsGroup),
    onError: onErrorCallback,
  });

  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Опции',
        testId: 'options',
        path: `${ROUTE_CMS}/options/${optionsGroup._id}/options`,
        exact: true,
      },
      {
        name: 'Общие',
        testId: 'details',
        path: `${ROUTE_CMS}/options/${optionsGroup._id}`,
        exact: true,
      },
    ];
  }, [optionsGroup._id]);

  if (loading) {
    return <Spinner />;
  }

  if (error || !data || !data.getOptionsGroupVariantsOptions) {
    return (
      <AppContentWrapper>
        <RequestError />
      </AppContentWrapper>
    );
  }

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${optionsGroup.name}`,
    config: [
      {
        name: 'Группы опций',
        href: `${ROUTE_CMS}/options`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{optionsGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <Title>{optionsGroup.name}</Title>
      </Inner>
      <AppSubNav navConfig={navConfig} />
      <Inner testId={'options-group-details'}>
        <Formik
          initialValues={{
            optionsGroupId: optionsGroup._id,
            nameI18n: optionsGroup.nameI18n,
            variant: `${optionsGroup.variant}` as OptionsGroupVariant,
          }}
          onSubmit={(values) => {
            showLoading();
            updateOptionsGroupMutation({
              variables: {
                input: values,
              },
            }).catch((e) => console.log(e));
          }}
          validationSchema={validationSchema}
        >
          {() => {
            return (
              <Form>
                <FormikTranslationsInput
                  label={'Название'}
                  name={'nameI18n'}
                  testId={'nameI18n'}
                  showInlineError
                  isRequired
                />

                <FormikSelect
                  testId={'variant'}
                  label={'Тип группы'}
                  name={'variant'}
                  options={data.getOptionsGroupVariantsOptions}
                />

                <Button type={'submit'} testId={'options-group-submit'}>
                  Сохранить
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionsGroupPageInterface extends PagePropsInterface, OptionsGroupConsumerInterface {}

const OptionsGroupPage: NextPage<OptionsGroupPageInterface> = ({ pageUrls, optionsGroup }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <OptionsGroupConsumer optionsGroup={optionsGroup} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<OptionsGroupPageInterface>> => {
  const { props } = await getAppInitialData({ context });

  if (!props || !context.query.optionsGroupId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const optionsGroupsCollection = await db.collection<OptionsGroupInterface>(COL_OPTIONS_GROUPS);

  const optionsGroupResult = await optionsGroupsCollection.findOne({
    _id: new ObjectId(`${context.query.optionsGroupId}`),
  });

  if (!optionsGroupResult) {
    return {
      notFound: true,
    };
  }

  const optionsGroup: OptionsGroupInterface = {
    ...optionsGroupResult,
    name: getFieldStringLocale(optionsGroupResult.nameI18n, props.sessionLocale),
    variantName: getConstantTranslation(
      `selectsOptions.optionsGroupVariant.${optionsGroupResult.variant}.${props.sessionLocale}`,
    ),
  };

  return {
    props: {
      ...props,
      optionsGroup: castDbData(optionsGroup),
    },
  };
};

export default OptionsGroupPage;
