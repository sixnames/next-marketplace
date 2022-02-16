import WpButton from 'components/button/WpButton';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, OptionsGroupInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { OptionsGroupVariant, useUpdateOptionsGroupMutation } from 'generated/apolloComponents';
import { useConstantOptions } from 'hooks/useConstantOptions';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getConstantTranslation } from 'lib/config/constantTranslations';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { optionsGroupModalSchema } from 'validation/optionsGroupSchema';

interface OptionsGroupConsumerInterface {
  optionsGroup: OptionsGroupInterface;
}

const OptionsGroupConsumer: React.FC<OptionsGroupConsumerInterface> = ({ optionsGroup }) => {
  const { onCompleteCallback, onErrorCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const { optionsGroupVariantOptions } = useConstantOptions();
  const validationSchema = useValidationSchema({
    schema: optionsGroupModalSchema,
  });

  const [updateOptionsGroupMutation] = useUpdateOptionsGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateOptionsGroup),
    onError: onErrorCallback,
  });

  const links = getProjectLinks({
    optionsGroupId: optionsGroup._id,
  });
  const navConfig = [
    {
      name: 'Опции',
      testId: 'options',
      path: links.cms.options.optionsGroupId.options.url,
      exact: true,
    },
    {
      name: 'Детали',
      testId: 'details',
      path: links.cms.options.optionsGroupId.url,
      exact: true,
    },
  ];

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${optionsGroup.name}`,
    config: [
      {
        name: 'Группы опций',
        href: links.cms.options.url,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{optionsGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle>{optionsGroup.name}</WpTitle>
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
                  options={optionsGroupVariantOptions}
                />

                <WpButton type={'submit'} testId={'options-group-submit'}>
                  Сохранить
                </WpButton>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface OptionsGroupPageInterface
  extends GetAppInitialDataPropsInterface,
    OptionsGroupConsumerInterface {}

const OptionsGroupPage: NextPage<OptionsGroupPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <OptionsGroupConsumer {...props} />
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const optionsGroupsCollection = await collections.optionsGroupsCollection();

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
