import { AttributeModel } from '../entities/Attribute';
import { OptionModel, OptionVariant } from '../entities/Option';
import getLangField from './translations/getLangField';
import { GenderEnum } from '../entities/commonEntities';
import { Rubric, RubricModel } from '../entities/Rubric';
import capitalize from 'capitalize';
import { AttributesGroupModel } from '../entities/AttributesGroup';
import { OptionsGroupModel } from '../entities/OptionsGroup';
import { updateModelViews } from './updateModelViews';
import { Translation } from '../entities/Translation';
import {
  ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD,
  ATTRIBUTE_POSITION_IN_TITLE_BEGIN,
  ATTRIBUTE_POSITION_IN_TITLE_END,
  ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD,
  DEFAULT_LANG,
  LANG_DEFAULT_TITLE_SEPARATOR,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  LANG_SECONDARY_TITLE_SEPARATOR,
  SORT_DESC_NUM,
} from '@yagu/shared';
import { mongoose } from '@typegoose/typegoose';
import {
  CatalogueFilterAttribute,
  CatalogueFilterAttributeOption,
} from '../entities/CatalogueData';
import { getBooleanFromArray } from './getBooleanFromArray';

interface ProcessedAttributeInterface {
  key: string;
  value: string[];
}

interface SetCataloguePrioritiesInterface {
  rubric: Rubric;
  attributesGroupsIds: string[];
  processedAttributes: ProcessedAttributeInterface[];
  isStuff: boolean;
  city: string;
}

export async function setCataloguePriorities({
  attributesGroupsIds,
  processedAttributes,
  rubric,
  isStuff,
  city,
}: SetCataloguePrioritiesInterface) {
  // if user is not stuff
  if (!isStuff) {
    const rubricIdString = rubric.id.toString();

    // increase rubric priority
    await updateModelViews({
      model: RubricModel,
      document: rubric,
      city,
      findCurrentView: ({ key }) => key === city,
    });

    const attributesSlugs = processedAttributes.reduce(
      (acc: string[], { key }) => [...acc, key],
      [],
    );
    const optionsSlugs = processedAttributes.reduce(
      (acc: string[], { value }) => [...acc, ...value],
      [],
    );

    // increase attributes priority
    const attributesGroups = await AttributesGroupModel.find({ _id: { $in: attributesGroupsIds } });
    const attributesIds = attributesGroups.reduce(
      (acc: string[], { attributes }) => [...acc, ...attributes],
      [],
    );

    const attributesList = await AttributeModel.find({
      $and: [{ _id: { $in: attributesIds } }, { slug: { $in: attributesSlugs } }],
    });

    for await (const attribute of attributesList) {
      const { optionsGroup } = attribute;
      const attributeIdString = attribute.id.toString();

      await updateModelViews({
        model: AttributeModel,
        document: attribute,
        city,
        additionalCityCounterData: {
          rubricId: rubricIdString,
        },
        findCurrentView: ({ key, rubricId }) => {
          return key === city && rubricId === rubricIdString;
        },
      });

      // increase options priority
      const attributeOptionsGroup = await OptionsGroupModel.findOne({ _id: optionsGroup });
      if (attributeOptionsGroup) {
        for await (const slug of optionsSlugs) {
          const option = await OptionModel.findOne({
            _id: { $in: attributeOptionsGroup.options },
            slug,
          });
          if (option) {
            await updateModelViews({
              model: OptionModel,
              document: option,
              city,
              additionalCityCounterData: {
                rubricId: rubricIdString,
                attributeId: attributeIdString,
              },
              findCurrentView: ({ key, rubricId, attributeId }) => {
                return (
                  key === city && rubricId === rubricIdString && attributeId === attributeIdString
                );
              },
            });
          }
        }
      }
    }
  }
}

export interface GetOptionFromParamPayloadInterface {
  key: string;
  value: string[];
}

export function getOptionFromParam(paramString: string): GetOptionFromParamPayloadInterface {
  const param = paramString.split('-');
  return { key: `${param[0]}`, value: [`${param[1]}`] };
}

interface GetParamOptionValueByKeyInterface {
  paramOptions: GetOptionFromParamPayloadInterface[];
  key: string;
}

export function getParamOptionValueByKey({
  key,
  paramOptions,
}: GetParamOptionValueByKeyInterface): string[] {
  const currentOption = paramOptions.find((option) => option.key === key);
  if (!currentOption) {
    return [];
  }
  return currentOption.value;
}

interface GetParamOptionFirstValueByKey extends GetParamOptionValueByKeyInterface {
  defaultValue?: string | null;
}

export function getParamOptionFirstValueByKey({
  key,
  paramOptions,
  defaultValue,
}: GetParamOptionFirstValueByKey): string | null | undefined {
  const currentOptionValues = getParamOptionValueByKey({ key, paramOptions });
  const firstValue = currentOptionValues[0];

  if (!firstValue) {
    return defaultValue;
  }
  return firstValue;
}

