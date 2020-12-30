import { Option, OptionModel } from '../../entities/Option';
import {
  OptionsGroup,
  OptionsGroupModel,
  OptionsGroupVariantEnum,
} from '../../entities/OptionsGroup';
import { createTestUsers, CreateTestUsersPayloadInterface } from './createTestUsers';
import {
  DEFAULT_LANG,
  GENDER_HE,
  GENDER_IT,
  GENDER_SHE,
  OPTIONS_GROUP_VARIANT_COLOR,
  OPTIONS_GROUP_VARIANT_ICON,
  SECONDARY_LANG,
} from '@yagu/shared';
import { GenderEnum } from '../../entities/commonEntities';

export interface CreateTestOptionsInterface extends CreateTestUsersPayloadInterface {
  optionVintageA: Option;
  optionVintageB: Option;
  optionVintageC: Option;
  optionsVintage: Option[];
  optionColorA: Option;
  optionColorB: Option;
  optionColorC: Option;
  optionsColor: Option[];
  optionWineVariantA: Option;
  optionWineVariantB: Option;
  optionWineVariantC: Option;
  optionWineVariantD: Option;
  optionsWineVariant: Option[];
  optionCombinationA: Option;
  optionCombinationB: Option;
  optionCombinationC: Option;
  optionCombinationD: Option;
  optionsCombination: Option[];
  optionsIdsVintage: string[];
  optionsIdsColor: string[];
  optionsIdsWineType: string[];
  optionsIdsCombination: string[];
  optionsSlugsVintage: string[];
  optionsSlugsColor: string[];
  optionsSlugsWineType: string[];
  optionsSlugsCombination: string[];
  optionsGroupWineVintage: OptionsGroup;
  optionsGroupWineVariants: OptionsGroup;
  optionsGroupColors: OptionsGroup;
  optionsGroupCombination: OptionsGroup;
}

