export function alwaysArray(value: any) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function alwaysString(value: any): string {
  if (!value) {
    return '';
  }
  return value ? `${value}` : '';
}