export function attributesReducer(
  acc: { key: string; value: string[] }[] = [],
  item: string,
): ProcessedAttributeInterface[] {
  const param = getOptionFromParam(item);
  const existingParam = acc.findIndex((item) => item.key === param.key);
  if (existingParam >= 0) {
    const existingItem = acc[existingParam];
    acc[existingParam] = {
      key: param.key,
      value: [...existingItem.value, ...param.value],
    };
    return [...acc];
  }
  return [...acc, { key: param.key, value: param.value }];
}

export function getAttributesPipeline(processedAttributes: ProcessedAttributeInterface[]) {
  return processedAttributes.map(({ key, value }) => {
    return {
      'attributesGroups.attributes': {
        $elemMatch: {
          key,
          value: { $in: value },
        },
      },
    };
  });
}

interface GetCatalogueTitleInterface {
  processedAttributes: ProcessedAttributeInterface[];
  lang: string;
  rubric: Rubric;
}

interface GetTitleConfigsInterface {
  processedAttributes: ProcessedAttributeInterface[];
  lang: string;
}

interface GetTitleStringsInterface {
  processedAttributes: ProcessedAttributeInterface[];
  lang: string;
  rubricGender: GenderEnum;
  titleSeparator: string;
}

interface TitleConfigInterface {
  positioningInTitle: string;
  options: {
    variants?: OptionVariant[] | null;
    name: Translation[];
    gender?: GenderEnum | null;
  }[];
}

interface TitleStringsInterface {
  positioningInTitle: string;
  value: string;
}

async function getTitleConfigs({
  processedAttributes,
  lang,
}: GetTitleConfigsInterface): Promise<TitleConfigInterface[]> {
  return Promise.all(
    processedAttributes.map(async ({ key, value }) => {
      const attribute = await AttributeModel.findOne({ slug: key }).select({
        positioningInTitle: 1,
      });

      const options = await OptionModel.find({ slug: { $in: value } }).select({
        variants: 1,
        name: 1,
        gender: 1,
      });

      const optionsVariants = options.map(({ variants, name, gender }) => {
        return {
          variants,
          name,
          gender,
        };
      });

      return {
        positioningInTitle: getLangField(attribute!.positioningInTitle, lang),
        options: optionsVariants,
      };
    }),
  );
}

async function getTitleStrings({
  processedAttributes,
  lang,
  rubricGender,
  titleSeparator,
}: GetTitleStringsInterface): Promise<TitleStringsInterface[]> {
  const titleConfigs = await getTitleConfigs({ processedAttributes, lang });
  const replaceAttributesGenders = titleConfigs.reduce(
    (acc: GenderEnum[], { positioningInTitle, options }) => {
      if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
        const gendersList = options.reduce((genderAcc: GenderEnum[], { gender }) => {
          if (gender) {
            return [...genderAcc, gender];
          }
          return genderAcc;
        }, []);

        return [...acc, ...gendersList];
      }
      return acc;
    },
    [],
  );

  const finalGender = replaceAttributesGenders.length ? replaceAttributesGenders[0] : rubricGender;

  return titleConfigs.map(({ positioningInTitle, options }) => {
    return {
      positioningInTitle,
      value: options
        .map(({ variants, name }) => {
          if (variants && variants.length) {
            const currentVariant = variants.find(({ key }) => {
              return key === finalGender;
            });
            if (!currentVariant) {
              return LANG_NOT_FOUND_FIELD_MESSAGE;
            }
            return getLangField(currentVariant.value, lang);
          }
          return getLangField(name, lang);
        })
        .join(titleSeparator),
    };
  });
}

export async function getCatalogueTitle({
  processedAttributes,
  lang,
  rubric,
}: GetCatalogueTitleInterface): Promise<string> {
  const {
    catalogueTitle: { gender, defaultTitle, keyword, prefix },
  } = rubric;

  if (!processedAttributes.length || !processedAttributes) {
    return getLangField(defaultTitle, lang);
  }

  const titleSeparator =
    lang === DEFAULT_LANG ? LANG_DEFAULT_TITLE_SEPARATOR : LANG_SECONDARY_TITLE_SEPARATOR;

  const titleConfigs = await getTitleStrings({
    processedAttributes,
    lang,
    rubricGender: gender,
    titleSeparator,
  });
  const rubricKeyword = getLangField(keyword, lang);

  const finalPrefix = prefix ? getLangField(prefix, lang) : '';
  const beginOfTitle: string[] = [];
  const beforeKeyword: string[] = [];
  let finalKeyword = rubricKeyword;
  const afterKeyword: string[] = [];
  const endOfTitle: string[] = [];

  titleConfigs.forEach(({ positioningInTitle, value }) => {
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_BEGIN) {
      beginOfTitle.push(value);
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_BEFORE_KEYWORD) {
      beforeKeyword.push(value);
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_REPLACE_KEYWORD) {
      if (finalKeyword === rubricKeyword) {
        finalKeyword = value;
      } else {
        finalKeyword = finalKeyword + titleSeparator + value;
      }
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_AFTER_KEYWORD) {
      afterKeyword.push(value);
    }
    if (positioningInTitle === ATTRIBUTE_POSITION_IN_TITLE_END) {
      endOfTitle.push(value);
    }
  });

  return capitalize(
    [finalPrefix, ...beginOfTitle, ...beforeKeyword, finalKeyword, ...afterKeyword, ...endOfTitle]
      .join(' ')
      .toLocaleLowerCase(),
  );
}

