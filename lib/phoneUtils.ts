const getCleanPhone = (phone: string) => {
  return phone.replace(/\s|\+|-|\(|\)/g, '');
};

const worldWideCountryConde = '8';

export const phoneToRaw = (phone?: string | null) => {
  if (!phone) {
    return '';
  }
  const cleanPhone = getCleanPhone(phone);
  const countryCode = cleanPhone.charAt(0);

  return `${countryCode === worldWideCountryConde ? '' : '+'}${cleanPhone}`;
};

export const phoneToReadable = (phone?: string | null) => {
  if (!phone) {
    return '';
  }
  const cleanPhone = getCleanPhone(phone);
  const countryCode = cleanPhone.charAt(0);
  const code = cleanPhone.slice(1, 4);
  const phonePartA = cleanPhone.slice(4, 7);
  const phonePartB = cleanPhone.slice(7, 9);
  const phonePartC = cleanPhone.slice(9);
  return `${countryCode} ${code} ${phonePartA}-${phonePartB}-${phonePartC}`;
};
