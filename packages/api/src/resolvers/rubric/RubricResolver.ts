import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Info,
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
  RubricFilterAttributeOption,
  RubricFilterAttribute,
  RubricCatalogueFilter,
  RubricFilterSelectedPrices,
} from '../../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateDefaultLangSlug } from '../../utils/slug';
import PayloadType from '../commonInputs/PayloadType';
import { CreateRubricInput } from './CreateRubricInput';
import { UpdateRubricInput } from './UpdateRubricInput';
import { FilterQuery, Types } from 'mongoose';
import { AddAttributesGroupToRubricInput } from './AddAttributesGroupToRubricInput';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { DeleteAttributesGroupFromRubricInput } from './DeleteAttributesGroupFromRubricInput';
import { ProductModel } from '../../entities/Product';
import { AddProductToRubricInput } from './AddProductToRubricInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { PaginatedProductsResponse } from '../product/ProductResolver';
import { RubricProductPaginateInput } from './RubricProductPaginateInput';
import { DeleteProductFromRubricInput } from './DeleteProductFromRubricInput';
import { UpdateAttributesGroupInRubricInput } from './UpdateAttributesGroupInRubric';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import toggleIdInArray from '../../utils/toggleIdInArray';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { OptionsGroupModel } from '../../entities/OptionsGroup';
import { Option, OptionModel } from '../../entities/Option';
import { getObjectIdsArray } from '../../utils/getObjectIdsArray';
import { ProductsCountersInput } from '../product/ProductsCountersInput';
import { RoleRuleModel } from '../../entities/RoleRule';
import {
  addAttributesGroupToRubricInputSchema,
  addProductToRubricInputSchema,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATALOGUE_FILTER_EXCLUDED_KEYS,
  CATALOGUE_MAX_PRICE_KEY,
  CATALOGUE_MIN_PRICE_KEY,
  createRubricInputSchema,
  DEFAULT_LANG,
  DEFAULT_PRIORITY,
  deleteAttributesGroupFromRubricInputSchema,
  deleteProductFromRubricInputSchema,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_STEP,
  SORT_DESC,
  SORT_DESC_NUM,
  updateAttributesGroupInRubricInputSchema,
  updateRubricInputSchema,
} from '@yagu/shared';
import { alwaysArray } from '../../utils/alwaysArray';
import { getBooleanFromArray } from '../../utils/getBooleanFromArray';
import { getCurrencyString } from '../../utils/intl';
import {
  getRubricChildrenIds,
  getRubricCounters,
  getRubricsTreeIds,
} from '../../utils/rubricHelpers';
import {
  getOptionFromParam,
  GetOptionFromParamPayloadInterface,
  getParamOptionFirstValueByKey,
} from '../../utils/catalogueHelpers';
import { noNaN } from '../../utils/numbers';

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
} = RoleRuleModel.getOperationsConfigs(Rubric.name);

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
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Rubric>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Rubric> {
    const rubric = await RubricModel.findOne({ _id: id, ...customFilter });
    if (!rubric) {
      throw Error('Rubric not found by given ID');
    }
    return rubric;
  }

  @Query(() => Rubric)
  async getRubricBySlug(@Arg('slug', (_type) => String) slug: string): Promise<Rubric> {
    const rubric = await RubricModel.findOne({ slug });
    if (!rubric) {
      throw Error('Rubric not found by given slug');
    }
    return rubric;
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
          _id: { $nin: getObjectIdsArray(excluded) },
          level: RUBRIC_LEVEL_ONE,
        },
      },
      { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          id: '$_id',
          viewsCounter: {
            $cond: {
              if: {
                $and: [
                  {
                    $eq: ['$views.key', city],
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
  }

  @Mutation(() => RubricPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createRubricInputSchema })
  async createRubric(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { parent, name } = input;

      const nameValues = name.map(({ value }) => value);
      const exists = await RubricModel.exists({
        parent: parent ? parent : null,
        'name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.create.duplicate`),
        };
      }

      const parentRubric = await RubricModel.findById(parent);

      const parentRelatedData: ParentRelatedDataInterface = {
        variant: input.variant,
        level: RUBRIC_LEVEL_ONE,
        parent: null,
      };

      if (parentRubric) {
        parentRelatedData.level = parentRubric.level + RUBRIC_LEVEL_STEP;
        parentRelatedData.parent = parent;
      }

      const rubric = await RubricModel.create({
        views: [],
        priorities: [],
        name: input.name,
        priority: DEFAULT_PRIORITY,
        catalogueTitle: input.catalogueTitle,
        slug: generateDefaultLangSlug(input.catalogueTitle.defaultTitle),
        attributesGroups: [],
        ...parentRelatedData,
      });

      if (!rubric) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubrics.create.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
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
          message: await getApiMessage(`rubrics.update.notFound`),
        };
      }

      const { catalogueTitle, parent, name } = values;

      const nameValues = name.map(({ value }) => value);
      const exists = await RubricModel.exists({
        parent: parent ? parent : null,
        'name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.update.duplicate`),
        };
      }

      const updatedRubric = await RubricModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          ...values,
          slug: generateDefaultLangSlug(catalogueTitle.defaultTitle),
        },
        {
          new: true,
        },
      );

      if (!updatedRubric) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubrics.update.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricPayloadType> {
    try {
      const rubric = await RubricModel.findOne({
        _id: id,
      })
        .lean()
        .exec();

      if (!rubric) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.delete.notFound`),
        };
      }

      const allRubrics = await getRubricsTreeIds(rubric._id);

      const updatedProducts = await ProductModel.updateMany(
        {
          rubrics: { $in: allRubrics },
        },
        {
          $pull: {
            rubrics: {
              $in: allRubrics,
            },
          },
        },
      );

      const removed = await RubricModel.deleteMany({ _id: { $in: allRubrics } });

      if (!removed.ok || !updatedProducts.ok) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubrics.delete.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: AddAttributesGroupToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        _id: rubricId,
        ...customFilter,
      });
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.addAttributesGroup.notFound`),
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

      const childrenIds = await getRubricChildrenIds(rubricId);

      const updatedOwnerRubric = await RubricModel.findOneAndUpdate(
        {
          _id: rubricId,
        },
        {
          $addToSet: {
            attributesGroups: {
              id: new Types.ObjectId().toHexString(),
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
        },
        {
          $addToSet: {
            attributesGroups: {
              id: new Types.ObjectId().toHexString(),
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
          message: await getApiMessage(`rubrics.addAttributesGroup.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubrics.addAttributesGroup.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: UpdateAttributesGroupInRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, attributesGroupId, attributeId } = input;
      const rubric = await RubricModel.findOne({
        _id: rubricId,
        ...customFilter,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.updateAttributesGroup.notFound`),
        };
      }

      const currentAttributesGroup = rubric.attributesGroups.find((group) => {
        return group.node === attributesGroupId;
      });

      if (!currentAttributesGroup) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.updateAttributesGroup.notFound`),
        };
      }

      const updatedShowInCatalogueFilter = toggleIdInArray(
        currentAttributesGroup.showInCatalogueFilter,
        attributeId,
      );

      const isUpdated = await RubricModel.updateOne(
        {
          _id: rubricId,
        },
        {
          $set: {
            'attributesGroups.$[element].showInCatalogueFilter': updatedShowInCatalogueFilter,
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
          message: await getApiMessage(`rubrics.updateAttributesGroup.error`),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: await getApiMessage(`rubrics.updateAttributesGroup.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: DeleteAttributesGroupFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        _id: rubricId,
        ...customFilter,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.deleteAttributesGroup.notFound`),
        };
      }

      const currentGroup = rubric.attributesGroups.find(({ node }) => node === attributesGroupId);

      if (!currentGroup || !currentGroup.isOwner) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.deleteAttributesGroup.ownerError`),
        };
      }

      const treeIds = await getRubricsTreeIds(rubricId);
      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: treeIds },
        },
        {
          $pull: {
            attributesGroups: {
              node: attributesGroupId,
            },
          },
        },
      );

      if (!updatedRubrics.ok) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.deleteAttributesGroup.error`),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: await getApiMessage(`rubrics.deleteAttributesGroup.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: AddProductToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, productId } = input;

      const rubric = await RubricModel.findOne({
        _id: rubricId,
        ...customFilter,
      });

      const product = await ProductModel.findOne({
        _id: productId,
      });

      if (!rubric || !product) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.addProduct.notFound`),
        };
      }

      const exists = product.rubrics.includes(rubricId);

      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.addProduct.exists`),
        };
      }

      const updatedProduct = await ProductModel.updateOne(
        {
          _id: productId,
        },
        {
          $push: {
            rubrics: rubricId,
          },
        },
      );

      if (!updatedProduct.ok) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.addProduct.error`),
          rubric,
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubrics.addProduct.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Rubric>,
    @Arg('input') input: DeleteProductFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const { rubricId, productId } = input;

      const rubric = await RubricModel.findOne({
        _id: rubricId,
        ...customFilter,
      });

      const product = await ProductModel.findOne({
        _id: productId,
      });

      if (!rubric || !product) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.notFound`),
        };
      }

      const updatedProduct = await ProductModel.updateOne(
        {
          _id: productId,
        },
        {
          $pull: {
            rubrics: rubricId,
          },
        },
      );

      if (!updatedProduct.ok) {
        return {
          success: false,
          message: await getApiMessage(`rubrics.deleteProduct.error`),
          rubric,
        };
      }

      return {
        success: true,
        message: await getApiMessage(`rubrics.deleteProduct.success`),
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
  async nameString(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(rubric.name);
  }

  @FieldResolver()
  async catalogueTitleString(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<RubricCatalogueTitleField> {
    const {
      catalogueTitle: { defaultTitle, prefix, keyword, gender },
    } = rubric;

    return {
      defaultTitle: getLangField(defaultTitle),
      prefix: prefix && prefix.length ? getLangField(prefix) : null,
      keyword: getLangField(keyword),
      gender,
    };
  }

  @FieldResolver((_type) => Rubric, { nullable: true })
  async parent(@Root() rubric: DocumentType<Rubric>): Promise<Rubric | null> {
    return RubricModel.findById(rubric.parent);
  }

  @FieldResolver((_type) => RubricVariant)
  async variant(@Root() rubric: DocumentType<Rubric>): Promise<RubricVariant> {
    const variant = await RubricVariantModel.findById(rubric.variant);
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
    @Arg('excluded', (_type) => [ID], { nullable: true, defaultValue: [] })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      parent: rubric.id,
    });
  }

  @FieldResolver((_type) => [RubricAttributesGroup])
  async attributesGroups(@Root() rubric: DocumentType<Rubric>): Promise<RubricAttributesGroup[]> {
    const populated = await rubric.populate('attributesGroups.node').execPopulate();
    return populated.attributesGroups;
  }

  @FieldResolver((_type) => PaginatedProductsResponse)
  async products(
    @Root() rubric: DocumentType<Rubric>,
    @Arg('input', { nullable: true, defaultValue: {} }) input: RubricProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = SORT_DESC, ...args } = input;
    const rubricsIds = await getRubricsTreeIds(rubric.id);
    const query = ProductModel.getProductsFilter({ ...args, rubrics: rubricsIds });

    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir: sortDir,
      sortBy,
    });

    return ProductModel.paginate(query, options);
  }

  @FieldResolver((_returns) => RubricCatalogueFilter)
  async catalogueFilter(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { getLangField, city, lang }: LocalizationPayloadInterface,
    @Info() info: any,
  ): Promise<RubricCatalogueFilter> {
    try {
      // Get query args
      const catalogueFilterArgs: string[] = info?.variableValues?.catalogueFilter
        ? alwaysArray(info?.variableValues?.catalogueFilter)
        : [];

      const additionalFilters: GetOptionFromParamPayloadInterface[] = [];

      catalogueFilterArgs.forEach((param) => {
        const paramObject = getOptionFromParam(param);
        const excluded = CATALOGUE_FILTER_EXCLUDED_KEYS.includes(paramObject.key);
        if (excluded) {
          additionalFilters.push(paramObject);
        }
      });
      const minPrice = getParamOptionFirstValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MIN_PRICE_KEY,
      });
      const maxPrice = getParamOptionFirstValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MAX_PRICE_KEY,
      });
      // TODO
      /*const brandsInArguments = getParamOptionValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_BRAND_KEY,
      });
      const manufacturersInArguments = getParamOptionValueByKey({
        paramOptions: additionalFilters,
        key: CATALOGUE_MANUFACTURER_KEY,
      });*/

      // price range pipeline
      const priceRangePipeline =
        minPrice && maxPrice
          ? [
              {
                $match: {
                  minPrice: {
                    $gte: noNaN(minPrice),
                    $lte: noNaN(maxPrice),
                  },
                },
              },
            ]
          : [];

      // Get id's of children rubrics
      const rubricsIds = await getRubricsTreeIds(rubric.id);

      const { attributesGroups, catalogueTitle } = rubric;
      const rubricIdString = rubric.id.toString();

      // get all visible attributes id's
      const visibleAttributes = attributesGroups.reduce((acc: Types.ObjectId[], group) => {
        return [...acc, ...getObjectIdsArray(group.showInCatalogueFilter)];
      }, []);

      const attributes = await AttributeModel.aggregate<Attribute>([
        { $match: { _id: { $in: visibleAttributes } } },
        { $unwind: { path: '$views', preserveNullAndEmptyArrays: true } },
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

      const filterAttributes: RubricFilterAttribute[] = [];

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

        const resultOptions: RubricFilterAttributeOption[] = [];

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

          const optionSlug = `${attribute.slug}-${option.slug}`;
          const isSelected = catalogueFilterArgs.includes(optionSlug);
          const optionNextSlug = isSelected
            ? catalogueFilterArgs
                .filter((pathArg) => {
                  return pathArg !== optionSlug;
                })
                .join('/')
            : [...catalogueFilterArgs, optionSlug].join('/');

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

            // Add minPrice field
            { $addFields: { minPrice: { $min: '$shops.price' } } },

            // Filter out products that out of price range
            ...priceRangePipeline,

            {
              $count: 'counter',
            },
          ]);
          const counter = products[0]?.counter || 0;

          resultOptions.push({
            ...option,
            id: option._id?.toString() + rubricIdString,
            filterNameString: filterNameString,
            optionSlug,
            optionNextSlug: `/${optionNextSlug}`,
            isSelected,
            isDisabled: counter < 1,
            counter,
          });
        }

        const otherAttributesSelectedValues = catalogueFilterArgs.filter((option) => {
          return !option.includes(attribute.slug);
        });
        const clearSlug = `/${otherAttributesSelectedValues.join('/')}`;

        const isSelected = getBooleanFromArray(resultOptions, ({ isSelected }) => {
          return isSelected;
        });

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

        filterAttributes.push({
          id: attributeIdString + rubricIdString,
          node: attribute,
          options: sortedOptions,
          clearSlug: `${clearSlug}`,
          isSelected,
          isDisabled: disabledOptionsCount === sortedOptions.length,
        });
      }

      const selectedAttributes = filterAttributes.reduce(
        (acc: RubricFilterAttribute[], attribute) => {
          if (!attribute.isSelected) {
            return acc;
          }
          return [
            ...acc,
            {
              ...attribute,
              id: `selected-${attribute.id}`,
              options: attribute.options.filter((option) => {
                return option.isSelected;
              }),
            },
          ];
        },
        [],
      );

      const disabledAttributesCount = filterAttributes.reduce((acc: number, { isDisabled }) => {
        if (isDisabled) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const selectedPricesClearPathname = alwaysArray(catalogueFilterArgs).join('/');
      const selectedPrices: RubricFilterSelectedPrices | null =
        minPrice && maxPrice
          ? {
              id: `${rubric.slug}-selectedPrices`,
              clearSlug: `/${selectedPricesClearPathname}`,
              formattedMinPrice: getCurrencyString({ lang, value: minPrice }),
              formattedMaxPrice: getCurrencyString({ lang, value: maxPrice }),
            }
          : null;

      // TODO Brands
      /*const brandsAggregation = await getCatalogueAdditionalFilterOptions({
        productForeignField: '$brand',
        collectionSlugs: brandsInArguments,
        filterKey: CATALOGUE_BRAND_KEY,
        collection: 'brands',
        catalogueFilterArgs,
        rubricsIds,
        city,
      });

      // TODO Manufacturers
      const manufacturersAggregation = await getCatalogueAdditionalFilterOptions({
        productForeignField: '$manufacturer',
        collectionSlugs: manufacturersInArguments,
        filterKey: CATALOGUE_MANUFACTURER_KEY,
        collection: 'manufacturers',
        catalogueFilterArgs,
        rubricsIds,
        city,
      });*/

      return {
        id: rubric._id.toString(),
        attributes: filterAttributes,
        selectedAttributes,
        isDisabled: disabledAttributesCount === filterAttributes.length,
        clearSlug: `/${rubric.slug}`,
        selectedPrices,
      };
    } catch (e) {
      return {
        id: rubric._id.toString(),
        attributes: [],
        selectedAttributes: [],
        isDisabled: true,
        clearSlug: ``,
      };
    }
  }

  @FieldResolver((_type) => Int)
  async totalProductsCount(
    @Root() rubric: DocumentType<Rubric>,
    @Arg('input', { nullable: true, defaultValue: {} }) input: ProductsCountersInput,
  ): Promise<number> {
    return getRubricCounters({ rubricId: rubric._id, args: input });
  }

  @FieldResolver((_type) => Int)
  async activeProductsCount(
    @Root() rubric: DocumentType<Rubric>,
    @Arg('input', { nullable: true, defaultValue: {} }) input: ProductsCountersInput,
  ): Promise<number> {
    return getRubricCounters({ rubricId: rubric._id, args: { ...input, active: true } });
  }

  // This resolver for id field after aggregation
  @FieldResolver((_type) => String)
  async id(@Root() rubric: DocumentType<Rubric>): Promise<string> {
    return rubric.id || rubric._id;
  }
}
