export function phoneToRaw(phone: string) {
  const p = `${phone}`.replace(/\D/g, '');
  return `7${p.slice(1)}`;
}

export function phoneToRawInput(phone: string) {
  const p = `${phone}`.replace(/\D/g, '');
  return `${p.slice(1)}`;
}

export function phoneFromRaw(raw: string) {
  if (!raw) return '';
  const p = `${raw}`.replace(/\D/g, '');
  return `+7 (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9)}`;
}
