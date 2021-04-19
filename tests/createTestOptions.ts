import { getDatabase } from 'db/mongodb';
import { createTestUsers, CreateTestUsersPayloadInterface } from './createTestUsers';
import { GenderModel, OptionModel, OptionsGroupModel, OptionsGroupVariantModel } from 'db/dbModels';
import {
  DEFAULT_LOCALE,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_TEXT,
  SECONDARY_LOCALE,
} from 'config/common';
import { COL_OPTIONS_GROUPS } from 'db/collectionNames';
import { ObjectId } from 'mongodb';

export interface CreateTestOptionsInterface extends CreateTestUsersPayloadInterface {
  optionVintageA: OptionModel;
  optionVintageB: OptionModel;
  optionVintageC: OptionModel;
  optionsVintage: OptionModel[];
  optionColorA: OptionModel;
  optionColorB: OptionModel;
  optionColorC: OptionModel;
  optionsColor: OptionModel[];
  optionWineVariantA: OptionModel;
  optionWineVariantB: OptionModel;
  optionWineVariantC: OptionModel;
  optionWineVariantD: OptionModel;
  optionsWineVariant: OptionModel[];
  optionCombinationA: OptionModel;
  optionCombinationB: OptionModel;
  optionCombinationC: OptionModel;
  optionCombinationD: OptionModel;
  optionsCombination: OptionModel[];
  optionsIdsVintage: ObjectId[];
  optionsIdsColor: ObjectId[];
  optionsIdsWineVariant: ObjectId[];
  optionsIdsCombination: ObjectId[];
  optionsSlugsVintage: string[];
  optionsSlugsColor: string[];
  optionsSlugsWineVariant: string[];
  optionsSlugsCombination: string[];
  optionsGroupWineVintage: OptionsGroupModel;
  optionsGroupWineVariants: OptionsGroupModel;
  optionsGroupColors: OptionsGroupModel;
  optionsGroupCombination: OptionsGroupModel;
}

