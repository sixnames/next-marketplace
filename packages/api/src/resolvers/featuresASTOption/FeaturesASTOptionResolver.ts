import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';
import { FeaturesASTOption } from '../../entities/FeaturesASTOption';
import { ContextInterface } from '../../types/context';
import { Rubric, RubricCity, RubricModel } from '../../entities/Rubric';
import getCityData from '../../utils/getCityData';
import { Types } from 'mongoose';
import getLangField from '../../utils/getLangField';

interface GetRubricCurrentCityDataInterface {
  rubrics: Rubric[];
  city: string;
  lang: string;
  callback: (city: RubricCity['node'], id: string, nameString: string) => any;
}

function getRubricCurrentCityData({
  rubrics,
  city,
  callback,
  lang,
}: GetRubricCurrentCityDataInterface) {
  const result: any[] = [];
  rubrics.forEach(({ cities, id }) => {
    const currentCity = getCityData(cities, city);
    if (currentCity && currentCity.node) {
      const nameString = getLangField(currentCity.node.name, lang);
      result.push(callback(currentCity.node, id, nameString));
    }
  });
  return result.filter((item) => item);
}

@Resolver((_of) => FeaturesASTOption)
export class FeaturesASTOptionResolver {
  @Query((_type) => [FeaturesASTOption])
  async getFeaturesASTOptions(
    @Ctx() ctx: ContextInterface,
    @Arg('selected', (_type) => [ID]) selected: string[],
  ): Promise<FeaturesASTOption[]> {
    const lang = ctx.req.session!.lang;
    const city = ctx.req.session!.city;
    const thirdLevelRubrics = await RubricModel.find({
      _id: {
        $in: selected,
      },
      cities: {
        $elemMatch: {
          key: city,
        },
      },
    });

    const thirdLevelParentsIds: Types.ObjectId[] = getRubricCurrentCityData({
      rubrics: thirdLevelRubrics,
      city,
      lang,
      callback: (node) => {
        if (node.parent) {
          return node.parent;
        }
        return null;
      },
    });

    const secondLevelRubrics = await RubricModel.find({
      _id: {
        $in: thirdLevelParentsIds,
      },
      cities: {
        $elemMatch: {
          key: city,
        },
      },
    })
      .populate('cities.node.attributesGroups.node')
      .populate('cities.node.parent');

    return getRubricCurrentCityData({
      rubrics: secondLevelRubrics,
      city,
      lang,
      callback: (node, id, nameString) => {
        const parent = node.parent as Rubric;
        const parentName = getRubricCurrentCityData({
          rubrics: [parent],
          city,
          lang,
          callback: (_, __, nameString) => {
            return nameString;
          },
        })[0];

        return {
          id,
          nameString: `${parentName} > ${nameString}`,
          attributesGroups: node.attributesGroups,
        };
      },
    });
  }
}
