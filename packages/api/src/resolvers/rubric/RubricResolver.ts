import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Rubric, RubricAttributesGroup, RubricModel } from '../../entities/Rubric';
import {
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_STEP,
  RUBRIC_LEVEL_TWO,
  RUBRIC_LEVEL_ZERO,
} from '@rg/config';
import { ContextInterface } from '../../types/context';
import { DocumentType } from '@typegoose/typegoose';
import getLangField from '../../utils/getLangField';
import getCityData from '../../utils/getCityData';
import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateDefaultLangSlug } from '../../utils/slug';
import PayloadType from '../common/PayloadType';
import { CreateRubricInput } from './CreateRubricInput';
import {
  addAttributesGroupToRubricInputSchema,
  createRubricInputSchema,
  deleteAttributesGroupFromRubricInputSchema,
  updateRubricInputSchema,
} from '@rg/validation';
import { UpdateRubricInput } from './UpdateRubricInput';
import { Types } from 'mongoose';
import { AddAttributesGroupToRubricInput } from './AddAttributesGroupToRubricInput';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { DeleteAttributesGroupFromRubricInput } from './DeleteAttributesGroupFromRubricInput';
import { getMessageTranslation } from '../../config/translations';

@ObjectType()
class RubricPayloadType extends PayloadType() {
  @Field((_type) => Rubric, { nullable: true })
  rubric?: Rubric | null;
}

@Resolver((_of) => Rubric)
export class RubricResolver {
  @Query(() => Rubric)
  async getRubric(@Arg('id', (_type) => ID) id: string) {
    return RubricModel.findById(id);
  }