export const createTestOptions = async (): Promise<CreateTestOptionsInterface> => {
  const db = await getDatabase();
  const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
  const usersPayload = await createTestUsers();

  const optionsGroupVariantText = OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel;
  const optionsGroupVariantColor = OPTIONS_GROUP_VARIANT_COLOR as OptionsGroupVariantModel;
  const optionsGroupVariantIcon = OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantModel;

  const genderHe = GENDER_HE as GenderModel;
  const genderShe = GENDER_SHE as GenderModel;
  const genderIt = GENDER_IT as GenderModel;

  // Vintage options
  const optionsGroupWineVintageId = new ObjectId('604cad83b604c1c320c32870');

  const optionVintageAId = new ObjectId('604cad83b604c1c320c3286d');
  const optionVintageA: OptionModel = {
    _id: optionVintageAId,
    nameI18n: {
      [DEFAULT_LOCALE]: '1950',
      [SECONDARY_LOCALE]: '1950',
    },
    gender: genderIt,
    slug: '1950',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVintageId,
  };

  const optionVintageBId = new ObjectId('604cad83b604c1c320c3286e');
  const optionVintageB: OptionModel = {
    _id: optionVintageBId,
    nameI18n: {
      [DEFAULT_LOCALE]: '1978',
      [SECONDARY_LOCALE]: '1978',
    },
    gender: genderIt,
    slug: '1978',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVintageId,
  };

  const optionVintageCId = new ObjectId('604cad83b604c1c320c3286f');
  const optionVintageC: OptionModel = {
    _id: optionVintageCId,
    nameI18n: {
      [DEFAULT_LOCALE]: '2001',
      [SECONDARY_LOCALE]: '2001',
    },
    gender: genderIt,
    slug: '2001',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVintageId,
  };

  const optionsVintage = [optionVintageA, optionVintageB, optionVintageC];
  const optionsIdsVintage = [optionVintageAId, optionVintageBId, optionVintageCId];
  const optionsSlugsVintage = optionsVintage.map(({ slug }) => slug);

  const optionsGroupWineVintage: OptionsGroupModel = {
    _id: optionsGroupWineVintageId,
    variant: optionsGroupVariantText,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Винтаж вина',
      [SECONDARY_LOCALE]: 'Wine vintage',
    },
  };

  // Color options
  const optionsGroupColorsId = new ObjectId('604cad83b604c1c320c32874');

  const optionColorAId = new ObjectId('604cad83b604c1c320c32871');
  const optionColorA: OptionModel = {
    _id: optionColorAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Белый',
      [SECONDARY_LOCALE]: 'White',
    },
    gender: genderHe,
    slug: 'beliy',
    color: 'ffffff',
    options: [],
    variants: {
      [genderShe]: {
        [DEFAULT_LOCALE]: 'Белая',
        [SECONDARY_LOCALE]: 'White',
      },
      [genderHe]: {
        [DEFAULT_LOCALE]: 'Белый',
        [SECONDARY_LOCALE]: 'White',
      },
      [genderIt]: {
        [DEFAULT_LOCALE]: 'Белое',
        [SECONDARY_LOCALE]: 'White',
      },
    },
    optionsGroupId: optionsGroupColorsId,
  };

  const optionColorBId = new ObjectId('604cad83b604c1c320c32872');
  const optionColorB: OptionModel = {
    _id: optionColorBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Красный',
      [SECONDARY_LOCALE]: 'Red',
    },
    gender: genderHe,
    slug: 'krasniy',
    color: '99020b',
    options: [],
    variants: {
      [genderShe]: {
        [DEFAULT_LOCALE]: 'Красная',
        [SECONDARY_LOCALE]: 'Red',
      },
      [genderHe]: {
        [DEFAULT_LOCALE]: 'Красный',
        [SECONDARY_LOCALE]: 'Red',
      },
      [genderIt]: {
        [DEFAULT_LOCALE]: 'Красное',
        [SECONDARY_LOCALE]: 'Red',
      },
    },
    optionsGroupId: optionsGroupColorsId,
  };

  const optionColorCId = new ObjectId('604cad83b604c1c320c32873');
  const optionColorC: OptionModel = {
    _id: optionColorCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Розовый',
      [SECONDARY_LOCALE]: 'Pink',
    },
    gender: genderHe,
    slug: 'rozoviy',
    color: 'db8ce0',
    options: [],
    variants: {
      [genderShe]: {
        [DEFAULT_LOCALE]: 'Розовая',
        [SECONDARY_LOCALE]: 'Pink',
      },
      [genderHe]: {
        [DEFAULT_LOCALE]: 'Розовый',
        [SECONDARY_LOCALE]: 'Pink',
      },
      [genderIt]: {
        [DEFAULT_LOCALE]: 'Розовое',
        [SECONDARY_LOCALE]: 'Pink',
      },
    },
    optionsGroupId: optionsGroupColorsId,
  };

  const optionsColor = [optionColorA, optionColorB, optionColorC];
  const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
  const optionsIdsColor = [optionColorAId, optionColorBId, optionColorCId];

  const optionsGroupColors: OptionsGroupModel = {
    _id: optionsGroupColorsId,
    variant: optionsGroupVariantColor,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Цвета',
      [SECONDARY_LOCALE]: 'Colors',
    },
  };

  // Wine variant options
  const optionsGroupWineVariantsId = new ObjectId('604cad83b604c1c320c32879');

  const optionWineVariantAId = new ObjectId('604cad83b604c1c320c32875');
  const optionWineVariantA: OptionModel = {
    _id: optionWineVariantAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Портвейн',
      [SECONDARY_LOCALE]: 'Port wine',
    },
    gender: genderHe,
    slug: 'portvein',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVariantsId,
  };

  const optionWineVariantBId = new ObjectId('604cad83b604c1c320c32876');
  const optionWineVariantB: OptionModel = {
    _id: optionWineVariantBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Херес',
      [SECONDARY_LOCALE]: 'Heres',
    },
    gender: genderHe,
    slug: 'heres',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVariantsId,
  };

  const optionWineVariantCId = new ObjectId('604cad83b604c1c320c32877');
  const optionWineVariantC: OptionModel = {
    _id: optionWineVariantCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Вермут',
      [SECONDARY_LOCALE]: 'Vermut',
    },
    gender: genderHe,
    slug: 'vermut',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVariantsId,
  };

  const optionWineVariantDId = new ObjectId('604cad83b604c1c320c32878');
  const optionWineVariantD = {
    _id: optionWineVariantDId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Крепленое',
      [SECONDARY_LOCALE]: 'Hard',
    },
    gender: genderIt,
    priorities: {},
    views: {},
    slug: 'kreplenoe',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupWineVariantsId,
  };

  const optionsWineVariant = [
    optionWineVariantA,
    optionWineVariantB,
    optionWineVariantC,
    optionWineVariantD,
  ];
  const optionsIdsWineVariant = [
    optionWineVariantAId,
    optionWineVariantBId,
    optionWineVariantCId,
    optionWineVariantDId,
  ];
  const optionsSlugsWineVariant = optionsWineVariant.map(({ slug }) => slug);

  const optionsGroupWineVariants: OptionsGroupModel = {
    _id: optionsGroupWineVariantsId,
    variant: optionsGroupVariantText,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Типы вина',
      [SECONDARY_LOCALE]: 'Wine types',
    },
  };

  // Combination options
  const optionsGroupCombinationId = new ObjectId('604cad83b604c1c320c3287e');

  const optionCombinationAId = new ObjectId('604cad83b604c1c320c3287a');
  const optionCombinationA: OptionModel = {
    _id: optionCombinationAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Белое мясо',
      [SECONDARY_LOCALE]: 'White meat',
    },
    gender: genderIt,
    icon: 'white-meat',
    slug: 'white_meat',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupCombinationId,
  };

  const optionCombinationBId = new ObjectId('604cad83b604c1c320c3287b');
  const optionCombinationB: OptionModel = {
    _id: optionCombinationBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Суп',
      [SECONDARY_LOCALE]: 'Soup',
    },
    gender: genderHe,
    icon: 'soup',
    slug: 'soup',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupCombinationId,
  };

  const optionCombinationCId = new ObjectId('604cad83b604c1c320c3287c');
  const optionCombinationC: OptionModel = {
    _id: optionCombinationCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Рыба',
      [SECONDARY_LOCALE]: 'Fish',
    },
    gender: genderShe,
    icon: 'fish',
    slug: 'fish',
    options: [],
    variants: {},
    optionsGroupId: optionsGroupCombinationId,
  };

  const optionCombinationDId = new ObjectId('604cad83b604c1c320c3287d');
  const optionCombinationD: OptionModel = {
    _id: optionCombinationDId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Дары моря',
      [SECONDARY_LOCALE]: 'Seafood',
    },
    icon: 'seafood',
    slug: 'seafood',
    gender: genderIt,
    options: [],
    variants: {},
    optionsGroupId: optionsGroupCombinationId,
  };

  const optionsCombination = [
    optionCombinationA,
    optionCombinationB,
    optionCombinationC,
    optionCombinationD,
  ];
  const optionsIdsCombination = [
    optionCombinationAId,
    optionCombinationBId,
    optionCombinationCId,
    optionCombinationDId,
  ];
  const optionsSlugsCombination = optionsCombination.map(({ slug }) => slug);

  const optionsGroupCombination: OptionsGroupModel = {
    _id: optionsGroupCombinationId,
    variant: optionsGroupVariantIcon,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Сочетания',
      [SECONDARY_LOCALE]: 'Combinations',
    },
  };

  // Insert all
  await optionsGroupsCollection.insertMany([
    optionsGroupWineVintage,
    optionsGroupWineVariants,
    optionsGroupColors,
    optionsGroupCombination,
  ]);

  return {
    ...usersPayload,
    optionVintageA,
    optionVintageB,
    optionVintageC,
    optionsVintage,
    optionColorA,
    optionColorB,
    optionColorC,
    optionsColor,
    optionWineVariantA,
    optionWineVariantB,
    optionWineVariantC,
    optionWineVariantD,
    optionsWineVariant,
    optionCombinationA,
    optionCombinationB,
    optionCombinationC,
    optionCombinationD,
    optionsCombination,
    optionsIdsVintage,
    optionsIdsColor,
    optionsIdsWineVariant,
    optionsIdsCombination,
    optionsSlugsVintage,
    optionsSlugsColor,
    optionsSlugsWineVariant,
    optionsSlugsCombination,
    optionsGroupWineVintage,
    optionsGroupWineVariants,
    optionsGroupColors,
    optionsGroupCombination,
  };
};
