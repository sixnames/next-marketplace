import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import {
  Rubric,
  RubricAttributesGroup,
  RubricCatalogueTitleField,
  RubricModel,
  RubricCatalogueTitle,
  RubricFilterAttribute,
  RubricFilterAttributeOption,
} from '../../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import getLangField from '../../utils/translations/getLangField';
import getCityData from '../../utils/getCityData';
import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateDefaultLangSlug } from '../../utils/slug';
import PayloadType from '../common/PayloadType';
import { CreateRubricInput } from './CreateRubricInput';
import { UpdateRubricInput } from './UpdateRubricInput';
import { FilterQuery } from 'mongoose';
import { AddAttributesGroupToRubricInput } from './AddAttributesGroupToRubricInput';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { DeleteAttributesGroupFromRubricInput } from './DeleteAttributesGroupFromRubricInput';
import { ProductModel } from '../../entities/Product';
import { AddProductToRubricInput } from './AddProductToRubricInput';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { PaginatedProductsResponse } from '../product/ProductResolver';
import { RubricProductPaginateInput } from './RubricProductPaginateInput';
import { DeleteProductFromRubricInput } from './DeleteProductFromRubricInput';
import {
  getDeepRubricChildrenIds,
  getRubricCounters,
  getRubricsTreeIds,
} from '../../utils/rubricResolverHelpers';
import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_LANG,
  DEFAULT_PRIORITY,
  GENDER_IT,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_STEP,
  RUBRIC_LEVEL_ZERO,
} from '../../config';
import { UpdateAttributesGroupInRubricInput } from './UpdateAttributesGroupInRubric';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import toggleItemInArray from '../../utils/toggleItemInArray';
import { GenderEnum, LanguageType } from '../../entities/common';
import getApiMessage from '../../utils/translations/getApiMessage';
import {
  addAttributesGroupToRubricInputSchema,
  addProductToRubricInputSchema,
  createRubricInputSchema,
  deleteAttributesGroupFromRubricInputSchema,
  deleteProductFromRubricInputSchema,
  updateAttributesGroupInRubricInputSchema,
  updateRubricInputSchema,
} from '../../validation/rubricSchema';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { OptionModel } from '../../entities/Option';

interface ParentRelatedDataInterface {
  variant: string;
  level: number;
  parent?: string | null;
}

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = getOperationsConfigs(Rubric.name);

@ObjectType()
class RubricPayloadType extends PayloadType() {
  @Field((_type) => Rubric, { nullable: true })
  rubric?: Rubric | null;
}

@Resolver((_of) => Rubric)
export class RubricResolver {
  @Query(() => Rubric)
  @AuthMethod(operationConfigRead)
  async getRubric(
    @Localization() { city }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Rubric>,
    @Arg('id', (_type) => ID) id: string,
  ) {
    return RubricModel.findOne({ _id: id, 'cities.key': city, ...customFilter });
  }

  @Query(() => Rubric)
  async getRubricBySlug(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('slug', (_type) => String) slug: string,
  ) {
    return RubricModel.findOne({
      cities: {
        $elemMatch: {
          key: city,
          'node.slug': slug,
        },
      },
    });
  }

