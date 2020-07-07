export function alwaysArray(value?: any) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
