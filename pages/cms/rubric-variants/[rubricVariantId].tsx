import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikLayoutSelect from 'components/FormElements/Select/FormikLayoutSelect';
import Inner from 'components/Inner';
import Title from 'components/Title';
import { ROUTE_CMS } from 'config/common';
import {
  CARD_LAYOUT_OPTIONS,
  GRID_SNIPPET_LAYOUT_OPTIONS,
  LAYOUT_DEFAULT,
  NAV_DROPDOWN_LAYOUT_OPTIONS,
  ROW_SNIPPET_LAYOUT_OPTIONS,
} from 'config/constantSelects';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { RubricVariantInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateRubricVariantInput,
  useUpdateRubricVariantMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper, { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/CmsLayout/CmsLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { updateRubricVariantSchema } from 'validation/rubricVariantSchema';

interface RubricVariantConsumerInterface {
  rubricVariant: RubricVariantInterface;
}

const RubricVariantConsumer: React.FC<RubricVariantConsumerInterface> = ({ rubricVariant }) => {
  const { showLoading, onErrorCallback, onCompleteCallback } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: updateRubricVariantSchema,
  });

  const [updateRubricVariantMutation] = useUpdateRubricVariantMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateRubricVariant),
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${rubricVariant.name}`,
    config: [
      {
        name: 'Типы рубрик',
        testId: 'rubric-variants-breadcrumb',
        href: `${ROUTE_CMS}/rubric-variants`,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Head>
        <title>{rubricVariant.name}</title>
      </Head>
      <Inner testId={'rubric-variant-details'}>
        <Title>{rubricVariant.name}</Title>

        <Formik<UpdateRubricVariantInput>
          validationSchema={validationSchema}
          initialValues={{
            rubricVariantId: rubricVariant._id,
            nameI18n: rubricVariant.nameI18n || {},
            cardLayout: rubricVariant.cardLayout || LAYOUT_DEFAULT,
            gridSnippetLayout: rubricVariant.gridSnippetLayout || LAYOUT_DEFAULT,
            rowSnippetLayout: rubricVariant.rowSnippetLayout || LAYOUT_DEFAULT,
            catalogueFilterLayout: rubricVariant.catalogueFilterLayout || LAYOUT_DEFAULT,
            catalogueNavLayout: rubricVariant.catalogueNavLayout || LAYOUT_DEFAULT,
            showSnippetBackground: rubricVariant.showSnippetBackground || false,
            showSnippetArticle: rubricVariant.showSnippetArticle || false,
            showSnippetRating: rubricVariant.showSnippetRating || false,
            showSnippetButtonsOnHover: rubricVariant.showSnippetButtonsOnHover || false,
            showCardButtonsBackground: rubricVariant.showCardButtonsBackground || false,
            showCardImagesSlider: rubricVariant.showCardImagesSlider || false,
            gridCatalogueColumns: rubricVariant.gridCatalogueColumns || 3,
          }}
          onSubmit={(values) => {
            showLoading();
            updateRubricVariantMutation({
              variables: {
                input: values,
              },
            }).catch(console.log);
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
                />

                {/*booleans*/}
                <FormikCheckboxLine
                  label={'Показывать фон сниппета'}
                  name={'showSnippetBackground'}
                />

                <FormikCheckboxLine
                  label={'Показывать артикул в сниппете'}
                  name={'showSnippetArticle'}
                />

                <FormikCheckboxLine
                  label={'Показывать рейтинг в сниппете'}
                  name={'showSnippetRating'}
                />

                <FormikCheckboxLine
                  label={'Показывать кнопки сниппета при наведении'}
                  name={'showSnippetButtonsOnHover'}
                />

                <FormikCheckboxLine
                  label={'Показывать фон под кнопками карточки товара'}
                  name={'showCardButtonsBackground'}
                />

                <FormikCheckboxLine
                  label={'Показывать фото товра в виде слайдера в карточке товара'}
                  name={'showCardImagesSlider'}
                />

                {/*numbers*/}
                <FormikInput
                  type={'number'}
                  name={'gridCatalogueColumns'}
                  label={'Количество колонок в каталоге'}
                  min={2}
                  max={5}
                />

                {/*layout*/}
                <FormikLayoutSelect
                  name={'cardLayout'}
                  label={'Дизайн карточки товара'}
                  options={CARD_LAYOUT_OPTIONS}
                />

                <FormikLayoutSelect
                  name={'gridSnippetLayout'}
                  label={'Дизайн сниппета товара'}
                  options={GRID_SNIPPET_LAYOUT_OPTIONS}
                />

                <FormikLayoutSelect
                  name={'rowSnippetLayout'}
                  label={'Дизайн горизонтального сниппета товара'}
                  options={ROW_SNIPPET_LAYOUT_OPTIONS}
                />

                <FormikLayoutSelect
                  name={'catalogueNavLayout'}
                  label={'Дизайн выпадающего меню навигации'}
                  options={NAV_DROPDOWN_LAYOUT_OPTIONS}
                />

                <FormikLayoutSelect
                  name={'catalogueFilterLayout'}
                  label={'Дизайн фильтра каталога'}
                  options={[]}
                />

                <FixedButtons>
                  <Button size={'small'} type={'submit'} testId={'rubric-variant-submit'}>
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

interface RubricVariantsPageInterface extends PagePropsInterface, RubricVariantConsumerInterface {}

const RubricVariantPage: NextPage<RubricVariantsPageInterface> = ({ pageUrls, rubricVariant }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricVariantConsumer rubricVariant={rubricVariant} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricVariantsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.rubricVariantId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const rubricVariantsCollection = db.collection(COL_RUBRIC_VARIANTS);
  const initialRubricVariant = await rubricVariantsCollection.findOne({
    _id: new ObjectId(`${query.rubricVariantId}`),
  });

  if (!initialRubricVariant) {
    return {
      notFound: true,
    };
  }

  const rubricVariant = {
    ...initialRubricVariant,
    name: getFieldStringLocale(initialRubricVariant.nameI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      rubricVariant: castDbData(rubricVariant),
    },
  };
};

export default RubricVariantPage;
