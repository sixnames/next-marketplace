import { GENDER_HE, GENDER_IT, GENDER_SHE } from '../common';

const metricTranslations = {
  selectsOptions: {
    gender: {
      [GENDER_SHE]: {
        ru: 'Женский род',
        en: 'She',
      },
      [GENDER_HE]: {
        ru: 'Мужской род',
        en: 'He',
      },
      [GENDER_IT]: {
        ru: 'Средний род',
        en: 'It',
      },
    },
  },
};

export default metricTranslations;
