import PhoneNumber from 'awesome-phonenumber';

const getCleanPhone = (phone: string) => {
  return (
    '+' + phone.replace('(', '').replace(')', '').replace('-', '').replace('+', '').replace(' ', '')
  );
};

export const phoneToRaw = (phone?: string | null) => {
  if (!phone) {
    return '';
  }

  return new PhoneNumber(getCleanPhone(phone)).getNumber('e164');
};

export const phoneToReadable = (phone?: string | null) => {
  if (!phone) {
    return '';
  }

  return new PhoneNumber(getCleanPhone(phone)).getNumber('international');
};
