import { get } from 'lodash';

export function alwaysArray(value: any) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function alwaysString(value: any): string {
  return value ? `${value}` : '';
}

export function sortObjectsByField(list: any[], fieldName = 'name'): any[] {
  return [...list].sort((a, b) => {
    const nameA = `${get(a, fieldName)}`.toUpperCase();
    const nameB = `${get(b, fieldName)}`.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}
