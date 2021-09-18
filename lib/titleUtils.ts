import capitalize from 'capitalize';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  FILTER_SEPARATOR,
  GENDER_IT,
  PRICE_ATTRIBUTE_SLUG,
} from 'config/common';
import { getConstantTranslation } from 'config/constantTranslations';
import {
  COL_BRANDS,
  COL_CATEGORIES,
  COL_LANGUAGES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCTS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
  COL_SHOP_PRODUCTS,
} from 'db/collectionNames';
import {
  GenderModel,
  LanguageModel,
  ObjectIdModel,
  ProductAttributeModel,
  RubricAttributeModel,
  RubricModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  AttributeInterface,
  BrandInterface,
  CategoryInterface,
  OptionInterface,
  ProductAttributeInterface,
  ProductInterface,
  ShopProductInterface,
} from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/optionsUtils';
import { get } from 'lodash';

interface TitleOptionInterface
  extends Pick<OptionInterface, 'nameI18n' | 'variants'>,
    Record<any, any> {
  options?: TitleOptionInterface[] | null;
}

interface GetTitleOptionNamesInterface {
  locale: string;
  option: TitleOptionInterface;
  finalGender: string;
  acc: string[];
}

export function getTitleOptionNames({
  finalGender,
  locale,
  option,
  acc,
}: GetTitleOptionNamesInterface): string[] {
  const variant = get(option, `variants.${finalGender}.${locale}`);
  const name = getFieldStringLocale(option.nameI18n, locale);
  const newAcc = [...acc];
  let optionValue = name;
  if (variant) {
    optionValue = variant;
  }
  newAcc.push(optionValue);

  if (!option.options || option.options.length < 1) {
    return newAcc;
  }

  return (option.options || []).reduce((childAcc: string[], childOption) => {
    const childOptionResult = getTitleOptionNames({
      finalGender,
      locale,
      option: childOption,
      acc: [],
    });
    return [...childAcc, ...childOptionResult];
  }, newAcc);
}

interface TitleAttributeInterface extends AttributeInterface, Record<any, any> {}

interface GenerateTitleInterface {
  positionFieldName: 'positioningInTitle' | 'positioningInCardTitle';
  attributeVisibilityFieldName: 'showInCatalogueTitle' | 'showInCardTitle' | 'showInSnippetTitle';
  attributeNameVisibilityFieldName:
    | 'showNameInTitle'
    | 'showNameInCardTitle'
    | 'showNameInSnippetTitle';
  attributes: TitleAttributeInterface[];
  fallbackTitle: string;
  prefix?: string | null;
  defaultKeyword?: string;
  defaultGender: string;
  locale: string;
  currency?: string;
  capitaliseKeyWord?: boolean | null;
  log?: boolean;
}

