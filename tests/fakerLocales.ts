import * as fakerRu from 'faker/locale/ru';
import * as fakerEn from 'faker/locale/en';

const getFakePhone = () => {
  return `7${fakerRu.phone.phoneNumberFormat()}`;
};

export { fakerRu, fakerEn, getFakePhone };
