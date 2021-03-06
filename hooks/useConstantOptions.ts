import { useLocaleContext } from '../components/context/localeContext';
import {
  getAttributePositioningOptions,
  getAttributeVariantsOptions,
  getAttributeViewVariantsOptions,
  getGenderOptions,
  getIconOptions,
  getOptionsGroupVariantsOptions,
  ISO_LANGUAGES,
} from '../lib/config/constantSelects';

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
