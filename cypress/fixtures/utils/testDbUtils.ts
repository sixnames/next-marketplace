export function getCliParam(name: string) {
  const paramString = process.argv.find((param) => {
    const paramParts = param.split('=');
    return paramParts[0] === name;
  });
  const paramParts = `${paramString}`.split('=');
  return `${paramParts[1]}`;
}

export function getCliParamBoolean(name: string): boolean {
  const param = getCliParam(name);
  return param === 'true';
}
