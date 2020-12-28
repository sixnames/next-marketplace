import { FieldResolver, Resolver, Root } from 'type-graphql';
import {
  Rubric,
  RubricNavItemAttribute,
  RubricNavItemAttributeOption,
  RubricNavItems,
} from '../../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import { getRubricsTreeIds } from '../../utils/rubricHelpers';
import { Types } from 'mongoose';
import { getObjectIdsArray } from '../../utils/getObjectIdsArray';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { Option, OptionModel } from '../../entities/Option';
import { LANG_NOT_FOUND_FIELD_MESSAGE, SORT_DESC_NUM } from '@yagu/shared';
import { ProductModel } from '../../entities/Product';
import { ConfigModel } from '../../entities/Config';
import { noNaN } from '../../utils/numbers';

@Resolver((_for) => Rubric)
export class RubricNavResolver {
  @FieldResolver((_returns) => RubricNavItems)
  async navItems(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { getLangField, city, lang }: LocalizationPayloadInterface,
  ): Promise<RubricNavItems> {
    try {
      let maxVisibleOptions = 5;
      const navConfig = await ConfigModel.findOne({ slug: 'stickyNavVisibleOptionsCount' });
      if (navConfig) {
        const cityData = navConfig.cities.find(({ key }) => key === city);
        const langData = cityData?.translations.find(({ key }) => key === lang);
        const value = langData?.value[0];
        if (value) {
          maxVisibleOptions = noNaN(value);
        }
      }

      // Get id's of children rubrics
      const rubricsIds = await getRubricsTreeIds(rubric.id);
      const rubricIdString = rubric.id.toString();
      const { attributesGroups, catalogueTitle } = rubric;

      // get all visible attributes id's
      const visibleAttributes = attributesGroups.reduce((acc: Types.ObjectId[], group) => {
        return [...acc, ...getObjectIdsArray(group.showInCatalogueFilter)];
      }, []);

      const attributes = await AttributeModel.aggregate<Attribute>([
        { $match: { _id: { $in: visibleAttributes } } },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
        { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
        {
          $addFields: {
            viewsCounter: {
              $cond: {
                if: {
                  $and: [
                    {
                      $eq: ['$views.key', city],
                    },
                    {
                      $eq: ['$views.rubricId', rubricIdString],
                    },
                  ],
                },
                then: '$views.counter',
                else: 0,
              },
            },
          },
        },
        { $sort: { viewsCounter: -1 } },
      ]);

      const reducedAttributes = attributes.reduce((acc: Attribute[], attribute) => {
        const { _id } = attribute;
        const exist = acc.find(({ _id: existingId }) => {
          return existingId?.toString() === _id?.toString();
        });
        if (exist) {
          return acc;
        }
        return [...acc, attribute];
      }, []);

      const navAttributes: RubricNavItemAttribute[] = [];

      for await (const attribute of reducedAttributes) {
        const attributeIdString = attribute._id?.toString();
        const optionsGroup = await OptionsGroupModel.findById(attribute.optionsGroup);
        if (!optionsGroup) {
          continue;
        }

        const options = await OptionModel.aggregate<Option>([
          { $match: { _id: { $in: optionsGroup.options } } },
          { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
          { $match: { $or: [{ 'views.key': city }, { 'views.key': { $exists: false } }] } },
          {
            $addFields: {
              viewsCounter: {
                $cond: {
                  if: {
                    $and: [
                      {
                        $eq: ['$views.key', city],
                      },
                      {
                        $eq: ['$views.rubricId', rubricIdString],
                      },
                      {
                        $eq: ['$views.attributeId', attributeIdString],
                      },
                    ],
                  },
                  then: '$views.counter',
                  else: 0,
                },
              },
            },
          },
          { $sort: { viewsCounter: SORT_DESC_NUM } },
        ]);

        const reducedOptions = options.reduce((acc: Option[], option) => {
          const { _id } = option;
          const exist = acc.find(({ _id: existingId }) => {
            return existingId?.toString() === _id?.toString();
          });
          if (exist) {
            return acc;
          }
          return [...acc, option];
        }, []);

        const resultOptions: RubricNavItemAttributeOption[] = [];

        for await (const option of reducedOptions) {
          const { variants, name } = option;
          let filterNameString: string;
          const currentVariant = variants?.find(({ key }) => key === catalogueTitle.gender);
          const currentVariantName = getLangField(currentVariant?.value);
          if (currentVariantName === LANG_NOT_FOUND_FIELD_MESSAGE) {
            filterNameString = getLangField(name);
          } else {
            filterNameString = currentVariantName;
          }

          // Count products with current option
          const products = await ProductModel.aggregate<any>([
            // Initial products match
            {
              $match: {
                rubrics: { $in: rubricsIds },
                active: true,
                'attributesGroups.attributes': {
                  $elemMatch: {
                    key: attribute.slug,
                    value: { $in: [option.slug] },
                  },
                },
              },
            },
            // Lookup shop products
            { $addFields: { productId: { $toString: '$_id' } } },
            {
              $lookup: {
                from: 'shopproducts',
                localField: 'productId',
                foreignField: 'product',
                as: 'shops',
              },
            },
            // Count shop products
            { $addFields: { shopsCount: { $size: '$shops' } } },

            // Filter out products not added to the shops
            { $match: { shopsCount: { $gt: 0 } } },
            {
              $count: 'counter',
            },
          ]);
          const counter = products[0]?.counter || 0;

          const optionSlug = `${attribute.slug}-${option.slug}`;

          resultOptions.push({
            id: option._id?.toString() + rubricIdString,
            isDisabled: counter < 1,
            nameString: filterNameString,
            slug: `/${rubric.slug}/${optionSlug}`,
            counter,
          });
        }

        const sortedOptions = resultOptions.sort((optionA, optionB) => {
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

        const enabledOptions = sortedOptions.filter(({ isDisabled }) => !isDisabled);
        const visibleOptions = enabledOptions.slice(0, maxVisibleOptions);
        const hiddenOptions = enabledOptions.slice(+maxVisibleOptions);

        navAttributes.push({
          id: attributeIdString + rubricIdString,
          options: sortedOptions,
          visibleOptions,
          hiddenOptions,
          nameString: getLangField(attribute.name),
          isDisabled: disabledOptionsCount === sortedOptions.length,
        });
      }

      const disabledAttributesCount = navAttributes.reduce((acc: number, { isDisabled }) => {
        if (isDisabled) {
          return acc + 1;
        }
        return acc;
      }, 0);

      return {
        id: rubric._id.toString(),
        attributes: navAttributes,
        isDisabled: disabledAttributesCount === navAttributes.length,
      };
    } catch (e) {
      console.log(e);
      return {
        id: rubric._id.toString(),
        attributes: [],
        isDisabled: true,
      };
    }
  }
}
