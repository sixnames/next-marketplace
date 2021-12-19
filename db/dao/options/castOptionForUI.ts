import { getFieldStringLocale } from '../../../lib/i18n';
import { OptionInterface } from '../../uiInterfaces';

interface CastOptionForUI {
  option: OptionInterface;
  locale: string;
}

export function castOptionForUI({ option, locale }: CastOptionForUI): OptionInterface {
  return {
    ...option,
    name: getFieldStringLocale(option.nameI18n, locale),
    options: (option.options || []).map((nestedOption) => {
      return castOptionForUI({
        option: nestedOption,
        locale,
      });
    }),
  };
}