export const createTestOptions = async (): Promise<CreateTestOptionsInterface> => {
  // Users
  const usersPayload = await createTestUsers();

  const genderHe = GENDER_HE as GenderEnum;
  const genderShe = GENDER_SHE as GenderEnum;
  const genderIt = GENDER_IT as GenderEnum;

  const optionVintageA = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: '1950' },
      { key: SECONDARY_LANG, value: '1950' },
    ],
    gender: genderIt,
    priorities: [],
    views: [],
    slug: '1950',
  });

  const optionVintageB = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: '1978' },
      { key: SECONDARY_LANG, value: '1978' },
    ],
    gender: genderIt,
    priorities: [],
    views: [],
    slug: '1978',
  });

  const optionVintageC = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: '2001' },
      { key: SECONDARY_LANG, value: '2001' },
    ],
    gender: genderIt,
    priorities: [],
    views: [],
    slug: '2001',
  });
  const optionsVintage = [optionVintageA, optionVintageB, optionVintageC];

  const optionColorA = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Белый' },
      { key: SECONDARY_LANG, value: 'White' },
    ],
    gender: genderHe,
    priorities: [],
    views: [],
    slug: 'beliy',
    color: 'ffffff',
    variants: [
      {
        key: genderShe,
        value: [
          { key: DEFAULT_LANG, value: 'Белая' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
      {
        key: genderHe,
        value: [
          { key: DEFAULT_LANG, value: 'Белый' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
      {
        key: genderIt,
        value: [
          { key: DEFAULT_LANG, value: 'Белое' },
          { key: SECONDARY_LANG, value: 'White' },
        ],
      },
    ],
  });

  const optionColorB = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Красный' },
      { key: SECONDARY_LANG, value: 'Red' },
    ],
    gender: genderHe,
    priorities: [],
    views: [],
    slug: 'krasniy',
    color: '99020b',
    variants: [
      {
        key: genderShe,
        value: [
          { key: DEFAULT_LANG, value: 'Красная' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
      {
        key: genderHe,
        value: [
          { key: DEFAULT_LANG, value: 'Красный' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
      {
        key: genderIt,
        value: [
          { key: DEFAULT_LANG, value: 'Красное' },
          { key: SECONDARY_LANG, value: 'Red' },
        ],
      },
    ],
  });

  const optionColorC = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Розовый' },
      { key: SECONDARY_LANG, value: 'Pink' },
    ],
    gender: genderHe,
    priorities: [],
    views: [],
    slug: 'rozoviy',
    color: 'db8ce0',
    variants: [
      {
        key: genderShe,
        value: [
          { key: DEFAULT_LANG, value: 'Розовая' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
      {
        key: genderHe,
        value: [
          { key: DEFAULT_LANG, value: 'Розовый' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
      {
        key: genderIt,
        value: [
          { key: DEFAULT_LANG, value: 'Розовое' },
          { key: SECONDARY_LANG, value: 'Pink' },
        ],
      },
    ],
  });
  const optionsColor = [optionColorA, optionColorB, optionColorC];

  const optionWineVariantA = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Портвейн' },
      { key: SECONDARY_LANG, value: 'Port_wine' },
    ],
    priorities: [],
    views: [],
    slug: 'portvein',
    gender: genderHe,
  });

  const optionWineVariantB = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Херес' },
      { key: SECONDARY_LANG, value: 'Heres' },
    ],
    priorities: [],
    views: [],
    slug: 'heres',
    gender: genderHe,
  });

  const optionWineVariantC = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Вермут' },
      { key: SECONDARY_LANG, value: 'Vermut' },
    ],
    priorities: [],
    views: [],
    slug: 'vermut',
    gender: genderHe,
  });

  const optionWineVariantD = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Крепленое' },
      { key: SECONDARY_LANG, value: 'Hard' },
    ],
    priorities: [],
    views: [],
    slug: 'kreplenoe',
    gender: genderIt,
  });
  const optionsWineVariant = [
    optionWineVariantA,
    optionWineVariantB,
    optionWineVariantC,
    optionWineVariantD,
  ];

  const optionCombinationA = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Белое_мясо' },
      { key: SECONDARY_LANG, value: 'White_meat' },
    ],
    icon: 'white-meat',
    priorities: [],
    views: [],
    slug: 'white_meat',
    gender: genderIt,
  });

  const optionCombinationB = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Суп' },
      { key: SECONDARY_LANG, value: 'Soup' },
    ],
    icon: 'soup',
    priorities: [],
    views: [],
    slug: 'soup',
    gender: genderHe,
  });

  const optionCombinationC = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Рыба' },
      { key: SECONDARY_LANG, value: 'Fish' },
    ],
    icon: 'fish',
    priorities: [],
    views: [],
    slug: 'fish',
    gender: genderHe,
  });

  const optionCombinationD = await OptionModel.create({
    name: [
      { key: DEFAULT_LANG, value: 'Дары_моря' },
      { key: SECONDARY_LANG, value: 'Seafood' },
    ],
    icon: 'seafood',
    priorities: [],
    views: [],
    slug: 'seafood',
    gender: genderIt,
  });
  const optionsCombination = [
    optionCombinationA,
    optionCombinationB,
    optionCombinationC,
    optionCombinationD,
  ];

  const optionsIdsVintage = optionsVintage.map(({ id }) => id);
  const optionsIdsColor = optionsColor.map(({ id }) => id);
  const optionsIdsWineType = optionsWineVariant.map(({ id }) => id);
  const optionsIdsCombination = optionsCombination.map(({ id }) => id);

  const optionsSlugsVintage = optionsVintage.map(({ slug }) => slug);
  const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
  const optionsSlugsWineType = optionsWineVariant.map(({ slug }) => slug);
  const optionsSlugsCombination = optionsCombination.map(({ slug }) => slug);

  const optionsGroupWineVintage = await OptionsGroupModel.create({
    options: optionsIdsVintage,
    name: [
      { key: DEFAULT_LANG, value: 'Винтаж_вина' },
      { key: SECONDARY_LANG, value: 'Wine_vintage' },
    ],
  });

  const optionsGroupWineVariants = await OptionsGroupModel.create({
    options: optionsIdsWineType,
    name: [
      { key: DEFAULT_LANG, value: 'Типы_вина' },
      { key: SECONDARY_LANG, value: 'Wine_types' },
    ],
  });

  const optionsGroupColors = await OptionsGroupModel.create({
    options: optionsIdsColor,
    variant: OPTIONS_GROUP_VARIANT_COLOR as OptionsGroupVariantEnum,
    name: [
      { key: DEFAULT_LANG, value: 'Цвета' },
      { key: SECONDARY_LANG, value: 'Colors' },
    ],
  });

  const optionsGroupCombination = await OptionsGroupModel.create({
    options: optionsIdsCombination,
    variant: OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantEnum,
    name: [
      { key: DEFAULT_LANG, value: 'Сочетания' },
      { key: SECONDARY_LANG, value: 'Combinations' },
    ],
  });

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
    optionsIdsWineType,
    optionsIdsCombination,
    optionsSlugsVintage,
    optionsSlugsColor,
    optionsSlugsWineType,
    optionsSlugsCombination,
    optionsGroupWineVintage,
    optionsGroupWineVariants,
    optionsGroupColors,
    optionsGroupCombination,
  };
};
