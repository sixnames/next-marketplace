import { getDatabase } from 'db/mongodb';
import { createTestUsers, CreateTestUsersPayloadInterface } from './createTestUsers';
import { GenderModel, OptionModel, OptionsGroupModel, OptionsGroupVariantModel } from 'db/dbModels';
import {
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
  OPTIONS_GROUP_VARIANT_TEXT,
  SECONDARY_LOCALE,
} from 'config/common';
import { COL_OPTIONS, COL_OPTIONS_GROUPS } from 'db/collectionNames';
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
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
  const usersPayload = await createTestUsers();

  const optionsGroupVariantText = OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel;
  const optionsGroupVariantColor = OPTIONS_GROUP_VARIANT_COLOR as OptionsGroupVariantModel;
  const optionsGroupVariantIcon = OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantModel;

  const genderHe = GENDER_HE as GenderModel;
  const genderShe = GENDER_SHE as GenderModel;
  const genderIt = GENDER_IT as GenderModel;

  // Vintage options
  const optionVintageAId = new ObjectId();
  const optionVintageA: OptionModel = {
    _id: optionVintageAId,
    nameI18n: {
      [DEFAULT_LOCALE]: '1950',
      [SECONDARY_LOCALE]: '1950',
    },
    gender: genderIt,
    priorities: {},
    views: {},
    slug: '1950',
  };

  const optionVintageBId = new ObjectId();
  const optionVintageB: OptionModel = {
    _id: optionVintageBId,
    nameI18n: {
      [DEFAULT_LOCALE]: '1978',
      [SECONDARY_LOCALE]: '1978',
    },
    gender: genderIt,
    slug: '1978',
    ...DEFAULT_COUNTERS_OBJECT,
  };

  const optionVintageCId = new ObjectId();
  const optionVintageC: OptionModel = {
    _id: optionVintageCId,
    nameI18n: {
      [DEFAULT_LOCALE]: '2001',
      [SECONDARY_LOCALE]: '2001',
    },
    gender: genderIt,
    priorities: {},
    views: {},
    slug: '2001',
  };

  const optionsVintage = [optionVintageA, optionVintageB, optionVintageC];
  const optionsIdsVintage = [optionVintageAId, optionVintageBId, optionVintageCId];
  const optionsSlugsVintage = optionsVintage.map(({ slug }) => slug);

  const optionsGroupWineVintageId = new ObjectId();
  const optionsGroupWineVintage: OptionsGroupModel = {
    _id: optionsGroupWineVintageId,
    variant: optionsGroupVariantText,
    optionsIds: optionsIdsVintage,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Винтаж вина',
      [SECONDARY_LOCALE]: 'Wine vintage',
    },
  };

  // Color options
  const optionColorAId = new ObjectId();
  const optionColorA: OptionModel = {
    _id: optionColorAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Белый',
      [SECONDARY_LOCALE]: 'White',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    slug: 'beliy',
    color: 'ffffff',
    variants: [
      {
        gender: genderShe,
        value: {
          [DEFAULT_LOCALE]: 'Белая',
          [SECONDARY_LOCALE]: 'White',
        },
      },
      {
        gender: genderHe,
        value: {
          [DEFAULT_LOCALE]: 'Белый',
          [SECONDARY_LOCALE]: 'White',
        },
      },
      {
        gender: genderIt,
        value: {
          [DEFAULT_LOCALE]: 'Белое',
          [SECONDARY_LOCALE]: 'White',
        },
      },
    ],
  };

  const optionColorBId = new ObjectId();
  const optionColorB: OptionModel = {
    _id: optionColorBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Красный',
      [SECONDARY_LOCALE]: 'Red',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    slug: 'krasniy',
    color: '99020b',
    variants: [
      {
        gender: genderShe,
        value: {
          [DEFAULT_LOCALE]: 'Красная',
          [SECONDARY_LOCALE]: 'Red',
        },
      },
      {
        gender: genderHe,
        value: {
          [DEFAULT_LOCALE]: 'Красный',
          [SECONDARY_LOCALE]: 'Red',
        },
      },
      {
        gender: genderIt,
        value: {
          [DEFAULT_LOCALE]: 'Красное',
          [SECONDARY_LOCALE]: 'Red',
        },
      },
    ],
  };

  const optionColorCId = new ObjectId();
  const optionColorC: OptionModel = {
    _id: optionColorCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Розовый',
      [SECONDARY_LOCALE]: 'Pink',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    slug: 'rozoviy',
    color: 'db8ce0',
    variants: [
      {
        gender: genderShe,
        value: {
          [DEFAULT_LOCALE]: 'Розовая',
          [SECONDARY_LOCALE]: 'Pink',
        },
      },
      {
        gender: genderHe,
        value: {
          [DEFAULT_LOCALE]: 'Розовый',
          [SECONDARY_LOCALE]: 'Pink',
        },
      },
      {
        gender: genderIt,
        value: {
          [DEFAULT_LOCALE]: 'Розовое',
          [SECONDARY_LOCALE]: 'Pink',
        },
      },
    ],
  };

  const optionsColor = [optionColorA, optionColorB, optionColorC];
  const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
  const optionsIdsColor = [optionColorAId, optionColorBId, optionColorCId];

  const optionsGroupColorsId = new ObjectId();
  const optionsGroupColors: OptionsGroupModel = {
    _id: optionsGroupColorsId,
    variant: optionsGroupVariantColor,
    optionsIds: optionsIdsColor,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Цвета',
      [SECONDARY_LOCALE]: 'Colors',
    },
  };

  // Wine variant options
  const optionWineVariantAId = new ObjectId();
  const optionWineVariantA: OptionModel = {
    _id: optionWineVariantAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Портвейн',
      [SECONDARY_LOCALE]: 'Port wine',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    slug: 'portvein',
  };

  const optionWineVariantBId = new ObjectId();
  const optionWineVariantB: OptionModel = {
    _id: optionWineVariantBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Херес',
      [SECONDARY_LOCALE]: 'Heres',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    slug: 'heres',
  };

  const optionWineVariantCId = new ObjectId();
  const optionWineVariantC: OptionModel = {
    _id: optionWineVariantCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Вермут',
      [SECONDARY_LOCALE]: 'Vermut',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    slug: 'vermut',
  };

  const optionWineVariantDId = new ObjectId();
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

  const optionsGroupWineVariantsId = new ObjectId();
  const optionsGroupWineVariants: OptionsGroupModel = {
    _id: optionsGroupWineVariantsId,
    variant: optionsGroupVariantText,
    optionsIds: optionsIdsWineVariant,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Типы вина',
      [SECONDARY_LOCALE]: 'Wine types',
    },
  };

  // Combination options
  const optionCombinationAId = new ObjectId();
  const optionCombinationA: OptionModel = {
    _id: optionCombinationAId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Белое мясо',
      [SECONDARY_LOCALE]: 'White meat',
    },
    gender: genderIt,
    priorities: {},
    views: {},
    icon: 'white-meat',
    slug: 'white_meat',
  };

  const optionCombinationBId = new ObjectId();
  const optionCombinationB: OptionModel = {
    _id: optionCombinationBId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Суп',
      [SECONDARY_LOCALE]: 'Soup',
    },
    gender: genderHe,
    priorities: {},
    views: {},
    icon: 'soup',
    slug: 'soup',
  };

  const optionCombinationCId = new ObjectId();
  const optionCombinationC: OptionModel = {
    _id: optionCombinationCId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Рыба',
      [SECONDARY_LOCALE]: 'Fish',
    },
    gender: genderShe,
    priorities: {},
    views: {},
    icon: 'fish',
    slug: 'fish',
  };

  const optionCombinationDId = new ObjectId();
  const optionCombinationD: OptionModel = {
    _id: optionCombinationDId,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Дары моря',
      [SECONDARY_LOCALE]: 'Seafood',
    },
    priorities: {},
    views: {},
    icon: 'seafood',
    slug: 'seafood',
    gender: genderIt,
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

  const optionsGroupCombinationId = new ObjectId();
  const optionsGroupCombination: OptionsGroupModel = {
    _id: optionsGroupCombinationId,
    variant: optionsGroupVariantIcon,
    optionsIds: optionsIdsCombination,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Сочетания',
      [SECONDARY_LOCALE]: 'Combinations',
    },
  };

  // Insert all
  await optionsCollection.insertMany([
    ...optionsVintage,
    ...optionsColor,
    ...optionsWineVariant,
    ...optionsCombination,
  ]);

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