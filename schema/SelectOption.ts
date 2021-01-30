import { extendType } from 'nexus';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  GENDER_ENUMS,
  ISO_LANGUAGES,
  OPTIONS_GROUP_VARIANT_ENUMS,
} from 'config/common';
import { getFieldTranslation } from 'config/constantTranslations';
import { getRequestParams } from 'lib/sessionHelpers';
import { SelectOptionModel } from 'db/dbModels';
import { iconTypesList } from 'types/iconTypes';

export const SelectOptionsQueries = extendType({
  type: 'Query',
  definition(t) {
    // Should return gender options
    t.nonNull.list.nonNull.field('getGenderOptions', {
      type: 'SelectOption',
      description: 'Should return gender options',
      resolve: async (_root, _args, context): Promise<SelectOptionModel[]> => {
        const { locale } = await getRequestParams(context);
        return GENDER_ENUMS.map((gender) => ({
          _id: gender,
          name: getFieldTranslation(`selectsOptions.gender.${gender}.${locale}`),
        }));
      },
    });

    // Should return attribute variants options
    t.nonNull.list.nonNull.field('getAttributeVariantsOptions', {
      type: 'SelectOption',
      description: 'Should return attribute variants options',
      resolve: async (_root, _args, context): Promise<SelectOptionModel[]> => {
        const { locale } = await getRequestParams(context);
        return ATTRIBUTE_VARIANTS_ENUMS.map((variant) => ({
          _id: variant,
          name: getFieldTranslation(`selectsOptions.attributeVariants.${variant}.${locale}`),
        }));
      },
    });

    // Should return attribute view variants options
    t.nonNull.list.nonNull.field('getAttributeViewVariantsOptions', {
      type: 'SelectOption',
      description: 'Should return attribute view variants options',
      resolve: async (_root, _args, context): Promise<SelectOptionModel[]> => {
        const { locale } = await getRequestParams(context);
        return ATTRIBUTE_VIEW_VARIANTS_ENUMS.map((variant) => ({
          _id: variant,
          name: getFieldTranslation(`selectsOptions.attributeView.${variant}.${locale}`),
        }));
      },
    });

    // Should return options groups variants options
    t.nonNull.list.nonNull.field('getOptionsGroupVariantsOptions', {
      type: 'SelectOption',
      description: 'Should return options groups variants options',
      resolve: async (_root, _args, context): Promise<SelectOptionModel[]> => {
        const { locale } = await getRequestParams(context);
        return OPTIONS_GROUP_VARIANT_ENUMS.map((variant) => ({
          _id: variant,
          name: getFieldTranslation(`selectsOptions.optionsGroupVariant.${variant}.${locale}`),
        }));
      },
    });

    // Should return attribute positioning options
    t.nonNull.list.nonNull.field('getAttributePositioningOptions', {
      type: 'SelectOption',
      description: 'Should return attribute positioning options',
      resolve: async (_root, _args, context): Promise<SelectOptionModel[]> => {
        const { locale } = await getRequestParams(context);
        return ATTRIBUTE_POSITION_IN_TITLE_ENUMS.map((position) => ({
          _id: position,
          name: getFieldTranslation(`selectsOptions.attributePositioning.${position}.${locale}`),
        }));
      },
    });

    // Should return ISO languages options
    t.nonNull.list.nonNull.field('getISOLanguagesOptions', {
      type: 'SelectOption',
      description: 'Should return ISO languages options',
      resolve: async (): Promise<SelectOptionModel[]> => {
        return ISO_LANGUAGES;
      },
    });

    // Should return icon options
    t.nonNull.list.nonNull.field('getIconsOptions', {
      type: 'SelectOption',
      description: 'Should return icon options',
      resolve: async (): Promise<SelectOptionModel[]> => {
        return iconTypesList.map((icon) => ({
          _id: icon,
          name: icon,
          icon: icon,
        }));
      },
    });
  },
});
