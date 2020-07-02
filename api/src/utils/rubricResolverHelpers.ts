import { Rubric, RubricModel } from '../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import { getProductsFilter } from './getProductsFilter';
import { ProductModel } from '../entities/Product';

interface GetRubricNestedIdsInterface {
  rubric: DocumentType<Rubric>;
  city: string;
}

interface GetRubricCountersInterface {
  rubric: DocumentType<Rubric>;
  args?: { [key: string]: any };
  city: string;
}

export async function getRubricNestedIds({
  rubric,
  city,
}: GetRubricNestedIdsInterface): Promise<string[]> {
  const rubricChildren = await RubricModel.find({
    cities: {
      $elemMatch: {
        key: city,
        'node.parent': rubric.id,
      },
    },
  })
    .select({ id: 1 })
    .lean()
    .exec();
  const secondLevel = rubricChildren.map(({ _id }) => _id);

  const thirdLevelChildren = await RubricModel.find({
    cities: {
      $elemMatch: {
        key: city,
        'node.parent': { $in: secondLevel },
      },
    },
  })
    .select({ id: 1 })
    .lean()
    .exec();
  const thirdLevel = thirdLevelChildren.map(({ _id }) => _id);

  return [rubric.id, ...secondLevel, ...thirdLevel];
}

export async function getRubricCounters({ rubric, args = {}, city }: GetRubricCountersInterface) {
  const rubricsIds = await getRubricNestedIds({ rubric, city });
  const query = getProductsFilter({ ...args, rubric: rubricsIds }, city);

  return ProductModel.countDocuments({
    ...query,
  });
}
