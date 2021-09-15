import qs from 'qs';

export function stringifyApiParams(params: any): string {
  if (!params) {
    return '';
  }
  const parsed = qs.stringify(params);
  return parsed ? `?${parsed}` : '';
}

export function parseApiParams(query: any): any {
  return qs.parse(qs.stringify(query));
}