  @Query(() => [Rubric])
  async getRubricsTree(
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('excluded', (_type) => [ID], { nullable: true, defaultValue: [] })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.aggregate([
      {
        $match: {
          _id: { $nin: excluded },
          'cities.key': city,
          'cities.node.level': RUBRIC_LEVEL_ONE,
        },
      },
      { $unwind: '$cities' },
      { $match: { 'cities.key': city } },
      { $sort: { 'cities.node.priority': -1 } },
    ]);
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createRubricInputSchema })
  async createRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { parent, name } = input;

      const nameValues = name.map(({ value }) => value);
      const exists = await RubricModel.exists({
        'cities.node.parent': parent ? parent : null,
        'cities.node.name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.create.duplicate`, lang }),
        };
      }

      const parentRubric = await RubricModel.findById(parent);

      const parentRelatedData: ParentRelatedDataInterface = {
        variant: input.variant,
        level: RUBRIC_LEVEL_ONE,
        parent: null,
      };

      if (parentRubric) {
        const parentCity = getCityData(parentRubric.cities, city);
        parentRelatedData.level = parentCity!.node.level + RUBRIC_LEVEL_STEP;
        parentRelatedData.parent = parent;
      }

      const rubric = await RubricModel.create({
        cities: [
          {
            key: city,
            node: {
              name: input.name,
              priority: DEFAULT_PRIORITY,
              catalogueTitle: input.catalogueTitle,
              slug: generateDefaultLangSlug(input.catalogueTitle.defaultTitle),
              attributesGroups: [],
              ...parentRelatedData,
            },
          },
        ],
      });

      if (!rubric) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.create.success`, lang }),
        rubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateRubricInputSchema })
  async updateRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: UpdateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { id, ...values } = input;
      const rubric = await RubricModel.findOne({ _id: id, ...customFilter })
        .lean()
        .exec();

      if (!rubric) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.update.notFound`, lang }),
        };
      }
      const currentCity = getCityData(rubric.cities, city);

      const { catalogueTitle, parent, name } = values;

      const nameValues = name.map(({ value }) => value);
      const exists = await RubricModel.exists({
        'cities.node.parent': parent ? parent : null,
        'cities.node.name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.update.duplicate`, lang }),
        };
      }

      const withNewLink = {
        ...currentCity!.node,
        ...values,
        slug: generateDefaultLangSlug(catalogueTitle.defaultTitle),
      };

      const updatedRubric = await RubricModel.findOneAndUpdate(
        {
          _id: id,
          'cities.key': city,
        },
        {
          $set: {
            'cities.$.node': withNewLink,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedRubric) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.update.success`, lang }),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigDelete)
  async deleteRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricPayloadType> {
    try {
      const rubric = await RubricModel.findOne({
        _id: id,
        'cities.key': city,
      })
        .lean()
        .exec();

      if (!rubric) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.delete.notFound`, lang }),
        };
      }

      const allRubrics = await getRubricsTreeIds({ rubricId: rubric._id, city });

      // If rubric exists in one city
      if (rubric.cities.length === 1) {
        const updatedProducts = await ProductModel.updateMany(
          {
            'cities.key': city,
            'cities.node.rubrics': { $in: allRubrics },
          },
          {
            $pull: {
              'cities.$.node.rubrics': {
                $in: allRubrics,
              },
            },
          },
        );

        const removed = await RubricModel.deleteMany({ _id: { $in: allRubrics } });

        if (!removed.ok || !updatedProducts.ok) {
          return {
            success: false,
            message: await getApiMessage({ key: `rubrics.delete.error`, lang }),
          };
        }

        return {
          success: true,
          message: await getApiMessage({ key: `rubrics.delete.success`, lang }),
        };
      }

      // If rubric exists in multiple cities
      const updatedProducts = await ProductModel.updateMany(
        {
          'cities.key': city,
          'cities.node.rubrics': { $in: allRubrics },
        },
        {
          $pull: {
            'cities.$.node.rubrics': {
              $in: allRubrics,
            },
          },
        },
      );

      const removed = await RubricModel.updateMany(
        {
          _id: { $in: allRubrics },
          'cities.key': city,
        },
        {
          $pull: {
            cities: {
              key: city,
            },
          },
        },
      );

      if (!removed.ok || !updatedProducts.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.delete.success`, lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: addAttributesGroupToRubricInputSchema })
  async addAttributesGroupToRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: AddAttributesGroupToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        _id: rubricId,
        'cities.key': city,
        ...customFilter,
      });
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addAttributesGroup.notFound`, lang }),
        };
      }
      const groupAttributes = await AttributeModel.find({
        _id: { $in: attributesGroup.attributes },
      });
      const showInCatalogueAttributes = groupAttributes.reduce(
        (acc: string[], attribute: Attribute) => {
          const { id, variant } = attribute;
          if (
            variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT ||
            variant === ATTRIBUTE_VARIANT_SELECT
          ) {
            return [...acc, id];
          }
          return acc;
        },
        [],
      );

      const childrenIds = await getDeepRubricChildrenIds({ rubricId, city });

      const updatedOwnerRubric = await RubricModel.findOneAndUpdate(
        {
          _id: { $in: [rubricId] },
          'cities.key': city,
        },
        {
          $addToSet: {
            'cities.$.node.attributesGroups': {
              showInCatalogueFilter: showInCatalogueAttributes,
              node: attributesGroupId,
              isOwner: true,
            },
          },
        },
        { new: true },
      );

      const updatedChildrenRubrics = await RubricModel.updateMany(
        {
          _id: { $in: childrenIds },
          'cities.key': city,
        },
        {
          $addToSet: {
            'cities.$.node.attributesGroups': {
              showInCatalogueFilter: showInCatalogueAttributes,
              node: attributesGroupId,
              isOwner: false,
            },
          },
        },
      );

      if (!updatedChildrenRubrics.ok || !updatedOwnerRubric) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addAttributesGroup.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.addAttributesGroup.success`, lang }),
        rubric: updatedOwnerRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateAttributesGroupInRubricInputSchema })
  async updateAttributesGroupInRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: UpdateAttributesGroupInRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, attributesGroupId, attributeId } = input;
      const rubric = await RubricModel.findOne({
        _id: rubricId,
        'cities.key': city,
        ...customFilter,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.updateAttributesGroup.notFound`, lang }),
        };
      }

      const currentCityData = getCityData(rubric.cities, city);

      if (!currentCityData) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.updateAttributesGroup.notFound`, lang }),
        };
      }

      const currentAttributesGroup = currentCityData.node.attributesGroups.find(
        (group: RubricAttributesGroup) => {
          return group.node === attributesGroupId;
        },
      );

      if (!currentAttributesGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.updateAttributesGroup.notFound`, lang }),
        };
      }

      const updatedShowInCatalogueFilter = toggleItemInArray(
        currentAttributesGroup.showInCatalogueFilter,
        attributeId,
      );

      const isUpdated = await RubricModel.updateOne(
        {
          _id: rubricId,
          'cities.key': city,
        },
        {
          $set: {
            'cities.$.node.attributesGroups.$[element].showInCatalogueFilter': updatedShowInCatalogueFilter,
          },
        },
        {
          arrayFilters: [
            {
              'element.node': attributesGroupId,
            },
          ],
        },
      );

      if (!isUpdated.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.updateAttributesGroup.error`, lang }),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.updateAttributesGroup.success`, lang }),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: deleteAttributesGroupFromRubricInputSchema })
  async deleteAttributesGroupFromRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: DeleteAttributesGroupFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        _id: rubricId,
        'cities.key': city,
        ...customFilter,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.deleteAttributesGroup.notFound`, lang }),
        };
      }

      const currentRubricCityNode = rubric.cities.find(({ key }) => key === city)!.node;
      const currentGroup = currentRubricCityNode.attributesGroups.find(
        ({ node }) => node === attributesGroupId,
      );

      if (!currentGroup || !currentGroup.isOwner) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.deleteAttributesGroup.ownerError`, lang }),
        };
      }

      const childrenIds = await getRubricsTreeIds({ rubricId, city });
      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, rubricId] },
          'cities.key': city,
        },
        {
          $pull: {
            'cities.$.node.attributesGroups': {
              node: attributesGroupId,
            },
          },
        },
      );

      if (!updatedRubrics.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.deleteAttributesGroup.error`, lang }),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.deleteAttributesGroup.success`, lang }),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: addProductToRubricInputSchema })
  async addProductToRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: AddProductToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, productId } = input;

      const rubric = await RubricModel.findOne({
        _id: rubricId,
        'cities.key': city,
        ...customFilter,
      });

      const product = await ProductModel.findOne({
        'cities.key': city,
        _id: productId,
      });

      if (!rubric || !product) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addProduct.notFound`, lang }),
        };
      }

      const productCity = getCityData(product.cities, city);

      if (!productCity) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addProduct.notFound`, lang }),
        };
      }

      const exists = productCity.node.rubrics.includes(rubricId);

      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addProduct.exists`, lang }),
        };
      }

      const updatedProduct = await ProductModel.updateOne(
        {
          _id: productId,
          'cities.key': city,
        },
        {
          $push: {
            'cities.$.node.rubrics': rubricId,
          },
        },
      );

      if (!updatedProduct.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addProduct.error`, lang }),
          rubric,
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.addProduct.success`, lang }),
        rubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: deleteProductFromRubricInputSchema })
  async deleteProductFromRubric(
    @Localization() { city, lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: DeleteProductFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, productId } = input;

      const rubric = await RubricModel.findOne({
        _id: rubricId,
        'cities.key': city,
        ...customFilter,
      });

      const product = await ProductModel.findOne({
        'cities.key': city,
        _id: productId,
      });

      if (!rubric || !product) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.deleteProduct.notFound`, lang }),
        };
      }

      const updatedProduct = await ProductModel.updateOne(
        {
          _id: productId,
          'cities.key': city,
        },
        {
          $pull: {
            'cities.$.node.rubrics': rubricId,
          },
        },
      );

      if (!updatedProduct.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.deleteProduct.error`, lang }),
          rubric,
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `rubrics.deleteProduct.success`, lang }),
        rubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver()
  async name(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<LanguageType[]> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return [];
    }
    return rubricCity.node.name;
  }

  @FieldResolver()
  async nameString(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city, lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return '';
    }
    return getLangField(rubricCity.node.name, lang);
  }

  @FieldResolver()
  async catalogueTitle(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<RubricCatalogueTitle> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return {
        defaultTitle: [],
        prefix: [],
        keyword: [],
        gender: GENDER_IT as GenderEnum,
      };
    }

    return rubricCity.node.catalogueTitle;
  }

  @FieldResolver()
  async catalogueTitleString(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city, lang }: LocalizationPayloadInterface,
  ): Promise<RubricCatalogueTitleField> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return {
        defaultTitle: LANG_NOT_FOUND_FIELD_MESSAGE,
        prefix: LANG_NOT_FOUND_FIELD_MESSAGE,
        keyword: LANG_NOT_FOUND_FIELD_MESSAGE,
        gender: GENDER_IT as GenderEnum,
      };
    }

    const {
      catalogueTitle: { defaultTitle, prefix, keyword, gender },
    } = rubricCity.node;

    return {
      defaultTitle: getLangField(defaultTitle, lang),
      prefix: prefix && prefix.length ? getLangField(prefix, lang) : null,
      keyword: getLangField(keyword, lang),
      gender,
    };
  }

  @FieldResolver()
  async slug(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return '';
    }
    return rubricCity.node.slug;
  }

  @FieldResolver((_type) => Int)
  async level(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!city) {
      return RUBRIC_LEVEL_ZERO;
    }
    return rubricCity.node.level;
  }

  @FieldResolver((_type) => Int)
  async priority(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!city) {
      return DEFAULT_PRIORITY;
    }
    return rubricCity.node.priority;
  }

  @FieldResolver((_type) => Boolean)
  async active(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<boolean | null | undefined> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return false;
    }
    return rubricCity.node.active;
  }

  @FieldResolver((_type) => Rubric, { nullable: true })
  async parent(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<Rubric | null> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return null;
    }
    return RubricModel.findById(rubricCity.node.parent);
  }

  @FieldResolver((_type) => RubricVariant)
  async variant(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<RubricVariant> {
    const rubricCity = getCityData(rubric.cities, city);
    const variant = await RubricVariantModel.findById(rubricCity.node.variant);
    if (!variant) {
      return {
        id: 'defaultVariant',
        name: [{ key: DEFAULT_LANG, value: 'defaultVariant' }],
        nameString: 'defaultVariant',
      };
    }
    return variant;
  }

  @FieldResolver((_type) => [Rubric])
  async children(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('excluded', (_type) => [ID], { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      'cities.key': city,
      'cities.node.parent': rubric.id,
    });
  }

  @FieldResolver((_type) => [RubricAttributesGroup])
  async attributesGroups(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<RubricAttributesGroup[]> {
    const populated = await rubric.populate('cities.node.attributesGroups.node').execPopulate();
    const rubricCity = getCityData(populated.cities, city);
    if (!rubricCity) {
      return [];
    }
    return rubricCity.node.attributesGroups;
  }

  @FieldResolver((_type) => PaginatedProductsResponse)
  async products(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
    @Arg('input', { nullable: true }) input: RubricProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } = input || {};
    const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id, city });
    const query = getProductsFilter({ ...args, rubrics: rubricsIds }, city);

    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    return ProductModel.paginate(query, options);
  }

  @FieldResolver((_returns) => [RubricFilterAttribute])
  async filterAttributes(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city, lang }: LocalizationPayloadInterface,
  ): Promise<RubricFilterAttribute[]> {
    const rubricCity = getCityData(rubric.cities, city);
    if (!rubricCity) {
      return [];
    }

    // const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id, city });
    const {
      node: { attributesGroups, catalogueTitle },
    } = rubricCity;

    // get all visible attributes id's
    const visibleAttributes = attributesGroups.reduce((acc: string[], group) => {
      return [...acc, ...group.showInCatalogueFilter];
    }, []);

    const attributes = await AttributeModel.find({ _id: { $in: visibleAttributes } });
    attributes.sort((a, b) => {
      const prioritiesA = a.priorities.find(({ rubricId }) => rubricId === rubric.id);
      const prioritiesB = b.priorities.find(({ rubricId }) => rubricId === rubric.id);
      if (!prioritiesA) {
        return 1;
      }

      if (!prioritiesB) {
        return -1;
      }

      if (prioritiesA.priority < prioritiesB?.priority) {
        return 1;
      }

      if (prioritiesB.priority < prioritiesA?.priority) {
        return -1;
      }
      return 0;
    });

    const result = attributes.map(async (attribute) => {
      const optionsGroup = await OptionsGroupModel.findById(attribute.options);
      if (!optionsGroup) {
        return {
          id: attribute.id,
          node: attribute,
          options: [],
        };
      }

      // const { slug } = attribute;

      const options = await OptionModel.find({ _id: { $in: optionsGroup.options } })
        .lean()
        .exec();
      options.sort((a, b) => {
        const prioritiesA = a.priorities.find(
          ({ rubricId, attributeId }) => rubricId === rubric.id && attributeId === attribute.id,
        );
        const prioritiesB = b.priorities.find(
          ({ rubricId, attributeId }) => rubricId === rubric.id && attributeId === attribute.id,
        );
        if (!prioritiesA) {
          return 1;
        }

        if (!prioritiesB) {
          return -1;
        }

        if (prioritiesA.priority < prioritiesB.priority) {
          return 1;
        }

        if (prioritiesB.priority < prioritiesA.priority) {
          return -1;
        }
        return 0;
      });

      const resultOptions: RubricFilterAttributeOption[] = [];

      for await (const option of options) {
        // TODO do I need to count products
        // cast current option for products filter
        /*const currentOptionQuery = [
          {
            key: slug,
            value: [option.slug],
          },
        ];*/

        // get products filter query
        /*const query = getProductsFilter(
          { attributes: currentOptionQuery, rubrics: rubricsIds, active: true },
          city,
        );*/
        // count products
        // const counter = await ProductModel.countDocuments(query);

        const { variants, name } = option;
        let filterNameString: string;
        const currentVariant = variants?.find(({ key }) => key === catalogueTitle.gender);
        const currentVariantName = getLangField(currentVariant?.value, lang);
        if (currentVariantName === LANG_NOT_FOUND_FIELD_MESSAGE) {
          filterNameString = getLangField(name, lang);
        } else {
          filterNameString = currentVariantName;
        }

        resultOptions.push({
          ...option,
          id: option._id + rubric.id,
          filterNameString: filterNameString,
          counter: 0,
        });
      }

      return {
        id: attribute.id + rubric.id,
        node: attribute,
        options: resultOptions,
      };
    });

    return Promise.all(result);
  }

  @FieldResolver((_type) => Int)
  async totalProductsCount(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    return getRubricCounters({ city, rubric });
  }

  @FieldResolver((_type) => Int)
  async activeProductsCount(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<number> {
    return getRubricCounters({ city, rubric, args: { active: true } });
  }

  // This resolver for id field after aggregation
  @FieldResolver((_type) => String)
  async id(@Root() rubric: DocumentType<Rubric>): Promise<number> {
    return rubric.id || rubric._id;
  }
}
