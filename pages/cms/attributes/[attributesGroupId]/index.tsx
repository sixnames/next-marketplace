import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import AppSubNav from 'components/layout/AppSubNav';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpTitle from 'components/WpTitle';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, AttributesGroupInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateAttributesGroupMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getFieldStringLocale } from 'lib/i18n';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import { attributesGroupModalSchema } from 'validation/attributesGroupSchema';

const pageTitle = `Группы атрибутов`;

interface AttributesGroupConsumerInterface {
  attributesGroup: AttributesGroupInterface;
}

const AttributesGroupConsumer: React.FC<AttributesGroupConsumerInterface> = ({
  attributesGroup,
}) => {
  const validationSchema = useValidationSchema({
    schema: attributesGroupModalSchema,
  });
  const { onCompleteCallback, onErrorCallback, showLoading, hideLoading } = useMutationCallbacks({
    reload: true,
  });

  const [updateAttributesGroupMutation] = useUpdateAttributesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updateAttributesGroup),
    onError: onErrorCallback,
  });

  const links = getCmsLinks({
    attributesGroupId: attributesGroup._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${attributesGroup.name}`,
    config: [
      {
        name: 'Группы атрибутов',
        href: links.attributes.parentLink,
      },
    ],
  };

  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: links.attributes.attribute.parentLink,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'sub-nav-details',
        path: links.attributes.root,
        exact: true,
      },
    ];
  }, [links]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{attributesGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <WpTitle testId={'attributes-group-title'}>{attributesGroup.name}</WpTitle>
      </Inner>
      <AppSubNav navConfig={navConfig} />

      <Inner>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            attributesGroupId: attributesGroup._id,
            nameI18n: attributesGroup.nameI18n,
          }}
          onSubmit={(values) => {
            showLoading();
            updateAttributesGroupMutation({
              variables: {
                input: {
                  attributesGroupId: values.attributesGroupId,
                  nameI18n: values.nameI18n,
                },
              },
            }).catch((e) => {
              hideLoading();
              console.log(e);
            });
          }}
        >
          {() => {
            return (
              <Form>
                <FormikTranslationsInput
                  label={'Введите название'}
                  name={'nameI18n'}
                  testId={'nameI18n'}
                  showInlineError
                  isRequired
                />
                <FixedButtons>
                  <WpButton type={'submit'} testId={'attributes-group-submit'}>
                    Сохранить
                  </WpButton>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </AppContentWrapper>
  );
};

interface AttributesGroupPageInterface
  extends GetAppInitialDataPropsInterface,
    AttributesGroupConsumerInterface {}

const AttributesGroup: NextPage<AttributesGroupPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AttributesGroupConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<AttributesGroupPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props || !query.attributesGroupId) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const attributesGroupsCollection = collections.attributesGroupsCollection();

  const attributesGroup = await attributesGroupsCollection.findOne({
    _id: new ObjectId(`${query.attributesGroupId}`),
  });

  if (!attributesGroup) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      attributesGroup: castDbData({
        ...attributesGroup,
        name: getFieldStringLocale(attributesGroup.nameI18n, props.sessionLocale),
      }),
    },
  };
};

export default AttributesGroup;
