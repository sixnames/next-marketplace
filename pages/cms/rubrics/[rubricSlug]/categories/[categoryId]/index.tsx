import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import WpIconUpload from 'components/FormElements/Upload/WpIconUpload';
import WpImageUpload from 'components/FormElements/Upload/WpImageUpload';
import CategoryMainFields from 'components/FormTemplates/CategoryMainFields';
import Inner from 'components/Inner';
import CmsCategoryLayout from 'components/layout/cms/CmsCategoryLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import SeoContentEditor from 'components/SeoContentEditor';
import { OptionVariantsModel } from 'db/dbModels';
import { getConsoleCategoryDetails } from 'db/ssr/categories/getConsoleCategoryDetails';
import {
  AppContentWrapperBreadCrumbs,
  CategoryInterface,
  SeoContentCitiesInterface,
} from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { Gender, UpdateCategoryInput, useUpdateCategoryMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { DEFAULT_COMPANY_SLUG, GENDER_ENUMS } from 'lib/config/common';
import { getProjectLinks } from 'lib/links/getProjectLinks';

import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { updateCategorySchema } from 'validation/categorySchema';

interface CategoryDetailsInterface {
  category: CategoryInterface;
  seoDescriptionTop: SeoContentCitiesInterface;
  seoDescriptionBottom: SeoContentCitiesInterface;
  companySlug?: string;
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
    companySlug: companySlug || DEFAULT_COMPANY_SLUG,
    variants:
      variantKeys.length > 0
        ? variants
        : GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
            acc[gender] = {};
            return acc;
          }, {}),
  };

  const links = getProjectLinks({
    rubricSlug: `${rubric?.slug}`,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${category.name}`,
    config: [
      {
        name: '????????????????????',
        href: links.cms.rubrics.url,
      },
      {
        name: `${rubric?.name}`,
        href: links.cms.rubrics.rubricSlug.url,
      },
      {
        name: `??????????????????`,
        href: links.cms.rubrics.rubricSlug.categories.url,
      },
    ],
  };

  return (
    <CmsCategoryLayout category={category} breadcrumbs={breadcrumbs}>
      <Inner testId={'category-details'}>
        <WpImageUpload
          previewUrl={image}
          testId={'image'}
          label={'??????????????????????'}
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
          label={'????????????'}
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

                <SeoContentEditor label={'SEO ?????????? ???????????? ????????????????'} filedName={'textTop'} />
                <SeoContentEditor label={'SEO ?????????? ?????????? ????????????????'} filedName={'textBottom'} />

                <FixedButtons>
                  <WpButton type={'submit'} testId={'category-submit'} size={'small'}>
                    ??????????????????
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
