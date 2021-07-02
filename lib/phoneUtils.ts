const getCleanPhone = (phone: string) => {
  const cleanPhone = phone.replace(/\s|\+|-|\(|\)/g, '');
  return `+${cleanPhone}`;
};

export const phoneToRaw = (phone?: string | null) => {
  if (!phone) {
    return '';
  }
  return getCleanPhone(phone);
};

export const phoneToReadable = (phone?: string | null) => {
  if (!phone) {
    return '';
  }
  const initialPhone = phone.replace('+', '');
  const countryCode = initialPhone.slice(0, 1);
  const code = initialPhone.slice(1, 4);
  const phonePartA = initialPhone.slice(4, 7);
  const phonePartB = initialPhone.slice(7, 9);
  const phonePartC = initialPhone.slice(9);
  return `${countryCode} ${code} ${phonePartA}-${phonePartB}-${phonePartC}`;
};