  @Query(() => [Rubric])
  async getRubricsTree(
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => ID, { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      'cities.key': ctx.req.session!.city,
      'cities.node.level': RUBRIC_LEVEL_ONE,
    });
  }

  @Mutation(() => RubricPayloadType)
  async createRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await createRubricInputSchema.validate(input);

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
          message: getMessageTranslation(`rubric.create.duplicate.${lang}`),
        };
      }

      const parentRubric = (await RubricModel.findById(parent)) || {
        id: null,
        level: RUBRIC_LEVEL_ZERO,
      };

      const rubric = await RubricModel.create({
        cities: [
          {
            key: city,
            node: {
              ...input,
              variant: parentRubric.level === RUBRIC_LEVEL_ZERO ? input.variant : null,
              level: parentRubric.level + RUBRIC_LEVEL_STEP,
              slug: generateDefaultLangSlug(input.catalogueName),
              attributesGroups: [],
            },
          },
        ],
      });

      if (!rubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.create.success.${lang}`),
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
  async updateRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await updateRubricInputSchema.validate(input);

      const { id, ...values } = input;
      const { catalogueName, parent, variant, name } = values;

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
          message: getMessageTranslation(`rubric.update.duplicate.${lang}`),
        };
      }

      const withNewLink = {
        ...values,
        parent: Types.ObjectId(parent),
        variant: Types.ObjectId(variant),
        slug: generateDefaultLangSlug(catalogueName),
      };

      const rubric = await RubricModel.findOneAndUpdate(
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

      if (!rubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.update.success.${lang}`),
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
  async deleteRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      const rubric = await RubricModel.findOne({
        _id: id,
        'cities.key': city,
      })
        .lean()
        .exec();

      if (!rubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.delete.notFound.${lang}`),
        };
      }

      const children = await RubricModel.find({
        'cities.key': city,
        'cities.node.parent': id,
      })
        .select({ id: 1 })
        .lean()
        .exec();
      const allRubrics = [rubric, ...children].map(({ _id }) => _id);

      // If rubric exists in one city
      if (rubric.cities.length === 1) {
        // TODO after products
        /*const updatedProducts = await Product.updateMany(
          { rubrics: { $in: allRubrics } },
          { $pull: { rubrics: { $in: allRubrics } } },
        );*/

        const removed = await RubricModel.deleteMany({ _id: { $in: allRubrics } });

        // if (!removed || !updatedProducts) {
        if (!removed) {
          return {
            success: false,
            message: getMessageTranslation(`rubric.delete.error.${lang}`),
          };
        }

        return {
          success: true,
          message: getMessageTranslation(`rubric.delete.success.${lang}`),
        };
      }

      // If rubric exists in multiple cities
      // TODO after products
      /*const updatedProducts = await Product.updateMany(
        { rubrics: { $in: allRubrics } },
        { $pull: { rubrics: { $in: allRubrics } } },
      );*/

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

      // if (!removed || !updatedProducts) {
      if (!removed) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.delete.success.${lang}`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async addAttributesGroupToRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: AddAttributesGroupToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      await addAttributesGroupToRubricInputSchema.validate(input);
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addAttributesGroup.notFound.${lang}`),
        };
      }

      const currentRubricCityNode = rubric.cities.find(({ key }) => key === city)!.node;
      const currentRubricLevel = currentRubricCityNode.level;

      if (currentRubricLevel !== RUBRIC_LEVEL_TWO) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addAttributesGroup.levelError.${lang}`),
          rubric,
        };
      }

      const children = await RubricModel.find({
        'cities.key': city,
        'cities.node.parent': rubric.id,
      })
        .select({ _id: 1 })
        .lean()
        .exec();
      const childrenIds = children.map(({ _id }) => _id);
      const parentId = currentRubricCityNode.parent;

      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, parentId, rubricId] },
          'cities.key': city,
          attributesGroups: {
            $not: {
              $elemMatch: {
                node: attributesGroupId,
              },
            },
          },
        },
        {
          $addToSet: {
            'cities.$.node.attributesGroups': {
              showInCatalogueFilter: false,
              node: Types.ObjectId(attributesGroupId),
            },
          },
        },
      );

      if (!updatedRubrics.ok) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addAttributesGroup.error.${lang}`),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: getMessageTranslation(`rubric.addAttributesGroup.success.${lang}`),
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
  async deleteAttributesGroupFromRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: DeleteAttributesGroupFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await deleteAttributesGroupFromRubricInputSchema.validate(input);

      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteAttributesGroup.notFound.${lang}`),
        };
      }

      const currentRubricCityNode = rubric.cities.find(({ key }) => key === city)!.node;
      const currentRubricLevel = currentRubricCityNode.level;

      if (currentRubricLevel !== RUBRIC_LEVEL_TWO) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteAttributesGroup.levelError.${lang}`),
        };
      }

      const children = await RubricModel.find({
        'cities.key': city,
        'cities.node.parent': rubric.id,
      })
        .select({ _id: 1 })
        .lean()
        .exec();
      const childrenIds = children.map(({ _id }) => _id);
      const parentId = currentRubricCityNode.parent;

      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, parentId, rubricId] },
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
          message: getMessageTranslation(`rubric.deleteAttributesGroup.error.${lang}`),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: getMessageTranslation(`rubric.deleteAttributesGroup.success.${lang}`),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver()
  async name(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city!.node.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async catalogueName(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city!.node.catalogueName, ctx.req.session!.lang);
  }

  @FieldResolver()
  async slug(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return city.node.slug;
  }

  @FieldResolver()
  async level(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<number> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return RUBRIC_LEVEL_ZERO;
    }
    return city.node.level;
  }

  @FieldResolver()
  async active(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<boolean | null | undefined> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return false;
    }
    return city.node.active;
  }

  @FieldResolver()
  async parent(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<Rubric | null> {
    const populated = await rubric.populate('cities.node.parent').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return RubricModel.findById(city.node.parent);
  }

  @FieldResolver()
  async variant(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<RubricVariant | null> {
    const populated = await rubric.populate('cities.node.variant').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return RubricVariantModel.findById(city.node.variant);
  }

  @FieldResolver()
  async children(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => ID, { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      'cities.key': ctx.req.session!.city,
      'cities.node.parent': rubric.id,
    });
  }

  @FieldResolver()
  async attributesGroups(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<RubricAttributesGroup[]> {
    const populated = await rubric.populate('cities.node.attributesGroups.node').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return [];
    }
    return city.node.attributesGroups;
  }
}
