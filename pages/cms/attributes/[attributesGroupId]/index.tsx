import FixedButtons from 'components/button/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { ROUTE_CMS } from 'config/common';
import useValidationSchema from 'hooks/useValidationSchema';
import AppSubNav from 'layout/AppSubNav';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import Button from 'components/button/Button';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { COL_ATTRIBUTES_GROUPS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AttributesGroupInterface } from 'db/uiInterfaces';
import { useUpdateAttributesGroupMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { Form, Formik } from 'formik';
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${attributesGroup.name}`,
    config: [
      {
        name: 'Группы атрибутов',
        href: `${ROUTE_CMS}/attributes`,
      },
    ],
  };

  const navConfig = React.useMemo(() => {
    return [
      {
        name: 'Атрибуты',
        testId: 'sub-nav-attributes',
        path: `${ROUTE_CMS}/attributes/${attributesGroup._id}/attributes`,
        exact: true,
      },
      {
        name: 'Детали',
        testId: 'sub-nav-details',
        path: `${ROUTE_CMS}/attributes/${attributesGroup._id}`,
        exact: true,
      },
    ];
  }, [attributesGroup._id]);

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{attributesGroup.name}</title>
      </Head>
      <Inner lowBottom>
        <Title testId={'attributes-group-title'}>{attributesGroup.name}</Title>
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
                  <Button type={'submit'} testId={'attributes-group-submit'}>
                    Сохранить
                  </Button>
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
  extends PagePropsInterface,
    AttributesGroupConsumerInterface {}

const AttributesGroup: NextPage<AttributesGroupPageInterface> = ({ attributesGroup, ...props }) => {
  return (
    <ConsoleLayout title={pageTitle} {...props}>
      <AttributesGroupConsumer attributesGroup={attributesGroup} />
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

  const { db } = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupInterface>(COL_ATTRIBUTES_GROUPS);

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
