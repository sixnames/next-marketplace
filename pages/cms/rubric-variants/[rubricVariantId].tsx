import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
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
  DEFAULT_LAYOUT,
  NAV_DROPDOWN_LAYOUT_OPTIONS,
  ROW_SNIPPET_LAYOUT_OPTIONS,
  CATALOGUE_FILTER_LAYOUT_OPTIONS,
  CATALOGUE_HEAD_LAYOUT_OPTIONS,
} from 'config/constantSelects';
import { COL_RUBRIC_VARIANTS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, RubricVariantInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import {
  UpdateRubricVariantInput,
  useUpdateRubricVariantMutation,
} from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
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
            cardLayout: rubricVariant.cardLayout || DEFAULT_LAYOUT,
            gridSnippetLayout: rubricVariant.gridSnippetLayout || DEFAULT_LAYOUT,
            rowSnippetLayout: rubricVariant.rowSnippetLayout || DEFAULT_LAYOUT,
            catalogueFilterLayout: rubricVariant.catalogueFilterLayout || DEFAULT_LAYOUT,
            catalogueHeadLayout: rubricVariant.catalogueHeadLayout || DEFAULT_LAYOUT,
            catalogueNavLayout: rubricVariant.catalogueNavLayout || DEFAULT_LAYOUT,
            showSnippetConnections: rubricVariant.showSnippetConnections || false,
            showSnippetBackground: rubricVariant.showSnippetBackground || false,
            showSnippetArticle: rubricVariant.showSnippetArticle || false,
            showCardArticle: rubricVariant.showCardArticle || false,
            showSnippetRating: rubricVariant.showSnippetRating || false,
            showSnippetButtonsOnHover: rubricVariant.showSnippetButtonsOnHover || false,
            showCardButtonsBackground: rubricVariant.showCardButtonsBackground || false,
            showCardImagesSlider: rubricVariant.showCardImagesSlider || false,
            showCatalogueFilterBrands: rubricVariant.showCatalogueFilterBrands || false,
            showCategoriesInFilter: rubricVariant.showCategoriesInFilter || false,
            showCategoriesInNav: rubricVariant.showCategoriesInNav || false,
            allowDelivery: rubricVariant.allowDelivery || false,
            showCardBrands: rubricVariant.showCardBrands || false,
            cardBrandsLabelI18n: rubricVariant.cardBrandsLabelI18n || {},
            gridCatalogueColumns: rubricVariant.gridCatalogueColumns || 3,
            navCategoryColumns: rubricVariant.navCategoryColumns || 4,
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
                  label={'Показывать связи сниппета'}
                  name={'showSnippetConnections'}
                />

                <FormikCheckboxLine
                  label={'Показывать фон сниппета'}
                  name={'showSnippetBackground'}
                />

                <FormikCheckboxLine
                  label={'Показывать артикул в сниппете'}
                  name={'showSnippetArticle'}
                />

                <FormikCheckboxLine
                  label={'Показывать артикул в карточке'}
                  name={'showCardArticle'}
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
                  label={'Показывать фото товара в виде слайдера в карточке товара'}
                  name={'showCardImagesSlider'}
                />

                <FormikCheckboxLine
                  label={'Показывать бренды / линейки брендов / производителей в фильтре каталога'}
                  name={'showCatalogueFilterBrands'}
                />

                <FormikCheckboxLine
                  label={'Показывать бренд / линейку бренда / производителя в карточке товара'}
                  name={'showCardBrands'}
                />

                <FormikCheckboxLine
                  label={'Показывать категории в фильтре каталога'}
                  name={'showCategoriesInFilter'}
                />

                <FormikCheckboxLine
                  label={'Показывать категории в навигации каталога'}
                  name={'showCategoriesInNav'}
                />

                <FormikCheckboxLine label={'Разрешить доставку товара'} name={'allowDelivery'} />

                {/*strings*/}
                <FormikTranslationsInput
                  name={'cardBrandsLabelI18n'}
                  label={
                    'Заголовок секции с информацией о бренде / линейке бренда / производителе в карточке товара'
                  }
                />

                {/*numbers*/}
                <FormikInput
                  type={'number'}
                  name={'gridCatalogueColumns'}
                  label={'Количество колонок в каталоге'}
                  min={2}
                  max={5}
                />

                <FormikInput
                  type={'number'}
                  name={'navCategoryColumns'}
                  label={'Количество колонок категорий в выпадающем меню'}
                  min={2}
                  max={4}
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
                  options={CATALOGUE_FILTER_LAYOUT_OPTIONS}
                />

                <FormikLayoutSelect
                  name={'catalogueHeadLayout'}
                  label={'Дизайн шапки каталога'}
                  options={CATALOGUE_HEAD_LAYOUT_OPTIONS}
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

interface RubricVariantsPageInterface
  extends GetAppInitialDataPropsInterface,
    RubricVariantConsumerInterface {}

const RubricVariantPage: NextPage<RubricVariantsPageInterface> = ({
  layoutProps,
  rubricVariant,
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricVariantConsumer rubricVariant={rubricVariant} />
    </ConsoleLayout>
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