interface GetCatalogueAdditionalFilterOptionsInterface {
  productForeignField: string;
  allProductsPipeline: Record<string, any>[];
  collectionSlugs: string[];
  rubricsIds: string[];
  catalogueFilterArgs: string[];
  collection: string;
  filterKey: string;
  city: string;
}

export async function getCatalogueAdditionalFilterOptions({
  allProductsPipeline,
  catalogueFilterArgs,
  productForeignField,
  collectionSlugs,
  rubricsIds,
  collection,
  filterKey,
  city,
}: GetCatalogueAdditionalFilterOptionsInterface): Promise<CatalogueFilterAttributeOption[]> {
  const currentCatalogueSlug = catalogueFilterArgs.join('/');
  return mongoose.connection.db
    .collection<CatalogueFilterAttributeOption>(collection)
    .aggregate([
      // Unwind by views counter
      { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },

      // Filter unwinded brands by current city or empty views
      { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },

      // Lookup products
      {
        $lookup: {
          from: 'products',
          let: { slug: '$slug' },
          pipeline: [
            ...allProductsPipeline,
            {
              $match: {
                active: true,
                rubrics: { $in: rubricsIds },
                $expr: {
                  $and: [{ $eq: [productForeignField, '$$slug'] }],
                },
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: 'products',
        },
      },

      // Count products
      { $addFields: { productsCount: { $size: '$products' } } },

      // Sort pipeline
      // sort by priority/views (default)
      // and productsCount
      {
        $sort: {
          'views.counter': SORT_DESC_NUM,
          productsCount: SORT_DESC_NUM,
          _id: SORT_DESC_NUM,
        },
      },

      // Add isDisabled field based on productsCount
      {
        $addFields: {
          isDisabled: {
            $lt: ['$productsCount', 1],
          },
        },
      },

      // Add isSelected field based on query args
      {
        $addFields: {
          isSelected: {
            $in: ['$slug', collectionSlugs],
          },
        },
      },

      // Add nextSlug field based on query args
      {
        $addFields: {
          itemSlug: {
            $concat: [`${filterKey}-`, '$slug'],
          },
        },
      },
      {
        $addFields: {
          resetSlugsList: {
            $filter: {
              input: catalogueFilterArgs,
              as: 'filterArg',
              cond: { $ne: ['$$filterArg', '$itemSlug'] },
            },
          },
        },
      },
      {
        $addFields: {
          optionNextSlug: {
            $cond: {
              if: '$isSelected',
              then: {
                $reduce: {
                  input: '$resetSlugsList',
                  initialValue: '',
                  in: { $concat: ['$$value', '/', '$$this'] },
                },
              },
              else: {
                $concat: ['/', currentCatalogueSlug, '/', `$itemSlug`],
              },
            },
          },
        },
      },
      {
        $project: {
          id: '$_id',
          nameString: 1,
          optionNextSlug: 1,
          isSelected: 1,
          isDisabled: 1,
          counter: '$productsCount',
        },
      },
    ])
    .toArray();
}

export interface GetCatalogueAttributeInterface {
  id: string;
  nameString: string;
  options: CatalogueFilterAttributeOption[];
  catalogueFilter: string[];
  catalogueFilterExcludeKey: string;
}

export async function getCatalogueAttribute({
  id,
  nameString,
  options,
  catalogueFilter,
  catalogueFilterExcludeKey,
}: GetCatalogueAttributeInterface): Promise<CatalogueFilterAttribute> {
  const otherSelectedValues = catalogueFilter.filter((option) => {
    return !option.includes(catalogueFilterExcludeKey);
  });
  const clearSlug = `/${otherSelectedValues.join('/')}`;
  const isSelected = getBooleanFromArray(options, ({ isSelected }) => {
    return isSelected;
  });
  const sortedOptions = options.sort((optionA, optionB) => {
    const isDisabledA = optionA.isDisabled ? 0 : 1;
    const isDisabledB = optionB.isDisabled ? 0 : 1;
    return isDisabledB - isDisabledA;
  });
  const disabledOptionsCount = sortedOptions.reduce((acc: number, { isDisabled }) => {
    if (isDisabled) {
      return acc + 1;
    }
    return acc;
  }, 0);
  return {
    id,
    nameString,
    clearSlug,
    options: sortedOptions,
    isDisabled: disabledOptionsCount === sortedOptions.length,
    isSelected,
  };
}
