import WpButton from 'components/button/WpButton';
import FixedButtons from 'components/button/FixedButtons';
import WpIconUpload from 'components/FormElements/Upload/WpIconUpload';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import CategoryMainFields from 'components/FormTemplates/CategoryMainFields';
import Inner from 'components/Inner';
import SeoContentEditor from 'components/SeoContentEditor';
import { DEFAULT_COMPANY_SLUG, GENDER_ENUMS, ROUTE_CMS } from 'config/common';
import { getConsoleCategoryDetails } from 'db/dao/category/getConsoleCategoryDetails';
import { OptionVariantsModel } from 'db/dbModels';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  SeoContentCitiesInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import CmsCategoryLayout from 'layout/cms/CmsCategoryLayout';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { updateCategorySchema } from 'validation/categorySchema';

interface CategoryDetailsInterface {
  category: CategoryInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
  companySlug: string;
}

const CategoryDetails: React.FC<CategoryDetailsInterface> = ({
  category,
  companySlug,
  seoDescriptionBottom,
  seoDescriptionTop,
}) => {
  const validationSchema = useValidationSchema({
    schema: updateCategorySchema,
  });
  const {
    onCompleteCallback,
    onErrorCallback,
    showLoading,
    router,
    showErrorNotification,
    hideLoading,
  } = useMutationCallbacks({
    reload: true,
  });
  const [updateCategoryMutation] = useUpdateCategoryMutation({
    onCompleted: (data) => onCompleteCallback(data.updateCategory),
    onError: onErrorCallback,
  });

  const {
    _id = '',
    nameI18n,
    rubricId,
    rubric,
    gender,
    image,
    variants,
    replaceParentNameInCatalogueTitle,
  } = category;
  const variantKeys = Object.keys(variants);

  const initialValues: UpdateCategoryInput = {
    categoryId: _id,
    rubricId,
    nameI18n,
    textBottom: seoDescriptionBottom,
    textTop: seoDescriptionTop,
    gender: gender ? (`${gender}` as Gender) : null,
    replaceParentNameInCatalogueTitle,
    companySlug,
    variants:
      variantKeys.length > 0
        ? variants
        : GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
            acc[gender] = {};
            return acc;
          }, {}),
  };

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${category.name}`,
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubricId}`,
      },
      {
        name: `Категории`,
        href: `${ROUTE_CMS}/rubrics/${rubricId}/categories`,
      },
    ],
  };

  return (
    <CmsCategoryLayout category={category} breadcrumbs={breadcrumbs}>
      <Inner testId={'category-details'}>
        <WpImageUpload
          previewUrl={image}
          testId={'image'}
          label={'Изображение'}
          removeImageHandler={() => {
            showLoading();
            const formData = new FormData();
            formData.append('categoryId', `${category._id}`);

            fetch('/api/category/update-category-image', {
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
              formData.append('categoryId', `${category._id}`);

              fetch('/api/category/update-category-image', {
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
          previewIcon={category.icon?.icon}
          testId={'icon'}
          label={'Иконка'}
          removeImageHandler={() => {
            showLoading();
            const formData = new FormData();
            formData.append('categoryId', `${category._id}`);

            fetch('/api/category/update-category-icon', {
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
              formData.append('categoryId', `${category._id}`);

              fetch('/api/category/update-category-icon', {
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
          validationSchema={validationSchema}
          initialValues={initialValues}
          enableReinitialize
          onSubmit={(values) => {
            showLoading();
            return updateCategoryMutation({
              variables: {
                input: values,
              },
            });
          }}
        >
          {() => {
            return (
              <Form>
                <CategoryMainFields />

                <SeoContentEditor label={'SEO текст вверху каталога'} filedName={'textTop'} />
                <SeoContentEditor label={'SEO текст внизу каталога'} filedName={'textBottom'} />

                <FixedButtons>
                  <WpButton type={'submit'} testId={'category-submit'} size={'small'}>
                    Сохранить
                  </WpButton>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsCategoryLayout>
  );
};

interface CategoryPageInterface extends GetAppInitialDataPropsInterface, CategoryDetailsInterface {}

const CategoryPage: NextPage<CategoryPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CategoryDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CategoryPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.categoryId) {
    return {
      notFound: true,
    };
  }
  const companySlug = DEFAULT_COMPANY_SLUG;

  const payload = await getConsoleCategoryDetails({
    categoryId: `${query.categoryId}`,
    locale: props.sessionLocale,
    companySlug,
  });

  if (!payload) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      seoDescriptionBottom: castDbData(payload.seoDescriptionBottom),
      seoDescriptionTop: castDbData(payload.seoDescriptionTop),
      category: castDbData(payload.category),
      companySlug,
    },
  };
};

export default CategoryPage;
