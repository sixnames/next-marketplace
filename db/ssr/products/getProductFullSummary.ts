import { findTask } from 'db/dao/tasks/taskUtils';
import { getDbCollections } from 'db/mongodb';
import {
  AttributeInterface,
  CategoryInterface,
  ProductAttributeInterface,
  ProductSummaryInterface,
  ProductVariantInterface,
  ProductVariantItemInterface,
  RubricInterface,
  SeoContentCitiesInterface,
} from 'db/uiInterfaces';
import {
  brandPipeline,
  productCategoriesPipeline,
  productRubricPipeline,
  summaryAttributesPipeline,
} from 'db/utils/constantPipelines';
import { getFieldStringLocale } from 'lib/i18n';
import { getProductAllSeoContents } from 'lib/seoContentUtils';
import { ObjectId } from 'mongodb';

interface GetProductFullSummaryInterface {
  productId: string;
  companySlug: string;
  locale: string;
}

interface GetProductFullSummaryPayloadInterface {
  summary: ProductSummaryInterface;
  categoriesList: CategoryInterface[];
  seoContentsList: SeoContentCitiesInterface;
}

export async function getProductFullSummary({
  productId,
  locale,
  companySlug,
}: GetProductFullSummaryInterface): Promise<GetProductFullSummaryPayloadInterface | null> {
  const collections = await getDbCollections();
  const productSummariesCollection = collections.productSummariesCollection();
  const optionsCollection = collections.optionsCollection();

  const productAggregation = await productSummariesCollection
    .aggregate<ProductSummaryInterface>([
      {
        $match: {
          _id: new ObjectId(productId),
        },
      },

      // get rubric
      ...productRubricPipeline,

      // get attributes
      ...summaryAttributesPipeline(),

      // get brand
      ...brandPipeline,

      // get categories
      ...productCategoriesPipeline(),
    ])
    .toArray();
  const initialProduct = productAggregation[0];
  if (!initialProduct) {
    return null;
  }

  const { rubric, ...restProduct } = initialProduct;
  if (!rubric) {
    return null;
  }
  const castedRubric: RubricInterface = {
    ...rubric,
    name: getFieldStringLocale(rubric.nameI18n, locale),
  };

  const allProductAttributes = restProduct.attributes.reduce(
    (acc: AttributeInterface[], { attribute }) => {
      if (!attribute) {
        return acc;
      }
      return [...acc, attribute];
    },
    [],
  );

  // variants
  const variants: ProductVariantInterface[] = [];
  for await (const productVariant of initialProduct.variants) {
    const variantProducts: ProductVariantItemInterface[] = [];
    const attribute = allProductAttributes.find(({ _id }) => {
      return _id.equals(productVariant.attributeId);
    });
    if (!attribute || !attribute.options) {
      continue;
    }

    for await (const variantProduct of productVariant.products || []) {
      const variantProductSummary = await productSummariesCollection.findOne({
        _id: variantProduct.productId,
      });

      const option = await optionsCollection.findOne({
        _id: variantProduct.optionId,
      });

      if (variantProductSummary && option) {
        const isCurrent = variantProductSummary._id.equals(initialProduct._id);
        const castedVariantProducts: ProductVariantItemInterface = {
          ...variantProduct,
          isCurrent,
          summary: {
            ...variantProductSummary,
            snippetTitle: getFieldStringLocale(variantProductSummary.snippetTitleI18n, locale),
            cardTitle: getFieldStringLocale(variantProductSummary.cardTitleI18n, locale),
          },
          option: {
            ...option,
            name: getFieldStringLocale(option.nameI18n, locale),
          },
        };
        if (isCurrent) {
          variantProducts.unshift(castedVariantProducts);
        } else {
          variantProducts.push(castedVariantProducts);
        }
      }
    }

    variants.push({
      ...productVariant,
      products: variantProducts,
      attribute: attribute
        ? {
            ...attribute,
            name: getFieldStringLocale(attribute?.nameI18n, locale),
          }
        : null,
    });
  }

  // attributes
  const attributes = (initialProduct.attributes || []).reduce(
    (acc: ProductAttributeInterface[], productAttribute) => {
      const { attribute, attributeId } = productAttribute;
      if (!attribute || !attributeId) {
        return acc;
      }
      return [
        ...acc,
        {
          ...productAttribute,
          attribute: {
            ...attribute,
            name: getFieldStringLocale(attribute.nameI18n, locale),
          },
        },
      ];
    },
    [],
  );

  // title
  const cardTitle = getFieldStringLocale(restProduct.cardTitleI18n, locale);
  const snippetTitle = getFieldStringLocale(restProduct.snippetTitleI18n, locale);

  // payload
  const product: ProductSummaryInterface = {
    ...initialProduct,
    rubric: castedRubric,
    cardTitle,
    snippetTitle,
    variants,
    attributes,
  };

  // card content
  const cardContent = await getProductAllSeoContents({
    productSlug: product.slug,
    productId: product._id,
    rubricSlug: product.rubricSlug,
    companySlug,
    locale,
  });
  if (!cardContent) {
    return null;
  }

  return {
    summary: product,
    categoriesList: initialProduct.categories || [],
    seoContentsList: cardContent,
  };
}

interface GetProductFullSummaryWithDraftPayloadInterface extends GetProductFullSummaryInterface {
  taskId?: string | null;
  isContentManager?: boolean;
}

export async function getProductFullSummaryWithDraft({
  companySlug,
  isContentManager,
  locale,
  productId,
  taskId,
}: GetProductFullSummaryWithDraftPayloadInterface): Promise<GetProductFullSummaryPayloadInterface | null> {
  if (isContentManager && !taskId) {
    return null;
  }
  const summaryPayload = await getProductFullSummary({
    locale,
    productId,
    companySlug,
  });
  if (!summaryPayload) {
    return null;
  }
  // react-page-cell-insert-new
  // Text
  const { categoriesList, seoContentsList } = summaryPayload;
  let summary = summaryPayload.summary;

  if (isContentManager) {
    const task = await findTask({
      taskId,
    });
    if (task) {
      const lastLog = task.log[task.log.length - 1];
      if (lastLog) {
        const draft = lastLog.draft as ProductSummaryInterface | null;
        summary = draft || summaryPayload.summary;
      }
    }
  }

  return {
    seoContentsList,
    categoriesList,
    summary,
  };
}
