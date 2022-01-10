import {
  getAttributePositioningOptions,
  getAttributeVariantsOptions,
  getAttributeViewVariantsOptions,
  getGenderOptions,
  getIconOptions,
  getOptionsGroupVariantsOptions,
  ISO_LANGUAGES,
} from '../config/constantSelects';
import { useLocaleContext } from '../context/localeContext';

export const useConstantOptions = () => {
  const { locale } = useLocaleContext();
  return {
    genderOptions: getGenderOptions(locale),
    attributeVariantOptions: getAttributeVariantsOptions(locale),
    attributeViewVariantOptions: getAttributeViewVariantsOptions(locale),
    attributePositioningOptions: getAttributePositioningOptions(locale),
    optionsGroupVariantOptions: getOptionsGroupVariantsOptions(locale),
    iconOptions: getIconOptions(),
    localeOptions: ISO_LANGUAGES,
  };
};
