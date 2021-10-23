import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { ProductFormValuesInterface } from 'components/FormTemplates/ProductMainFields';
import Inner from 'components/Inner';
import TextSeoInfo from 'components/TextSeoInfo';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface, ProductInterface, RubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateProductMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { useReloadListener } from 'hooks/useReloadListener';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsProductLayout from 'layout/cms/CmsProductLayout';
import { getCmsProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateProductSchema } from 'validation/productSchema';

interface ProductDetailsInterface {
  product: ProductInterface;
  rubric: RubricInterface;
  currentCompany?: CompanyInterface | null;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ product, currentCompany, rubric }) => {
  const { setReloadToTrue } = useReloadListener();
  const validationSchema = useValidationSchema({
    schema: updateProductSchema,
  });
  const { onErrorCallback, onCompleteCallback, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [updateProductMutation] = useUpdateProductMutation({
    onError: onErrorCallback,
    onCompleted: (data) => {
      setReloadToTrue();
      onCompleteCallback(data.updateProduct);
    },
  });

  const {
    nameI18n,
    originalName,
    descriptionI18n,
    active,
    mainImage,
    barcode,
    gender,
    cardDescription,
  } = product;

  const initialValues: ProductFormValuesInterface = {
    productId: `${product._id}`,
    nameI18n: nameI18n || {},
    originalName,
    descriptionI18n,
    active,
    barcode: barcode || [],
    gender: gender as any,
    cardDescriptionI18n: cardDescription?.textI18n || {},
    companySlug: `${currentCompany?.slug}`,
  };

  const basePath = `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${product.cardTitle}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: basePath,
      },
      {
        name: `Рубрикатор`,
        href: `${basePath}/rubrics`,
      },
      {
        name: `${rubric.name}`,
        href: `${basePath}/rubrics/${rubric._id}`,
      },
      {
        name: `Товары`,
        href: `${basePath}/rubrics/${rubric._id}/products/${rubric._id}`,
      },
    ],
  };

  return (
    <CmsProductLayout
      hideAssetsPath
      hideAttributesPath
      hideBrandPath
      hideCategoriesPath
      hideConnectionsPath
      product={product}
      basePath={basePath}
      breadcrumbs={breadcrumbs}
    >
      <Inner testId={'product-details'}>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={(values) => {
            showLoading();
            return updateProductMutation({
              variables: {
                input: {
                  ...values,
                  productId: product._id,
                  barcode: (values.barcode || []).filter((currentBarcode) => {
                    return Boolean(currentBarcode);
                  }),
                },
              },
            });
          }}
        >
          {() => {
            return (
              <Form noValidate>
                <div className='relative w-[15rem] h-[15rem] mb-8'>
                  <Image
                    src={mainImage}
                    alt={originalName}
                    title={originalName}
                    layout='fill'
                    objectFit='contain'
                  />
                </div>

                <FormikTranslationsInput
                  variant={'textarea'}
                  className='h-[30rem]'
                  label={'Описание карточки товара'}
                  name={'cardDescriptionI18n'}
                  testId={'cardDescriptionI18n'}
                  additionalUi={(currentLocale) => {
                    if (!cardDescription?.seo) {
                      return null;
                    }
                    const seoLocale = cardDescription.seo.locales.find(({ locale }) => {
                      return locale === currentLocale;
                    });

                    if (!seoLocale) {
                      return <div className='mb-4 font-medium'>Текст проверяется</div>;
                    }

                    return (
                      <TextSeoInfo
                        seoLocale={seoLocale}
                        className='mb-4 mt-4'
                        listClassName='flex gap-3 flex-wrap'
                      />
                    );
                  }}
                />

                <FixedButtons>
                  <Button testId={'submit-product'} type={'submit'}>
                    Сохранить
                  </Button>
                </FixedButtons>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, product, currentCompany, rubric }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails product={product} rubric={rubric} currentCompany={currentCompany} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { productId, rubricId } = query;
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { props } = await getAppInitialData({ context });

  if (!props || !productId || !rubricId || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

  const payload = await getCmsProduct({
    locale: props.sessionLocale,
    productId: `${productId}`,
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
      product: castDbData(payload.product),
      rubric: castDbData(payload.rubric),
      currentCompany: castDbData(companyResult),
    },
  };
};

export default Product;
