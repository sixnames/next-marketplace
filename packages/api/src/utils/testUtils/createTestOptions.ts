import { Option, OptionModel } from '../../entities/Option';
import {
  MOCK_OPTIONS_COMBINATION,
  MOCK_OPTIONS_GROUP_COLORS,
  MOCK_OPTIONS_GROUP_COMBINATIONS,
  MOCK_OPTIONS_GROUP_WINE_VARIANTS,
  MOCK_OPTIONS_GROUP_WINE_VINTAGE,
  MOCK_OPTIONS_VINTAGE,
  MOCK_OPTIONS_WINE_COLOR,
  MOCK_OPTIONS_WINE_VARIANT,
} from '@yagu/mocks';
import {
  OptionsGroup,
  OptionsGroupModel,
  OptionsGroupVariantEnum,
} from '../../entities/OptionsGroup';
import { OPTIONS_GROUP_VARIANT_COLOR, OPTIONS_GROUP_VARIANT_ICON } from '@yagu/config';
import { createTestUsers, CreateTestUsersPayloadInterface } from './createTestUsers';

export interface CreateTestOptionsInterface extends CreateTestUsersPayloadInterface {
  optionsVintage: Option[];
  optionsColor: Option[];
  optionsWineType: Option[];
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
  optionsGroupWineTypes: OptionsGroup;
  optionsGroupColors: OptionsGroup;
  optionsGroupCombination: OptionsGroup;
}

export const createTestOptions = async (): Promise<CreateTestOptionsInterface> => {
  // Users
  const usersPayload = await createTestUsers();

  const optionsVintage = await OptionModel.insertMany(MOCK_OPTIONS_VINTAGE);
  const optionsColor = await OptionModel.insertMany(MOCK_OPTIONS_WINE_COLOR);
  const optionsWineType = await OptionModel.insertMany(MOCK_OPTIONS_WINE_VARIANT);
  const optionsCombination = await OptionModel.insertMany(MOCK_OPTIONS_COMBINATION);

  const optionsIdsVintage = optionsVintage.map(({ id }) => id);
  const optionsIdsColor = optionsColor.map(({ id }) => id);
  const optionsIdsWineType = optionsWineType.map(({ id }) => id);
  const optionsIdsCombination = optionsCombination.map(({ id }) => id);

  const optionsSlugsVintage = optionsVintage.map(({ slug }) => slug);
  const optionsSlugsColor = optionsColor.map(({ slug }) => slug);
  const optionsSlugsWineType = optionsWineType.map(({ slug }) => slug);
  const optionsSlugsCombination = optionsCombination.map(({ slug }) => slug);

  const optionsGroupWineVintage = await OptionsGroupModel.create({
    ...MOCK_OPTIONS_GROUP_WINE_VINTAGE,
    options: optionsIdsVintage,
  });

  const optionsGroupWineTypes = await OptionsGroupModel.create({
    ...MOCK_OPTIONS_GROUP_WINE_VARIANTS,
    options: optionsIdsWineType,
  });

  const optionsGroupColors = await OptionsGroupModel.create({
    ...MOCK_OPTIONS_GROUP_COLORS,
    options: optionsIdsColor,
    variant: OPTIONS_GROUP_VARIANT_COLOR as OptionsGroupVariantEnum,
  });

  const optionsGroupCombination = await OptionsGroupModel.create({
    ...MOCK_OPTIONS_GROUP_COMBINATIONS,
    options: optionsIdsCombination,
    variant: OPTIONS_GROUP_VARIANT_ICON as OptionsGroupVariantEnum,
  });

  return {
    ...usersPayload,
    optionsVintage,
    optionsColor,
    optionsWineType,
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
    optionsGroupWineTypes,
    optionsGroupColors,
    optionsGroupCombination,
  };
};