export function generateTitle({
  attributes,
  defaultGender = GENDER_IT,
  fallbackTitle,
  defaultKeyword,
  prefix,
  locale,
  currency,
  capitaliseKeyWord,
  positionFieldName,
  attributeVisibilityFieldName,
  attributeNameVisibilityFieldName,
}: GenerateTitleInterface): string {
  // get title attributes separator
  const titleSeparator = getConstantTranslation(`catalogueTitleSeparator.${locale}`);

  /*console.log({
    attributes,
    defaultGender,
    fallbackTitle,
    defaultKeyword,
    prefix,
    locale,
    currency,
    capitaliseKeyWord,
    positionFieldName,
    attributeVisibilityFieldName,
    attributeNameVisibilityFieldName,
  });*/

  // get initial keyword
  const initialKeyword = !defaultKeyword
    ? ''
    : capitaliseKeyWord
    ? defaultKeyword
    : `${defaultKeyword}`.toLowerCase();

  // get title prefix
  const finalPrefix = prefix || '';

  // title initial parts
  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];

  // set initial variables
  let finalKeyword = initialKeyword;
  let finalGender = defaultGender;

  // set final gender
  attributes.forEach((attribute) => {
    const { options } = attribute;
    const attributePositionField = get(attribute, positionFieldName);
    const positionInTitleForCurrentLocale = getFieldStringLocale(attributePositionField, locale);
    const gendersList = (options || []).reduce((genderAcc: GenderModel[], { gender }) => {
      if (
        gender &&
        positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD
      ) {
        return [...genderAcc, gender];
      }
      return genderAcc;
    }, []);

    if (gendersList.length > 0 && gendersList[0]) {
      finalGender = gendersList[0];
    }
  });

  // collect title parts
  attributes.forEach((attribute) => {
    const { nameI18n, options, capitalise, slug, metric } = attribute;
    const isPrice = slug === PRICE_ATTRIBUTE_SLUG;
    const visible = get(attribute, attributeVisibilityFieldName);
    if (!visible || !options || options.length < 1) {
      return;
    }

    const attributeNameVisibilityField = get(attribute, attributeNameVisibilityFieldName);
    const attributeName = attributeNameVisibilityField
      ? `${getFieldStringLocale(nameI18n, locale)} `
      : '';
    const attributePositionField = get(attribute, positionFieldName);
    const positionInTitleForCurrentLocale = getFieldStringLocale(attributePositionField, locale);

    // attribute metric value
    let metricValue = metric ? ` ${getFieldStringLocale(metric.nameI18n, locale)}` : '';
    if (isPrice && currency) {
      metricValue = currency;
    }

    // collect selected options
    const arrayValue = (options || []).reduce((acc: string[], option) => {
      const optionResult = getTitleOptionNames({
        locale,
        option,
        finalGender,
        acc: [],
      });
      const separator = optionResult.length > 0 && acc.length > 0 ? [titleSeparator] : [];
      return [...acc, ...separator, ...optionResult];
    }, []);
    const initialAttributeValue = `${attributeName.toLowerCase()}${arrayValue.join(
      ' ',
    )}${metricValue}`;
    const value = capitalise ? initialAttributeValue : initialAttributeValue.toLocaleLowerCase();

    // price
    if (isPrice) {
      endOfTitle.push(value);
      return;
    }

    // begin
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }

    // before keyword
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }

    // replace keyword
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      const keywordValue = capitaliseKeyWord ? value : value.toLowerCase();
      if (finalKeyword === initialKeyword) {
        finalKeyword = keywordValue;
      } else {
        finalKeyword = finalKeyword + titleSeparator + keywordValue;
      }
    }

    // after keyword
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }

    // end
    if (positionInTitleForCurrentLocale === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  // cast title parts to string
  const titleFinalArray = [
    finalPrefix,
    ...beginOfTitle,
    ...beforeKeyword,
    finalKeyword,
    ...afterKeyword,
    ...endOfTitle,
  ];

  const filteredArray = titleFinalArray.filter((word) => word);
  const firstWord = filteredArray[0];

  // return fallback if no title parts
  if (!firstWord) {
    return fallbackTitle;
  }

  const firstWordArr = firstWord.split(' ');
  const mainWord = firstWordArr[0];

  // return fallback if no title parts
  if (!mainWord) {
    return fallbackTitle;
  }

  const firstWordOtherWords = firstWordArr.slice(1);
  const otherWords = filteredArray.slice(1);
  return [capitalize(mainWord), ...firstWordOtherWords, ...otherWords].join(' ');
}

interface GenerateProductTitlePrefixInterface {
  locale: string;
  brand?: BrandInterface | null;
  rubricName?: string | null;
  defaultGender: string;
  titleCategoriesSlugs: string[];
  categories?: CategoryInterface[] | null;
  showBrandNameInProductTitle?: boolean | null;
  showRubricNameInProductTitle?: boolean | null;
  showCategoryInProductTitle?: boolean | null;
}

export function generateProductTitlePrefix({
  locale,
  rubricName,
  categories,
  brand,
  defaultGender,
  showBrandNameInProductTitle,
  showCategoryInProductTitle,
  showRubricNameInProductTitle,
  titleCategoriesSlugs,
}: GenerateProductTitlePrefixInterface): string {
  // rubric name as main prefix
  const rubricPrefix = showRubricNameInProductTitle && rubricName ? rubricName : '';
  const categoryNames: string[] = [];

  // category names as secondary prefix
  function getCategoryNames(category: CategoryInterface) {
    const visible = titleCategoriesSlugs.some((slug) => slug === category.slug);
    if (showCategoryInProductTitle) {
      const variant = get(category, `variants.${defaultGender}.${locale}`);
      const name = getFieldStringLocale(category.nameI18n, locale);
      let value = name;
      if (variant) {
        value = variant;
      }
      if (visible) {
        categoryNames.push(value);
      }
      return (category.categories || []).forEach(getCategoryNames);
    }
    return;
  }
  (categories || []).forEach(getCategoryNames);

  const brandName = showBrandNameInProductTitle
    ? getFieldStringLocale(brand?.nameI18n, locale)
    : '';

  const prefixArray = [rubricPrefix, ...categoryNames, brandName];
  const filteredArray = prefixArray.filter((word) => word);
  return filteredArray.length > 0 ? capitalize(filteredArray.join(' ')) : '';
}

