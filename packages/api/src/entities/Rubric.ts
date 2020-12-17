import { Field, ID, Int, ObjectType } from 'type-graphql';
import { DocumentType, getModelForClass, index, prop } from '@typegoose/typegoose';
import { AttributesGroup } from './AttributesGroup';
import { RubricVariant } from './RubricVariant';
import { GenderEnum } from './commonEntities';
import { PaginatedProductsResponse } from '../resolvers/product/ProductResolver';
import { DEFAULT_PRIORITY, GENDER_ENUMS, RUBRIC_LEVEL_ONE } from '@yagu/config';
import { Attribute } from './Attribute';
import { Option } from './Option';
import { ProductModel } from './Product';
import { CityCounter } from './CityCounter';
import { Translation } from './Translation';

@ObjectType()
export class RubricAttributesGroup {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [ID])
  @prop({ ref: Attribute })
  showInCatalogueFilter: string[];

  @Field(() => Boolean)
  @prop({ type: Boolean })
  isOwner: boolean;

  @Field(() => AttributesGroup)
  @prop({ ref: AttributesGroup })
  node: string;
}

@ObjectType()
export class RubricFilterAttributeOption extends Option {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => Int)
  readonly counter: number;

  @Field((_type) => String)
  readonly optionSlug: string;

  @Field((_type) => String)
  readonly optionNextSlug: string;

  @Field((_type) => Boolean)
  readonly isSelected: boolean;

  @Field((_type) => Boolean)
  readonly isDisabled: boolean;
}

@ObjectType()
export class RubricFilterAttribute {
  @Field(() => ID)
  readonly id: string;

  @Field((_type) => String)
  readonly clearSlug: string;

  @Field(() => Attribute)
  readonly node: Attribute;

  @Field(() => [RubricFilterAttributeOption])
  readonly options: RubricFilterAttributeOption[];

  @Field((_type) => Boolean)
  readonly isSelected: boolean;
}

@ObjectType()
export class RubricCatalogueFilter {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [RubricFilterAttribute])
  readonly attributes: RubricFilterAttribute[];

  @Field(() => [RubricFilterAttribute])
  readonly selectedAttributes: RubricFilterAttribute[];
}

@ObjectType()
export class RubricCatalogueTitle {
  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  defaultTitle: Translation[];

  @Field(() => [Translation], { nullable: true })
  @prop({ type: Translation })
  prefix?: Translation[];

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  keyword: Translation[];

  @Field((_type) => GenderEnum)
  @prop({ required: true, enum: GENDER_ENUMS, type: String })
  gender: GenderEnum;
}

@ObjectType()
export class RubricCatalogueTitleField {
  @Field(() => String)
  readonly defaultTitle: string;

  @Field(() => String, { nullable: true })
  readonly prefix?: string | null;

  @Field(() => String)
  readonly keyword: string;

  @Field((_type) => GenderEnum)
  readonly gender: GenderEnum;
}

interface GetRubricChildrenIdsInterface {
  rubricId: string;
}

interface GetRubricsTreeIdsInterface {
  rubricId: string;
  acc?: string[];
}

interface GetDeepRubricChildrenIdsInterface {
  rubricId: string;
}

interface GetRubricCountersInterface {
  rubric: DocumentType<Rubric>;
  args?: { [key: string]: any };
}

@ObjectType()
@index({ '$**': 'text' })
export class Rubric {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  views: CityCounter[];

  @Field(() => [CityCounter])
  @prop({ type: CityCounter, required: true })
  priorities: CityCounter[];

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => RubricCatalogueTitle)
  @prop({ type: RubricCatalogueTitle, required: true })
  catalogueTitle: RubricCatalogueTitle;

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => Int, { defaultValue: DEFAULT_PRIORITY })
  @prop({ required: true, default: DEFAULT_PRIORITY, type: Number })
  priority: number;

  @Field(() => Int)
  @prop({ required: true, default: RUBRIC_LEVEL_ONE })
  level: number;

  @Field(() => Boolean, { nullable: true })
  @prop({ required: true, default: true })
  active?: boolean;

  @Field(() => Rubric, { nullable: true })
  @prop({ ref: 'Rubric' })
  parent?: string | null;

  @Field(() => [RubricAttributesGroup])
  @prop({ type: RubricAttributesGroup })
  attributesGroups: RubricAttributesGroup[];

  @Field(() => RubricVariant)
  @prop({ ref: RubricVariant })
  variant: string;

  @Field(() => String)
  readonly nameString: string;

  @Field(() => RubricCatalogueTitleField)
  readonly catalogueTitleString: RubricCatalogueTitleField;

  @Field(() => [Rubric])
  readonly children: Rubric[];

  @Field(() => RubricCatalogueFilter)
  readonly catalogueFilter: RubricCatalogueFilter;

  @Field(() => PaginatedProductsResponse)
  readonly products: PaginatedProductsResponse;

  @Field(() => Int)
  readonly totalProductsCount: number;

  @Field(() => Int)
  readonly activeProductsCount: number;

  static async getRubricChildrenIds({
    rubricId,
  }: GetRubricChildrenIdsInterface): Promise<string[]> {
    const rubricChildren = await RubricModel.find({
      parent: rubricId,
    })
      .select({ id: 1 })
      .lean()
      .exec();
    return rubricChildren.map(({ _id }) => _id.toString());
  }

  static async getRubricsTreeIds({ rubricId, acc = [] }: GetRubricsTreeIdsInterface) {
    const childrenIds = await this.getRubricChildrenIds({ rubricId });
    const newAcc = [...acc, rubricId];
    if (childrenIds.length === 0) {
      return newAcc;
    }

    const array: Promise<string[][]> = Promise.all(
      childrenIds.map(async (rubricId) => {
        return this.getRubricsTreeIds({ rubricId, acc: newAcc });
      }),
    );
    const set = new Set((await array).flat());
    const result = [];
    for (const setItem of set.values()) {
      result.push(setItem);
    }

    return result;
  }

  static async getDeepRubricChildrenIds({ rubricId }: GetDeepRubricChildrenIdsInterface) {
    const treeIds = await this.getRubricsTreeIds({ rubricId });
    return treeIds.filter((id) => id !== rubricId);
  }

  static async getRubricCounters({ rubric, args = {} }: GetRubricCountersInterface) {
    const rubricsIds = await this.getRubricsTreeIds({ rubricId: rubric.id || rubric._id });
    const query = ProductModel.getProductsFilter({ ...args, rubric: rubricsIds });

    return ProductModel.countDocuments({
      ...query,
    });
  }
}

export const RubricModel = getModelForClass(Rubric);
