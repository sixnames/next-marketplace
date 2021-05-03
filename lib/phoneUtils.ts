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
  const countryCode = phone.slice(0, 2);
  const code = phone.slice(2, 5);
  const phonePartA = phone.slice(5, 8);
  const phonePartB = phone.slice(8, 10);
  const phonePartC = phone.slice(10);
  const finalNumber = `${countryCode} ${code} ${phonePartA} ${phonePartB} ${phonePartC}`;
  return finalNumber.replace('+', '');
};