interface GenerateProductTitleInterface
  extends GenerateProductTitlePrefixInterface,
    Omit<
      GenerateTitleInterface,
      | 'positionFieldName'
      | 'prefix'
      | 'capitaliseKeyWord'
      | 'attributeNameVisibilityFieldName'
      | 'fallbackTitle'
      | 'defaultKeyword'
    > {
  attributeVisibilityFieldName: 'showInCardTitle' | 'showInSnippetTitle';
  attributeNameVisibilityFieldName: 'showNameInCardTitle' | 'showNameInSnippetTitle';
  nameI18n?: TranslationModel | null;
  originalName: string;
}

function generateProductTitle({
  locale,
  rubricName,
  categories,
  showCategoryInProductTitle,
  showRubricNameInProductTitle,
  showBrandNameInProductTitle,
  attributes,
  defaultGender,
  nameI18n,
  originalName,
  currency,
  attributeVisibilityFieldName,
  attributeNameVisibilityFieldName,
  titleCategoriesSlugs,
  brand,
}: GenerateProductTitleInterface): string {
  const prefix = generateProductTitlePrefix({
    brand,
    locale,
    rubricName,
    categories,
    defaultGender,
    showCategoryInProductTitle,
    showRubricNameInProductTitle,
    showBrandNameInProductTitle,
    titleCategoriesSlugs,
  });

  const keyword = getFieldStringLocale(nameI18n, locale) || originalName;

  return generateTitle({
    attributes,
    defaultGender,
    fallbackTitle: keyword,
    defaultKeyword: keyword,
    prefix,
    locale,
    currency,
    capitaliseKeyWord: true,
    positionFieldName: 'positioningInCardTitle',
    attributeNameVisibilityFieldName,
    attributeVisibilityFieldName,
  });
}

interface GenerateCardTitleInterface
  extends Omit<
    GenerateProductTitleInterface,
    'attributeNameVisibilityFieldName' | 'attributeVisibilityFieldName'
  > {}

export function generateCardTitle(props: GenerateCardTitleInterface): string {
  return generateProductTitle({
    ...props,
    attributeNameVisibilityFieldName: 'showNameInCardTitle',
    attributeVisibilityFieldName: 'showInCardTitle',
  });
}

export function generateSnippetTitle(props: GenerateCardTitleInterface): string {
  return generateProductTitle({
    ...props,
    attributeNameVisibilityFieldName: 'showNameInSnippetTitle',
    attributeVisibilityFieldName: 'showInSnippetTitle',
  });
}

interface UpdateProductTitlesInterface {
  productId: ObjectIdModel;
  rubric: RubricModel;
}

