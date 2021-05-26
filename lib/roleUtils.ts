import { COL_ROLE_RULES } from 'db/collectionNames';
import { ObjectIdModel, RoleRuleBase } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RoleRuleInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { ObjectId } from 'mongodb';

const baseRoleRules: RoleRuleBase[] = [
  {
    allow: false,
    slug: 'createProduct',
    descriptionI18n: {},
    nameI18n: {
      ru: 'Создание товара',
    },
  },
];

interface GetRoleRulesAstInterface {
  roleId: ObjectIdModel;
  locale: string;
}

export async function getRoleRulesAst({
  roleId,
  locale,
}: GetRoleRulesAstInterface): Promise<RoleRuleInterface[]> {
  const db = await getDatabase();
  const roleRulesCollection = db.collection<RoleRuleInterface>(COL_ROLE_RULES);
  const initialRoleRules = await roleRulesCollection
    .find({
      roleId,
    })
    .toArray();

  const roleRulesAst = baseRoleRules.reduce((acc: RoleRuleInterface[], base) => {
    const existingRule = initialRoleRules.find(({ slug }) => base.slug === slug);
    if (!existingRule) {
      return [
        ...acc,
        {
          ...base,
          roleId,
          _id: new ObjectId(),
          name: getFieldStringLocale(base.nameI18n, locale),
          description: getFieldStringLocale(base.descriptionI18n, locale),
        },
      ];
    }
    return [
      ...acc,
      {
        ...base,
        roleId,
        _id: existingRule._id,
        name: getFieldStringLocale(base.nameI18n, locale),
        description: getFieldStringLocale(base.descriptionI18n, locale),
      },
    ];
  }, []);

  return roleRulesAst;
}
