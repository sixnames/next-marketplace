import PhoneNumber from 'awesome-phonenumber';

export const phoneToRaw = (phone?: string | null) => {
  if (!phone) {
    return '';
  }

  return new PhoneNumber(phone).getNumber('e164');
};

export const phoneToReadable = (phone?: string | null) => {
  if (!phone) {
    return '';
  }

  return new PhoneNumber(phone).getNumber('international');
};
