export function alwaysArray(value: any) {
  return Array.isArray(value) ? value : [value];
}
