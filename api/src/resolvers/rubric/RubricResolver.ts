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
import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateDefaultLangSlug } from '../../utils/slug';
import PayloadType from '../common/PayloadType';
import { CreateRubricInput } from './CreateRubricInput';
import { UpdateRubricInput } from './UpdateRubricInput';
import { FilterQuery, Types } from 'mongoose';
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
  LANG_NOT_FOUND_FIELD_MESSAGE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_STEP,
} from '../../config';
import { UpdateAttributesGroupInRubricInput } from './UpdateAttributesGroupInRubric';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import toggleIdInArray from '../../utils/toggleIdInArray';
import { LanguageType } from '../../entities/common';
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
import { Option, OptionModel } from '../../entities/Option';
import { getObjectIdsArray } from '../../utils/getObjectIdsArray';

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
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Rubric>,
    @Arg('id', (_type) => ID) id: string,
  ) {
    return RubricModel.findOne({ _id: id, ...customFilter });
  }

  @Query(() => Rubric)
  async getRubricBySlug(@Arg('slug', (_type) => String) slug: string) {
    return RubricModel.findOne({ slug });
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubrics.update.duplicate`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubrics.delete.notFound`, lang }),
        };
      }

      const allRubrics = await getRubricsTreeIds({ rubricId: rubric._id });

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
    @Localization() { lang }: LocalizationPayloadInterface,
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

      const childrenIds = await getDeepRubricChildrenIds({ rubricId });

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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubrics.updateAttributesGroup.notFound`, lang }),
        };
      }

      const currentAttributesGroup = rubric.attributesGroups.find((group) => {
        return group.node === attributesGroupId;
      });

      if (!currentAttributesGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.updateAttributesGroup.notFound`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubrics.deleteAttributesGroup.notFound`, lang }),
        };
      }

      const currentGroup = rubric.attributesGroups.find(({ node }) => node === attributesGroupId);

      if (!currentGroup || !currentGroup.isOwner) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.deleteAttributesGroup.ownerError`, lang }),
        };
      }

      const childrenIds = await getRubricsTreeIds({ rubricId });
      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, rubricId] },
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubrics.addProduct.notFound`, lang }),
        };
      }

      const exists = product.rubrics.includes(rubricId);

      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: `rubrics.addProduct.exists`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `rubrics.deleteProduct.notFound`, lang }),
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
  async name(@Root() rubric: DocumentType<Rubric>): Promise<LanguageType[]> {
    return rubric.name;
  }

  @FieldResolver()
  async nameString(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(rubric.name, lang);
  }

  @FieldResolver()
  async catalogueTitle(@Root() rubric: DocumentType<Rubric>): Promise<RubricCatalogueTitle> {
    return rubric.catalogueTitle;
  }

  @FieldResolver()
  async catalogueTitleString(
    @Root() rubric: DocumentType<Rubric>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<RubricCatalogueTitleField> {
    const {
      catalogueTitle: { defaultTitle, prefix, keyword, gender },
    } = rubric;

    return {
      defaultTitle: getLangField(defaultTitle, lang),
      prefix: prefix && prefix.length ? getLangField(prefix, lang) : null,
      keyword: getLangField(keyword, lang),
      gender,
    };
  }

  @FieldResolver()
  async slug(@Root() rubric: DocumentType<Rubric>): Promise<string> {
    return rubric.slug;
  }

  @FieldResolver((_type) => Int)
  async level(@Root() rubric: DocumentType<Rubric>): Promise<number> {
    return rubric.level;
  }

  @FieldResolver((_type) => Int)
  async priority(@Root() rubric: DocumentType<Rubric>): Promise<number> {
    return rubric.priority;
  }

  @FieldResolver((_type) => Boolean)
  async active(@Root() rubric: DocumentType<Rubric>): Promise<boolean | null | undefined> {
    return rubric.active;
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
    @Arg('input', { nullable: true }) input: RubricProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } = input || {};
    const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id });
    const query = getProductsFilter({ ...args, rubrics: rubricsIds });

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
    @Localization() { lang, city }: LocalizationPayloadInterface,
  ): Promise<RubricFilterAttribute[]> {
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

    const result = reducedAttributes.map(async (attribute) => {
      const attributeIdString = attribute._id?.toString();

      const optionsGroup = await OptionsGroupModel.findById(attribute.options);
      if (!optionsGroup) {
        return {
          id: attributeIdString + rubricIdString,
          node: attribute,
          options: [],
        };
      }

      const options = await OptionModel.aggregate<Option>([
        { $match: { _id: { $in: optionsGroup.options } } },
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
        { $sort: { viewsCounter: -1 } },
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
        const currentVariantName = getLangField(currentVariant?.value, lang);
        if (currentVariantName === LANG_NOT_FOUND_FIELD_MESSAGE) {
          filterNameString = getLangField(name, lang);
        } else {
          filterNameString = currentVariantName;
        }

        resultOptions.push({
          ...option,
          id: option._id?.toString() + rubricIdString,
          filterNameString: filterNameString,
          counter: 0,
        });
      }

      return {
        id: attributeIdString + rubricIdString,
        node: attribute,
        options: resultOptions,
      };
    });

    return Promise.all(result);
  }

  @FieldResolver((_type) => Int)
  async totalProductsCount(@Root() rubric: DocumentType<Rubric>): Promise<number> {
    return getRubricCounters({ rubric });
  }

  @FieldResolver((_type) => Int)
  async activeProductsCount(@Root() rubric: DocumentType<Rubric>): Promise<number> {
    return getRubricCounters({ rubric, args: { active: true } });
  }

  // This resolver for id field after aggregation
  @FieldResolver((_type) => String)
  async id(@Root() rubric: DocumentType<Rubric>): Promise<number> {
    return rubric.id || rubric._id;
  }
}
