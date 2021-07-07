export function getConstructorDefaultValue(initialValue?: string) {
  const emptyValue = {
    id: '1',
    version: 1,
    rows: [],
  };

  try {
    if (!initialValue) {
      return emptyValue;
    }
    const value = JSON.parse(initialValue);
    return value;
  } catch {
    return emptyValue;
  }
}