export async function updateProductTitles({ productId, rubric }: UpdateProductTitlesInterface) {
  const { db } = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const brandsCollection = db.collection<BrandInterface>(COL_BRANDS);
  const categoriesCollection = db.collection<CategoryInterface>(COL_CATEGORIES);
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const productAttributesCollection =
    db.collection<ProductAttributeInterface>(COL_PRODUCT_ATTRIBUTES);
  const shopProductsCollection = db.collection<ShopProductInterface>(COL_SHOP_PRODUCTS);

  // get languages
  const languages = await languagesCollection.find({}).toArray();

  // get product
  const product = await productsCollection.findOne({ _id: productId });
  if (!product) {
    return;
  }

  // get product attributes
  const optionsSlugs = product.selectedOptionsSlugs.reduce((acc: string[], slug) => {
    const slugParts = slug.split(FILTER_SEPARATOR);
    if (slugParts[1]) {
      return [...acc, slugParts[1]];
    }
    return acc;
  }, []);
  const productAttributesAggregation = await productAttributesCollection
    .aggregate([
      {
        $match: {
          productId,
        },
      },
      // lookup attribute options
      {
        $lookup: {
          from: COL_OPTIONS,
          as: 'options',
          let: {
            optionsGroupId: '$optionsGroupId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$$optionsGroupId', '$optionsGroupId'],
                    },
                  ],
                },
                slug: {
                  $in: optionsSlugs,
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          optionsCount: {
            $size: '$options',
          },
        },
      },
      {
        $match: {
          optionsCount: {
            $gt: 0,
          },
        },
      },
    ])
    .toArray();

  // get categories
  const categories = await categoriesCollection
    .find({
      slug: {
        $in: product.selectedOptionsSlugs,
      },
    })
    .toArray();

  // get brand
  const brand = product.brandSlug
    ? await brandsCollection.findOne({
        slug: product.brandSlug,
      })
    : null;

  const snippetTitleI18n: TranslationModel = {};
  const cardTitleI18n: TranslationModel = {};

  languages.forEach((language) => {
    const locale = language.slug;
    const rubricName = getFieldStringLocale(rubric.nameI18n, locale);
    const attributes = productAttributesAggregation.map((attribute) => {
      return {
        ...attribute,
        options: getTreeFromList({
          list: attribute.options,
          locale,
          childrenFieldName: 'options',
        }),
      };
    });

    // get snippet title for each language
    const snippetTitle = generateSnippetTitle({
      attributes,
      locale,
      rubricName,
      nameI18n: product.nameI18n,
      originalName: product.originalName,
      titleCategoriesSlugs: product.titleCategoriesSlugs,
      defaultGender: product.gender,
      categories,
      brand,
      showBrandNameInProductTitle: rubric.showBrandInSnippetTitle,
      showCategoryInProductTitle: rubric.showCategoryInProductTitle,
      showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
    });
    snippetTitleI18n[locale] = snippetTitle;

    // get card title for each language
    const cardTitle = generateCardTitle({
      attributes,
      locale,
      rubricName,
      nameI18n: product.nameI18n,
      originalName: product.originalName,
      titleCategoriesSlugs: product.titleCategoriesSlugs,
      defaultGender: product.gender,
      categories,
      brand,
      showBrandNameInProductTitle: rubric.showBrandInCardTitle,
      showCategoryInProductTitle: rubric.showCategoryInProductTitle,
      showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
    });
    cardTitleI18n[locale] = cardTitle;
  });

  // update product
  const updater = {
    $set: {
      snippetTitleI18n,
      cardTitleI18n,
    },
  };

  // console.log(updater);
  await productsCollection.findOneAndUpdate(
    {
      _id: product._id,
    },
    updater,
  );

  // update shop products
  await shopProductsCollection.updateMany(
    {
      productId: product._id,
    },
    updater,
  );
}

interface UpdateRubricProductTitlesInterface {
  rubricId: ObjectIdModel;
}

export async function updateRubricProductTitles({ rubricId }: UpdateRubricProductTitlesInterface) {
  const { db } = await getDatabase();
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);
  const rubric = await rubricsCollection.findOne({ _id: rubricId });
  if (!rubric) {
    return;
  }

  const products = await productsCollection
    .aggregate([
      {
        $match: {
          rubricSlug: rubric.slug,
        },
      },
      {
        $project: {
          _id: true,
        },
      },
    ])
    .toArray();

  for await (const product of products) {
    await updateProductTitles({
      productId: product._id,
      rubric,
    });
  }
}

interface UpdateProductTitlesWithUpdatedAttributeInterface {
  attributeId: ObjectIdModel;
}

export async function updateProductTitlesWithUpdatedAttribute({
  attributeId,
}: UpdateProductTitlesWithUpdatedAttributeInterface) {
  const { db } = await getDatabase();
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  const productsCollection = db.collection<ProductInterface>(COL_PRODUCTS);

  const rubrics = await rubricAttributesCollection
    .aggregate<RubricModel>([
      {
        $match: {
          attributeId,
        },
      },
      {
        $group: {
          _id: '$rubricId',
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: {
            rubricId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$_id'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          rubric: {
            $arrayElemAt: ['$rubric', 0],
          },
        },
      },
      {
        $match: {
          rubric: {
            $exists: true,
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: '$rubric',
        },
      },
    ])
    .toArray();

  for await (const rubric of rubrics) {
    const productIdsAggregation = await productAttributesCollection
      .aggregate([
        {
          $match: {
            attributeId,
          },
        },
        {
          $group: {
            _id: '$productId',
          },
        },
        {
          $group: {
            _id: null,
            productIds: {
              $addToSet: '$_id',
            },
          },
        },
        {
          $unwind: {
            path: '$productIds',
          },
        },
        {
          $project: {
            _id: '$productIds',
          },
        },
      ])
      .toArray();
    const productIds = productIdsAggregation.map(({ _id }) => _id);

    const products = await productsCollection
      .aggregate([
        {
          $match: {
            _id: {
              $in: productIds,
            },
          },
        },
        {
          $project: {
            _id: true,
          },
        },
      ])
      .toArray();

    for await (const product of products) {
      await updateProductTitles({
        productId: product._id,
        rubric,
      });
    }
  }
}
