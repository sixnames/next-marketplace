import { getFieldStringLocale } from '../../../lib/i18n';
import { GenderModel } from '../../dbModels';
import { OptionInterface } from '../../uiInterfaces';

interface CastOptionForUI {
  option: OptionInterface;
  locale: string;
  gender?: GenderModel | null;
}

export function castOptionForUI({ option, locale, gender }: CastOptionForUI): OptionInterface {
  let name = getFieldStringLocale(option.nameI18n, locale);
  if (gender) {
    const optionVariant = option.variants[gender];
    if (optionVariant) {
      const variantName = getFieldStringLocale(optionVariant, locale);
      if (variantName) {
        name = variantName;
      }
    }
  }
  return {
    ...option,
    name,
    options: (option.options || []).map((nestedOption) => {
      return castOptionForUI({
        option: nestedOption,
        locale,
        gender,
      });
    }),
  };
}
